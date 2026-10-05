import { NextRequest, NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { withCmsTransaction } from '@/lib/cms/db';
import { assertSameOrigin, boundedString, cmsErrorResponse, parseJsonObject } from '@/lib/cms/http';

export const runtime = 'nodejs';
type Context = { params: Promise<{ id: string }> };
const roles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as const;

export async function PATCH(request: NextRequest, context: Context) {
  try {
    assertSameOrigin(request);
    const actor = await requireCmsUser(['SUPER_ADMIN']);
    const { id } = await context.params;
    const body = parseJsonObject(await request.json());
    const role = body.role;
    const status = body.status;
    const name = body.name === undefined ? undefined : boundedString(body.name, 'Name', 120, true)!;
    const rawEmail = body.email === undefined ? undefined : boundedString(body.email, 'Email', 254, true)!;
    const email = rawEmail?.toLowerCase();

    if (role !== undefined && (typeof role !== 'string' || !roles.includes(role as (typeof roles)[number]))) return NextResponse.json({ error: 'Select a valid role.' }, { status: 400 });
    if (status !== undefined && status !== 'ACTIVE' && status !== 'DISABLED') return NextResponse.json({ error: 'Select a valid account status.' }, { status: 400 });
    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    if (id === actor.id && (status === 'DISABLED' || (role !== undefined && role !== 'SUPER_ADMIN'))) return NextResponse.json({ error: 'You cannot disable or demote your own SUPER_ADMIN account.' }, { status: 400 });

    const user = await withCmsTransaction(async (client) => {
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['grow-here-admin-membership']);
      const current = await client.query<{ id: string; role: string; status: string }>('SELECT id,role,status FROM cms_users WHERE id=$1 FOR UPDATE', [id]);
      if (!current.rowCount) return null;
      const target = current.rows[0];
      const nextRole = role === undefined ? target.role : role;
      const nextStatus = status === undefined ? target.status : status;
      if (target.role === 'SUPER_ADMIN' && target.status === 'ACTIVE' && (nextRole !== 'SUPER_ADMIN' || nextStatus !== 'ACTIVE')) {
        const count = await client.query<{ count: number }>("SELECT count(*)::int AS count FROM cms_users WHERE role='SUPER_ADMIN' AND status='ACTIVE'");
        if (count.rows[0].count <= 1) throw new Error('CMS_LAST_ACTIVE_SUPER_ADMIN');
      }

      const updated = await client.query(
        `UPDATE cms_users SET email=COALESCE($2,email), display_name=COALESCE($3,display_name),
         role=COALESCE($4,role), status=COALESCE($5,status), updated_at=now()
         WHERE id=$1
         RETURNING id,email,display_name,role,status,created_at,last_login_at,(password_hash IS NOT NULL) AS has_password`,
        [id, email ?? null, name ?? null, role ?? null, status ?? null]
      );
      if (status === 'DISABLED') await client.query('DELETE FROM cms_sessions WHERE user_id=$1', [id]);

      if (target.role !== nextRole) {
        await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id,metadata) VALUES ($1,$2,$3,$4,$5::jsonb)', [actor.id, 'ADMIN_ROLE_CHANGED', 'USER', id, JSON.stringify({ from: target.role, to: nextRole })]);
      }
      if (target.status !== nextStatus) {
        const action = nextStatus === 'DISABLED' ? 'ADMIN_DISABLED' : 'ADMIN_ENABLED';
        await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id,metadata) VALUES ($1,$2,$3,$4,$5::jsonb)', [actor.id, action, 'USER', id, JSON.stringify({ email })]);
      }
      if (email !== undefined || name !== undefined) {
        await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id,metadata) VALUES ($1,$2,$3,$4,$5::jsonb)', [actor.id, 'ADMIN_PROFILE_UPDATED', 'USER', id, JSON.stringify({ email: email ?? null, name: name ?? null })]);
      }
      return updated.rows[0];
    });
    if (!user) return NextResponse.json({ error: 'Administrator not found.' }, { status: 404 });
    return NextResponse.json({ user }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    if (error instanceof Error && error.message === 'CMS_LAST_ACTIVE_SUPER_ADMIN') return NextResponse.json({ error: 'The last active SUPER_ADMIN cannot be demoted or disabled.' }, { status: 409 });
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') return NextResponse.json({ error: 'An administrator with that email already exists.' }, { status: 409 });
    return cmsErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    assertSameOrigin(request);
    const actor = await requireCmsUser(['SUPER_ADMIN']);
    const { id } = await context.params;
    if (id === actor.id) return NextResponse.json({ error: 'You cannot remove your own account while signed in.' }, { status: 400 });

    const deleted = await withCmsTransaction(async (client) => {
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['grow-here-admin-membership']);
      const target = await client.query<{ id: string; email: string; role: string; status: string }>('SELECT id,email,role,status FROM cms_users WHERE id=$1 FOR UPDATE', [id]);
      if (!target.rowCount) return false;
      if (target.rows[0].role === 'SUPER_ADMIN' && target.rows[0].status === 'ACTIVE') {
        const count = await client.query<{ count: number }>("SELECT count(*)::int AS count FROM cms_users WHERE role='SUPER_ADMIN' AND status='ACTIVE'");
        if (count.rows[0].count <= 1) throw new Error('CMS_LAST_ACTIVE_SUPER_ADMIN');
      }
      await client.query('DELETE FROM cms_users WHERE id=$1', [id]);
      await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id,metadata) VALUES ($1,$2,$3,$4,$5::jsonb)', [actor.id, 'ADMIN_REMOVED', 'USER', id, JSON.stringify({ email: target.rows[0].email, role: target.rows[0].role })]);
      return true;
    });
    if (!deleted) return NextResponse.json({ error: 'Administrator not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'CMS_LAST_ACTIVE_SUPER_ADMIN') return NextResponse.json({ error: 'The last active SUPER_ADMIN cannot be removed.' }, { status: 409 });
    return cmsErrorResponse(error);
  }
}
