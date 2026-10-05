const fs = require('node:fs');
const path = require('node:path');
const { Pool } = require('pg');
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required. Set it in the process environment; do not put credentials in source control.');
  }

  const migrationDirectory = path.join(process.cwd(), 'database', 'migrations');
  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 1000,
  });

  try {
    const client = await pool.connect();
    try {
      await client.query('CREATE TABLE IF NOT EXISTS cms_schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
      const migrationFiles = fs.readdirSync(migrationDirectory).filter((name) => /^\d+_.+\.sql$/.test(name)).sort();
      for (const filename of migrationFiles) {
        const applied = await client.query('SELECT 1 FROM cms_schema_migrations WHERE version = $1', [filename]);
        if (applied.rowCount) continue;

        await client.query('BEGIN');
        try {
          await client.query(fs.readFileSync(path.join(migrationDirectory, filename), 'utf8'));
          await client.query('INSERT INTO cms_schema_migrations(version) VALUES($1)', [filename]);
          await client.query('COMMIT');
          console.log(`Applied ${filename}.`);
        } catch (error) {
          await client.query('ROLLBACK');
          throw error;
        }
      }
      console.log('CMS migrations completed. Existing CMS content was preserved.');
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(`CMS migration failed: ${error instanceof Error ? error.message : 'Unknown database error'}`);
  process.exitCode = 1;
});
