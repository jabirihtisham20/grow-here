import { NextRequest, NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { hashPassword, passwordProblem } from '@/lib/cms/passwords';
import { withCmsTransaction } from '@/lib/cms/db';
import { assertSameOrigin, cmsErrorResponse, parseJsonObject } from '@/lib/cms/http';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const actor = await requireCmsUser(['SUPER_ADMIN']);
    const { id } = await context.params;
    const body = parseJsonObject(await request.json());
    const password = body.password;
    const confirmation = body.confirmPassword;
    if (typeof password !== 'string' || typeof confirmation !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72) return NextResponse.json({ error: 'Enter a password no longer than 72 UTF-8 bytes.' }, { status: 400 });
    if (password !== confirmation) return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    const problem = passwordProblem(password);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const passwordHash = await hashPassword(password);
    const changed = await withCmsTransaction(async (client) => {
      const result = await client.query<{ id: string; email: string }>(
        'UPDATE cms_users SET password_hash=$2,password_changed_at=now(),updated_at=now() WHERE id=$1 RETURNING id,email',
        [id, passwordHash]
      );
      if (!result.rowCount) return false;
      await client.query('DELETE FROM cms_sessions WHERE user_id=$1', [id]);
      await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id,metadata) VALUES ($1,$2,$3,$4,$5::jsonb)', [actor.id, id === actor.id ? 'PASSWORD_CHANGED' : 'PASSWORD_RESET', 'USER', id, JSON.stringify({ email: result.rows[0].email })]);
      return true;
    });
    if (!changed) return NextResponse.json({ error: 'Administrator not found.' }, { status: 404 });
    const response = NextResponse.json({ ok: true, signedOut: id === actor.id });
    if (id === actor.id) response.cookies.set('growhere_cms_session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
    return response;
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
