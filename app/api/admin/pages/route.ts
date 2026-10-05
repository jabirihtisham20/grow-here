import { NextRequest, NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { cmsQuery, withCmsTransaction } from '@/lib/cms/db';
import { assertSameOrigin, boundedString, cmsErrorResponse, parseJsonObject, postStatus, slugValue } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireCmsUser();
    const result = await cmsQuery('SELECT id,title,slug,status,updated_at,published_at FROM cms_pages ORDER BY updated_at DESC');
    return NextResponse.json({ pages: result.rows }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return cmsErrorResponse(error); }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const user = await requireCmsUser();
    const body = parseJsonObject(await request.json());
    const title = boundedString(body.title, 'title', 200, true)!;
    const slug = slugValue(body.slug);
    const content = boundedString(body.content, 'content', 500_000, true)!;
    const status = postStatus(body.status ?? 'DRAFT');
    const seoTitle = boundedString(body.seoTitle, 'seoTitle', 200);
    const seoDescription = boundedString(body.seoDescription, 'seoDescription', 500);
    const canonicalUrl = boundedString(body.canonicalUrl, 'canonicalUrl', 2048);
    const page = await withCmsTransaction(async (client) => {
      const saved = await client.query(
        `INSERT INTO cms_pages (title,slug,content,status,seo_title,seo_description,canonical_url,published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,CASE WHEN $4='PUBLISHED' THEN now() ELSE NULL END)
         RETURNING id,title,slug,status,updated_at`, [title,slug,content,status,seoTitle,seoDescription,canonicalUrl]
      );
      await client.query('INSERT INTO cms_activity_logs (user_id,action,entity,entity_id) VALUES ($1,$2,$3,$4)', [user.id,'PAGE_CREATED','PAGE',saved.rows[0].id]);
      return saved.rows[0];
    });
    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    if (isConflict(error)) return NextResponse.json({ error: 'A page with that slug already exists.' }, { status: 409 });
    return cmsErrorResponse(error);
  }
}

function isConflict(error: unknown) { return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505'; }
