import { NextRequest, NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { cmsQuery, withCmsTransaction } from '@/lib/cms/db';
import { assertSameOrigin, boundedString, cmsErrorResponse, parseJsonObject } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireCmsUser();
    const result = await cmsQuery('SELECT key,value,updated_at FROM cms_settings ORDER BY key');
    return NextResponse.json({ settings: result.rows }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return cmsErrorResponse(error); }
}

export async function PUT(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const user = await requireCmsUser(['SUPER_ADMIN','ADMIN']);
    const body = parseJsonObject(await request.json());
    const key = boundedString(body.key, 'key', 80, true)!;
    if (!/^[a-z][a-z0-9_.-]*$/.test(key)) return NextResponse.json({ error: 'Setting key has an invalid format.' }, { status: 400 });
    if (containsSensitiveKey(body.value) || /secret|token|password|credential|private|api.?key/i.test(key)) {
      return NextResponse.json({ error: 'Authentication credentials must remain in server environment settings, not CMS content settings.' }, { status: 400 });
    }
    const result = await withCmsTransaction(async (client) => {
      const saved = await client.query('INSERT INTO cms_settings (key,value,updated_by) VALUES ($1,$2::jsonb,$3) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_by=EXCLUDED.updated_by,updated_at=now() RETURNING key,value,updated_at', [key,JSON.stringify(body.value ?? null),user.id]);
      await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id) VALUES ($1,$2,$3,$4)', [user.id,'SETTING_UPDATED','SETTING',key]);
      return saved.rows[0];
    });
    return NextResponse.json({ setting: result });
  } catch (error) { return cmsErrorResponse(error); }
}

function containsSensitiveKey(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  if (Array.isArray(value)) return value.some(containsSensitiveKey);
  return Object.entries(value).some(([key, child]) => /secret|token|password|credential|private|api.?key/i.test(key) || containsSensitiveKey(child));
}
