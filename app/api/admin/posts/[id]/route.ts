import { NextRequest, NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { cmsQuery, withCmsTransaction } from '@/lib/cms/db';
import { assertSameOrigin, boundedString, cmsErrorResponse, parseJsonObject, postStatus, slugValue, stringList } from '@/lib/cms/http';
import { replacePostTags } from '@/lib/cms/posts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireCmsUser();
    const { id } = await context.params;
    const result = await cmsQuery(
      `SELECT p.*, c.slug AS category,
         COALESCE(array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags
       FROM cms_posts p LEFT JOIN cms_categories c ON c.id = p.category_id
       LEFT JOIN cms_post_tags pt ON pt.post_id = p.id LEFT JOIN cms_tags t ON t.id = pt.tag_id
       WHERE p.id = $1 GROUP BY p.id, c.slug LIMIT 1`,
      [id]
    );
    if (!result.rowCount) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    return NextResponse.json({ post: result.rows[0] }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    assertSameOrigin(request);
    const user = await requireCmsUser();
    const { id } = await context.params;
    const body = parseJsonObject(await request.json());
    const title = boundedString(body.title, 'title', 200, true)!;
    const slug = slugValue(body.slug);
    const excerpt = boundedString(body.excerpt, 'excerpt', 500, true)!;
    const content = boundedString(body.content, 'content', 500_000, true)!;
    const category = boundedString(body.category, 'category', 80, true)!;
    const status = postStatus(body.status);
    const tags = stringList(body.tags, 'tags');
    const featuredImage = boundedString(body.featuredImage, 'featuredImage', 2048);
    const imageAlt = boundedString(body.imageAlt, 'imageAlt', 300) || '';
    const seoTitle = boundedString(body.seoTitle, 'seoTitle', 200);
    const seoDescription = boundedString(body.seoDescription, 'seoDescription', 500);
    const canonicalUrl = boundedString(body.canonicalUrl, 'canonicalUrl', 2048);
    const openGraphTitle = boundedString(body.openGraphTitle, 'openGraphTitle', 200);
    const openGraphDescription = boundedString(body.openGraphDescription, 'openGraphDescription', 500);
    const openGraphImage = boundedString(body.openGraphImage, 'openGraphImage', 2048);

    const saved = await withCmsTransaction(async (client) => {
      const categoryResult = await client.query<{ id: string }>('SELECT id FROM cms_categories WHERE slug = $1', [category]);
      if (!categoryResult.rowCount) throw new Error('CMS_CATEGORY_NOT_FOUND');
      const result = await client.query<{ id: string }>(
        `UPDATE cms_posts p SET title=$2, slug=$3, excerpt=$4, content=$5, featured_image=$6,
          image_alt=$7, category_id=$8, status=$9, seo_title=$10, seo_description=$11,
          canonical_url=$12, open_graph_title=$13, open_graph_description=$14, open_graph_image=$15,
          published_at=CASE WHEN $9='PUBLISHED' THEN COALESCE(p.published_at, now()) ELSE NULL END,
          updated_at=now()
         WHERE p.id=$1 RETURNING p.id, p.slug, p.status`,
        [id,title,slug,excerpt,content,featuredImage,imageAlt,categoryResult.rows[0].id,status,seoTitle,seoDescription,canonicalUrl,openGraphTitle,openGraphDescription,openGraphImage]
      );
      if (!result.rowCount) return null;
      await replacePostTags(client, id, tags);
      const action = status === 'PUBLISHED' ? 'POST_PUBLISHED' : 'POST_UPDATED';
      await client.query('INSERT INTO cms_activity_logs (user_id, action, entity, entity_id) VALUES ($1,$2,$3,$4)', [user.id, action, 'POST', id]);
      return result.rows[0];
    });
    if (!saved) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    return NextResponse.json({ post: saved });
  } catch (error) {
    if (isConflict(error)) return NextResponse.json({ error: 'A post with that slug already exists.' }, { status: 409 });
    if (error instanceof Error && error.message === 'CMS_CATEGORY_NOT_FOUND') return NextResponse.json({ error: 'Choose an existing category.' }, { status: 400 });
    return cmsErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    assertSameOrigin(request);
    const user = await requireCmsUser(['SUPER_ADMIN', 'ADMIN']);
    const { id } = await context.params;
    const result = await withCmsTransaction(async (client) => {
      const removed = await client.query<{ id: string }>('DELETE FROM cms_posts WHERE id=$1 RETURNING id', [id]);
      if (!removed.rowCount) return false;
      await client.query('INSERT INTO cms_activity_logs (user_id, action, entity, entity_id) VALUES ($1,$2,$3,$4)', [user.id, 'POST_DELETED', 'POST', id]);
      return true;
    });
    if (!result) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

function isConflict(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}
