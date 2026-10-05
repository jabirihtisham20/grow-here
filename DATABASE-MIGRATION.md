# PostgreSQL CMS migration (staged)

## Discovery

The repository does not include a PostgreSQL service, `DATABASE_URL`, deployment-provider database binding, or existing database schema. The new database layer uses a standard PostgreSQL connection string and is not tied to one provider. Add `DATABASE_URL` to the local process environment and the hosting provider's server-side environment settings only; never put a real value in source control or a `NEXT_PUBLIC_*` variable.

The current public site continues to read the existing MDX files. Keystatic remains at `/keystatic` and continues using its existing storage configuration during this migration.

## Safe initial setup

1. Provision an empty PostgreSQL database with TLS enabled and create a restricted application role.
2. Set `DATABASE_URL` in an ignored local environment file or secret manager without adding it to Git. Do not put the connection string in a command literal, commit it, or paste it into chat.
3. Run `npm run db:migrate`. Migration `001_initial_cms.sql` only creates CMS tables/indexes and seeds categories with `ON CONFLICT DO NOTHING`; it does not drop or alter existing site files/tables.
4. Run `npm run db:import-mdx` first. This dry run validates every MDX article and referenced local featured image and performs no writes.
5. Back up the target database. Then run `node scripts/import-mdx-to-postgres.js --apply`. The import is transactional and idempotent for the same source paths/slugs; slug collisions with records not imported from the matching MDX file abort the whole transaction. It imports image metadata/URLs while leaving the image files in `public/images`. It never deletes database records, MDX files, or image files.
6. Compare the imported row count and sample posts/images in PostgreSQL with the MDX source before enabling any database-backed public read path.

Do not rerun the importer after editing posts in the CMS: it intentionally treats the original MDX files as the import source and would overwrite matching imported records. Do not switch the public website to PostgreSQL until a provider is connected, the import is verified, and the API/frontend migration has been tested against that database.

## CMS administrator authentication

The CMS uses normalized email addresses and bcrypt password hashes (work factor 12). Set a random `SESSION_SECRET` of at least 32 characters and keep it server-side. After applying migrations, run `npm run admin:create` in an interactive terminal. The command prompts for the initial name, email, password, and confirmation; password input is not echoed and no password is accepted through command arguments or environment variables. It creates the first `SUPER_ADMIN` only when none exists. If exactly one active legacy GitHub `SUPER_ADMIN` has no password, the command enrolls that row instead of creating another account; it accepts the same existing email, or a new email if the legacy row has no email.

The additive `002_email_password_admin_auth.sql` migration adds `password_hash`, `password_changed_at`, normalized-email uniqueness, and login rate-limit storage. It changes legacy `SUSPENDED` status to `DISABLED`, permits null legacy GitHub identity columns, and clears CMS sessions issued by the retired GitHub CMS login. If existing accounts have duplicate emails after lowercase/trim normalization, the migration stops without applying; resolve those duplicates and rerun it. The legacy `github_id` and `github_username` columns are retained for historical rows and are no longer used for CMS authentication. Keystatic's separate `KEYSTATIC_*` GitHub configuration and API routes remain unchanged.

Login failures are rate-limited for 15 minutes after repeated attempts using keyed hashes rather than stored raw email/IP values. Admin removal, disablement, or password reset revokes sessions. Admin APIs protect membership changes server-side and prevent demoting, disabling, or removing the last active `SUPER_ADMIN`.
