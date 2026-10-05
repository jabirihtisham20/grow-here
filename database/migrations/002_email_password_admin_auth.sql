-- Add email/password authentication while preserving CMS users and all content.
ALTER TABLE cms_users ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE cms_users ADD COLUMN IF NOT EXISTS password_changed_at timestamptz;
ALTER TABLE cms_users ALTER COLUMN github_id DROP NOT NULL;
ALTER TABLE cms_users ALTER COLUMN github_username DROP NOT NULL;

DO $$
DECLARE constraint_row record;
BEGIN
  FOR constraint_row IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'cms_users'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE cms_users DROP CONSTRAINT %I', constraint_row.conname);
  END LOOP;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM cms_users
    WHERE email IS NOT NULL AND btrim(email) <> ''
    GROUP BY lower(btrim(email)) HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate CMS email addresses must be resolved before applying email/password authentication.';
  END IF;
END $$;

UPDATE cms_users SET email = NULL WHERE email IS NOT NULL AND btrim(email) = '';
UPDATE cms_users
SET email = lower(btrim(email))
WHERE email IS NOT NULL AND email <> lower(btrim(email));

UPDATE cms_users SET status = 'DISABLED' WHERE status = 'SUSPENDED';

ALTER TABLE cms_users
  ADD CONSTRAINT cms_users_status_check CHECK (status IN ('ACTIVE', 'DISABLED'));

CREATE UNIQUE INDEX IF NOT EXISTS cms_users_email_normalized_unique_idx
  ON cms_users (lower(email)) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS cms_login_rate_limits (
  key_hash text PRIMARY KEY,
  failures integer NOT NULL DEFAULT 0 CHECK (failures >= 0),
  window_started_at timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz
);
CREATE INDEX IF NOT EXISTS cms_login_rate_limits_window_idx ON cms_login_rate_limits(window_started_at);

COMMENT ON COLUMN cms_users.github_id IS 'Legacy CMS GitHub OAuth identity, retained for historical rows; not used for authentication.';
COMMENT ON COLUMN cms_users.github_username IS 'Legacy CMS GitHub username, retained for historical rows; not used for authentication.';

-- Sessions created through the retired GitHub CMS flow must not survive this auth change.
DELETE FROM cms_sessions;
