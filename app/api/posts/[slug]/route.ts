import { NextResponse } from 'next/server';
import { cmsQuery } from '@/lib/cms/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const result = await cmsQuery(
      `SELECT p.id, p.title, p.slug, p.excerpt, p.content, p.featured_image, p.image_alt,
              p.author_snapshot, p.seo_title, p.seo_description, p.canonical_url,
              p.open_graph_title, p.open_graph_description, p.open_graph_image,
              p.published_at, p.updated_at, c.name AS category_name, c.slug AS category_slug,
              COALESCE(array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags
       FROM cms_posts p JOIN cms_categories c ON c.id=p.category_id
       LEFT JOIN cms_post_tags pt ON pt.post_id=p.id LEFT JOIN cms_tags t ON t.id=pt.tag_id
       WHERE p.slug=$1 AND p.status='PUBLISHED' AND p.published_at <= now()
       GROUP BY p.id, c.id LIMIT 1`,
      [slug]
    );
    if (!result.rowCount) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    return NextResponse.json({ post: result.rows[0] }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } });
  } catch (error) {
    if (error instanceof Error && error.message === 'CMS_DATABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'Database-backed publishing is not enabled yet.' }, { status: 503 });
    }
    console.error('[Public Post API] Request failed.', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ error: 'The published post could not be loaded.' }, { status: 500 });
  }
}
