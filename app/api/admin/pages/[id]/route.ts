import { NextRequest, NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { cmsQuery, withCmsTransaction } from '@/lib/cms/db';
import { assertSameOrigin, boundedString, cmsErrorResponse, parseJsonObject, postStatus, slugValue } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  try {
    await requireCmsUser();
    const { id } = await context.params;
    const result = await cmsQuery('SELECT * FROM cms_pages WHERE id=$1 LIMIT 1', [id]);
    if (!result.rowCount) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    return NextResponse.json({ page: result.rows[0] }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return cmsErrorResponse(error); }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireCmsUser();
    const { id } = await context.params;
    const body = parseJsonObject(await request.json());
    const title = boundedString(body.title, 'title', 200, true)!;
    const slug = slugValue(body.slug);
    const content = boundedString(body.content, 'content', 500_000, true)!;
    const status = postStatus(body.status);
    const seoTitle = boundedString(body.seoTitle, 'seoTitle', 200);
    const seoDescription = boundedString(body.seoDescription, 'seoDescription', 500);
    const canonicalUrl = boundedString(body.canonicalUrl, 'canonicalUrl', 2048);
    const page = await withCmsTransaction(async (client) => {
      const saved = await client.query(
        `UPDATE cms_pages SET title=$2,slug=$3,content=$4,status=$5,seo_title=$6,seo_description=$7,canonical_url=$8,
         published_at=CASE WHEN $5='PUBLISHED' THEN COALESCE(published_at,now()) ELSE NULL END,updated_at=now()
         WHERE id=$1 RETURNING id,title,slug,status,updated_at`,
        [id,title,slug,content,status,seoTitle,seoDescription,canonicalUrl]
      );
      if (saved.rowCount) await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id) VALUES ($1,$2,$3,$4)', [user.id,status==='PUBLISHED'?'PAGE_PUBLISHED':'PAGE_UPDATED','PAGE',id]);
      return saved.rows[0];
    });
    if (!page) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    return NextResponse.json({ page });
  } catch (error) {
    if (isConflict(error)) return NextResponse.json({ error: 'A page with that slug already exists.' }, { status: 409 });
    return cmsErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireCmsUser(['SUPER_ADMIN','ADMIN']);
    const { id } = await context.params;
    const deleted = await withCmsTransaction(async (client) => {
      const result = await client.query('DELETE FROM cms_pages WHERE id=$1 RETURNING id', [id]);
      if (result.rowCount) await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id) VALUES ($1,$2,$3,$4)', [user.id,'PAGE_DELETED','PAGE',id]);
      return Boolean(result.rowCount);
    });
    if (!deleted) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) { return cmsErrorResponse(error); }
}

function isConflict(error: unknown) { return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505'; }
