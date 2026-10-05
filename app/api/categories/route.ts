import { NextResponse } from 'next/server';
import { cmsQuery } from '@/lib/cms/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await cmsQuery(
      `SELECT c.id, c.name, c.slug, c.description, COUNT(p.id)::int AS published_posts
       FROM cms_categories c LEFT JOIN cms_posts p ON p.category_id=c.id AND p.status='PUBLISHED' AND p.published_at <= now()
       GROUP BY c.id ORDER BY c.name`
    );
    return NextResponse.json({ categories: result.rows }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60' } });
  } catch (error) {
    if (error instanceof Error && error.message === 'CMS_DATABASE_NOT_CONFIGURED') return NextResponse.json({ error: 'Database-backed publishing is not enabled yet.' }, { status: 503 });
    console.error('[Public Categories API] Request failed.', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ error: 'Categories could not be loaded.' }, { status: 500 });
  }
}
