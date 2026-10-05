import 'server-only';
import { createHmac, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { cmsQuery, withCmsTransaction } from './db';

export const CMS_SESSION_COOKIE = 'growhere_cms_session';
export const CMS_SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

export interface CmsUser {
  id: string;
  email: string | null;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  status: 'ACTIVE' | 'DISABLED';
}

export class CmsAuthError extends Error {
  constructor(public readonly status: 400 | 401 | 403 | 429, message: string) {
    super(message);
    this.name = 'CmsAuthError';
  }
}

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('CMS_SESSION_SECRET_NOT_CONFIGURED');
  return secret;
}

export function hashSessionToken(token: string): string {
  return createHmac('sha256', sessionSecret()).update(token).digest('hex');
}

export function hashLoginIdentifier(value: string): string {
  return createHmac('sha256', sessionSecret()).update(value).digest('hex');
}

export function createOpaqueSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export async function getCmsUser(): Promise<CmsUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_SESSION_COOKIE)?.value;
  if (!token) return null;

  const result = await cmsQuery<CmsUser & { display_name: string }>(
    `SELECT u.id, u.email, u.display_name, u.role, u.status
     FROM cms_sessions s JOIN cms_users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now() AND u.status = 'ACTIVE'
     LIMIT 1`,
    [hashSessionToken(token)]
  );
  const row = result.rows[0];
  if (!row) return null;
  return { id: row.id, email: row.email, name: row.display_name, role: row.role, status: row.status };
}

export async function requireCmsUser(roles?: CmsUser['role'][]): Promise<CmsUser> {
  const user = await getCmsUser();
  if (!user) throw new CmsAuthError(401, 'Sign in is required.');
  if (roles && !roles.includes(user.role)) throw new CmsAuthError(403, 'Your role cannot perform this action.');
  return user;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: CMS_SESSION_TTL_SECONDS,
  };
}

export async function destroyCmsSession(token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);
  await withCmsTransaction(async (client) => {
    const result = await client.query<{ user_id: string }>(
      'DELETE FROM cms_sessions WHERE token_hash = $1 RETURNING user_id',
      [tokenHash]
    );
    if (result.rows[0]) {
      await client.query(
        'INSERT INTO cms_activity_logs (user_id, action, entity) VALUES ($1, $2, $3)',
        [result.rows[0].user_id, 'LOGOUT', 'SESSION']
      );
    }
  });
}
