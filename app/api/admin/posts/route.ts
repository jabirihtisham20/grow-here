import { NextRequest, NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { cmsQuery, withCmsTransaction } from '@/lib/cms/db';
import { replacePostTags } from '@/lib/cms/posts';
import { assertSameOrigin, boundedString, cmsErrorResponse, parseJsonObject, postStatus, slugValue, stringList } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireCmsUser();
    const page = Math.max(1, Number(request.nextUrl.searchParams.get('page') || 1));
    const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get('limit') || 20)));
    const search = (request.nextUrl.searchParams.get('q') || '').trim().slice(0, 120);
    const status = request.nextUrl.searchParams.get('status');
    if (status && !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid post status filter.' }, { status: 400 });
    }
    const result = await cmsQuery(
      `SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.status, p.published_at, p.updated_at,
              c.name AS category, c.slug AS category_slug,
              COUNT(*) OVER()::int AS total
       FROM cms_posts p LEFT JOIN cms_categories c ON c.id = p.category_id
       WHERE ($1 = '' OR p.title ILIKE '%' || $1 || '%' OR p.slug ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR p.status = $2)
       ORDER BY p.updated_at DESC LIMIT $3 OFFSET $4`,
      [search, status || null, limit, (page - 1) * limit]
    );
    return NextResponse.json({ posts: result.rows, page, limit, total: result.rows[0]?.total || 0 }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const user = await requireCmsUser();
    const body = parseJsonObject(await request.json());
    const title = boundedString(body.title, 'title', 200, true)!;
    const slug = slugValue(body.slug);
    const excerpt = boundedString(body.excerpt, 'excerpt', 500, true)!;
    const content = boundedString(body.content, 'content', 500_000, true)!;
    const category = boundedString(body.category, 'category', 80, true)!;
    const status = postStatus(body.status ?? 'DRAFT');
    const tags = stringList(body.tags, 'tags');
    const featuredImage = boundedString(body.featuredImage, 'featuredImage', 2048);
    const imageAlt = boundedString(body.imageAlt, 'imageAlt', 300) || '';
    const seoTitle = boundedString(body.seoTitle, 'seoTitle', 200);
    const seoDescription = boundedString(body.seoDescription, 'seoDescription', 500);
    const canonicalUrl = boundedString(body.canonicalUrl, 'canonicalUrl', 2048);
    const openGraphTitle = boundedString(body.openGraphTitle, 'openGraphTitle', 200);
    const openGraphDescription = boundedString(body.openGraphDescription, 'openGraphDescription', 500);
    const openGraphImage = boundedString(body.openGraphImage, 'openGraphImage', 2048);

    const created = await withCmsTransaction(async (client) => {
      const categoryResult = await client.query<{ id: string }>('SELECT id FROM cms_categories WHERE slug = $1', [category]);
      if (!categoryResult.rowCount) throw new Error('CMS_CATEGORY_NOT_FOUND');
      const result = await client.query<{ id: string }>(
        `INSERT INTO cms_posts
          (title, slug, excerpt, content, featured_image, image_alt, author_id, author_snapshot,
           category_id, status, seo_title, seo_description, canonical_url, open_graph_title,
           open_graph_description, open_graph_image, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,$15,$16,
           CASE WHEN $10 = 'PUBLISHED' THEN now() ELSE NULL END)
         RETURNING id, slug`,
        [title,slug,excerpt,content,featuredImage,imageAlt,user.id,JSON.stringify({name:user.name,role:user.role}),categoryResult.rows[0].id,status,seoTitle,seoDescription,canonicalUrl,openGraphTitle,openGraphDescription,openGraphImage]
      );
      await replacePostTags(client, result.rows[0].id, tags);
      await client.query('INSERT INTO cms_activity_logs (user_id, action, entity, entity_id) VALUES ($1,$2,$3,$4)', [user.id, 'POST_CREATED', 'POST', result.rows[0].id]);
      return result.rows[0];
    });
    return NextResponse.json({ post: created }, { status: 201 });
  } catch (error) {
    if (isConflict(error)) return NextResponse.json({ error: 'A post with that slug already exists.' }, { status: 409 });
    if (error instanceof Error && error.message === 'CMS_CATEGORY_NOT_FOUND') return NextResponse.json({ error: 'Choose an existing category.' }, { status: 400 });
    return cmsErrorResponse(error);
  }
}

function isConflict(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}
