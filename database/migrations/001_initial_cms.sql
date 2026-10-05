-- Safe, additive CMS schema. This migration does not alter or delete existing site data.
CREATE TABLE IF NOT EXISTS cms_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id text NOT NULL UNIQUE,
  github_username text NOT NULL,
  email text,
  display_name text NOT NULL,
  avatar_url text,
  role text NOT NULL DEFAULT 'EDITOR' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

CREATE TABLE IF NOT EXISTS cms_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cms_sessions_expiry_idx ON cms_sessions(expires_at);

CREATE TABLE IF NOT EXISTS cms_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  featured_image text,
  image_alt text NOT NULL DEFAULT '',
  author_id uuid REFERENCES cms_users(id) ON DELETE SET NULL,
  author_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  category_id uuid REFERENCES cms_categories(id) ON DELETE SET NULL,
  legacy_category text,
  subcategory text NOT NULL DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  editors_pick boolean NOT NULL DEFAULT false,
  reading_time text NOT NULL DEFAULT '5 min read',
  primary_keyword text,
  secondary_keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  noindex boolean NOT NULL DEFAULT false,
  legacy_source_path text UNIQUE,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  seo_title text,
  seo_description text,
  canonical_url text,
  open_graph_title text,
  open_graph_description text,
  open_graph_image text,
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cms_posts_publication_idx ON cms_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS cms_posts_category_idx ON cms_posts(category_id, status);

CREATE TABLE IF NOT EXISTS cms_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_post_tags (
  post_id uuid NOT NULL REFERENCES cms_posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES cms_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS cms_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_key text NOT NULL UNIQUE,
  public_url text NOT NULL,
  filename text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL CHECK (size_bytes >= 0),
  alt_text text NOT NULL DEFAULT '',
  created_by uuid REFERENCES cms_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  seo_title text,
  seo_description text,
  canonical_url text,
  open_graph_title text,
  open_graph_description text,
  open_graph_image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE TABLE IF NOT EXISTS cms_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_by uuid REFERENCES cms_users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cms_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES cms_users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS cms_activity_logs_created_idx ON cms_activity_logs(created_at DESC);

INSERT INTO cms_categories (name, slug, description) VALUES
  ('Grow', 'grow', 'Botanical care and gardening'),
  ('Space', 'space', 'Organization and small-space living'),
  ('Energy', 'energy', 'Energy saving and renewable living'),
  ('Life', 'life', 'Mindful living and habits')
ON CONFLICT (slug) DO NOTHING;
