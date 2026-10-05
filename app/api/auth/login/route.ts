import { NextRequest, NextResponse } from 'next/server';
import { CMS_SESSION_TTL_SECONDS, createOpaqueSessionToken, hashLoginIdentifier, hashSessionToken, sessionCookieOptions } from '@/lib/cms/auth';
import { getDummyPasswordHash, verifyPassword } from '@/lib/cms/passwords';
import { isLoginRateLimited, recordFailedLogin, requestAddress } from '@/lib/cms/login-rate-limit';
import { withCmsTransaction, cmsQuery } from '@/lib/cms/db';
import { assertSameOrigin, cmsErrorResponse, parseJsonObject } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LoginRow = {
  id: string;
  email: string;
  display_name: string;
  password_hash: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  status: 'ACTIVE' | 'DISABLED';
};

const invalidCredentials = () => NextResponse.json(
  { error: 'Email or password is incorrect, or this account is unavailable.' },
  { status: 401 }
);

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const body = parseJsonObject(await request.json());
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const address = requestAddress(request);

    if (await isLoginRateLimited(email, address)) {
      return NextResponse.json({ error: 'Too many sign-in attempts. Wait 15 minutes and try again.' }, { status: 429 });
    }

    const emailIsValid = email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailIsValid || !password || Buffer.byteLength(password, 'utf8') > 72) {
      await recordFailedLogin(email, address);
      return invalidCredentials();
    }

    const found = await cmsQuery<LoginRow>(
      `SELECT id, email, display_name, password_hash, role, status
       FROM cms_users WHERE email = $1 LIMIT 1`,
      [email]
    );
    const candidate = found.rows[0];
    const hash = candidate?.password_hash || await getDummyPasswordHash();
    const passwordMatches = await verifyPassword(password, hash);

    if (!candidate || !candidate.password_hash || candidate.status !== 'ACTIVE' || !passwordMatches) {
      await recordFailedLogin(email, address);
      return invalidCredentials();
    }

    const token = createOpaqueSessionToken();
    const tokenHash = hashSessionToken(token);
    const loggedIn = await withCmsTransaction(async (client) => {
      const current = await client.query<LoginRow>(
        `UPDATE cms_users SET last_login_at = now(), updated_at = now()
         WHERE id = $1 AND status = 'ACTIVE' AND password_hash = $2
         RETURNING id, email, display_name, password_hash, role, status`,
        [candidate.id, candidate.password_hash]
      );
      if (!current.rowCount) return null;
      const user = current.rows[0];
      await client.query(
        'INSERT INTO cms_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, now() + ($3 * interval \'1 second\'))',
        [user.id, tokenHash, CMS_SESSION_TTL_SECONDS]
      );
      await client.query('DELETE FROM cms_login_rate_limits WHERE key_hash = $1', [`email:${hashLoginIdentifier(email)}`]);
      await client.query('INSERT INTO cms_activity_logs (user_id, action, entity) VALUES ($1, $2, $3)', [user.id, 'LOGIN', 'SESSION']);
      return user;
    });

    if (!loggedIn) {
      await recordFailedLogin(email, address);
      return invalidCredentials();
    }

    const response = NextResponse.json({
      user: { id: loggedIn.id, email: loggedIn.email, name: loggedIn.display_name, role: loggedIn.role },
    }, { headers: { 'Cache-Control': 'private, no-store' } });
    response.cookies.set('growhere_cms_session', token, sessionCookieOptions());
    return response;
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
