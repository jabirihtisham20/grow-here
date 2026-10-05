import { NextRequest, NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { withCmsTransaction, cmsQuery } from '@/lib/cms/db';
import { hashPassword, passwordProblem } from '@/lib/cms/passwords';
import { assertSameOrigin, boundedString, cmsErrorResponse, parseJsonObject } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const roles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as const;

export async function GET() {
  try {
    await requireCmsUser(['SUPER_ADMIN']);
    const result = await cmsQuery(
      `SELECT id, email, display_name, role, status, created_at, last_login_at, (password_hash IS NOT NULL) AS has_password
       FROM cms_users ORDER BY created_at DESC`
    );
    return NextResponse.json({ users: result.rows }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const actor = await requireCmsUser(['SUPER_ADMIN']);
    const body = parseJsonObject(await request.json());
    const name = boundedString(body.name, 'Name', 120, true)!;
    const email = boundedString(body.email, 'Email', 254, true)!.toLowerCase();
    const password = body.password;
    const confirmPassword = body.confirmPassword;
    const role = body.role;
    if (!emailPattern.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    if (typeof password !== 'string' || typeof confirmPassword !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72) return NextResponse.json({ error: 'Enter a password no longer than 72 UTF-8 bytes.' }, { status: 400 });
    if (password !== confirmPassword) return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    const passwordError = passwordProblem(password);
    if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });
    if (typeof role !== 'string' || !roles.includes(role as (typeof roles)[number])) return NextResponse.json({ error: 'Select a valid role.' }, { status: 400 });

    const passwordHash = await hashPassword(password);
    const created = await withCmsTransaction(async (client) => {
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['grow-here-admin-membership']);
      const inserted = await client.query(
        `INSERT INTO cms_users (email, password_hash, display_name, role, status, password_changed_at)
         VALUES ($1, $2, $3, $4, 'ACTIVE', now())
         RETURNING id, email, display_name, role, status, created_at, last_login_at`,
        [email, passwordHash, name, role]
      );
      await client.query(
        'INSERT INTO cms_activity_logs (user_id,action,entity,entity_id,metadata) VALUES ($1,$2,$3,$4,$5::jsonb)',
        [actor.id, 'ADMIN_CREATED', 'USER', inserted.rows[0].id, JSON.stringify({ email, role })]
      );
      return inserted.rows[0];
    });
    return NextResponse.json({ user: created }, { status: 201, headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return NextResponse.json({ error: 'An administrator with that email already exists.' }, { status: 409 });
    }
    return cmsErrorResponse(error);
  }
}
