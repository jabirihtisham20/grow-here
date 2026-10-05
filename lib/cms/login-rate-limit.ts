import 'server-only';
import type { PoolClient } from 'pg';
import { hashLoginIdentifier } from './auth';
import { withCmsTransaction } from './db';

const MAX_FAILURES = 8;
const WINDOW_MINUTES = 15;

function loginKeys(email: string, address: string) {
  return [
    `email:${hashLoginIdentifier(email)}`,
    `address:${hashLoginIdentifier(address || 'unknown')}`,
  ].sort();
}

async function lockKeys(client: PoolClient, keys: string[]) {
  for (const key of keys) await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [key]);
}

export async function isLoginRateLimited(email: string, address: string): Promise<boolean> {
  const keys = loginKeys(email, address);
  return withCmsTransaction(async (client) => {
    await lockKeys(client, keys);
    const result = await client.query<{ blocked: boolean }>(
      'SELECT bool_or(blocked_until > now()) AS blocked FROM cms_login_rate_limits WHERE key_hash = ANY($1::text[])',
      [keys]
    );
    return Boolean(result.rows[0]?.blocked);
  });
}

export async function recordFailedLogin(email: string, address: string): Promise<void> {
  const keys = loginKeys(email, address);
  await withCmsTransaction(async (client) => {
    await lockKeys(client, keys);
    await client.query("DELETE FROM cms_login_rate_limits WHERE window_started_at < now() - interval '1 day' AND (blocked_until IS NULL OR blocked_until < now())");
    for (const key of keys) {
      await client.query(
        `INSERT INTO cms_login_rate_limits (key_hash, failures, window_started_at, blocked_until)
         VALUES ($1, 1, now(), NULL)
         ON CONFLICT (key_hash) DO UPDATE SET
           failures = CASE
             WHEN cms_login_rate_limits.window_started_at < now() - ($2 * interval '1 minute') THEN 1
             ELSE cms_login_rate_limits.failures + 1
           END,
           window_started_at = CASE
             WHEN cms_login_rate_limits.window_started_at < now() - ($2 * interval '1 minute') THEN now()
             ELSE cms_login_rate_limits.window_started_at
           END,
           blocked_until = CASE
             WHEN (CASE
               WHEN cms_login_rate_limits.window_started_at < now() - ($2 * interval '1 minute') THEN 1
               ELSE cms_login_rate_limits.failures + 1
             END) >= $3 THEN now() + ($2 * interval '1 minute')
             ELSE NULL
           END`,
        [key, WINDOW_MINUTES, MAX_FAILURES]
      );
    }
    await client.query(
      `INSERT INTO cms_activity_logs (action, entity, metadata)
       VALUES ('LOGIN_FAILED', 'AUTH', jsonb_build_object('email_fingerprint', $1::text))`,
      [hashLoginIdentifier(email)]
    );
  });
}

export function requestAddress(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || 'unknown';
}
