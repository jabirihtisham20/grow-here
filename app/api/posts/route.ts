import { NextRequest, NextResponse } from 'next/server';
import { cmsQuery } from '@/lib/cms/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const page = Math.max(1, Number(request.nextUrl.searchParams.get('page') || 1));
    const limit = Math.min(50, Math.max(1, Number(request.nextUrl.searchParams.get('limit') || 20)));
    const category = request.nextUrl.searchParams.get('category');
    const result = await cmsQuery(
      `SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.image_alt, p.author_snapshot,
              p.status, p.seo_title, p.seo_description, p.canonical_url, p.open_graph_title,
              p.open_graph_description, p.open_graph_image, p.published_at, p.updated_at,
              c.name AS category_name, c.slug AS category_slug,
              COALESCE(array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tags,
              COUNT(*) OVER()::int AS total
       FROM cms_posts p JOIN cms_categories c ON c.id = p.category_id
       LEFT JOIN cms_post_tags pt ON pt.post_id=p.id LEFT JOIN cms_tags t ON t.id=pt.tag_id
       WHERE p.status='PUBLISHED' AND p.published_at <= now() AND ($1::text IS NULL OR c.slug=$1)
       GROUP BY p.id, c.id ORDER BY p.published_at DESC LIMIT $2 OFFSET $3`,
      [category, limit, (page - 1) * limit]
    );
    return NextResponse.json({ posts: result.rows, page, limit, total: result.rows[0]?.total || 0 }, {
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'CMS_DATABASE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'Database-backed publishing is not enabled yet.' }, { status: 503 });
    }
    console.error('[Public Posts API] Request failed.', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ error: 'Published posts could not be loaded.' }, { status: 500 });
  }
}
