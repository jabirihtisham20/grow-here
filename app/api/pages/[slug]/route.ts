import { NextResponse } from 'next/server';
import { cmsQuery } from '@/lib/cms/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const result = await cmsQuery('SELECT title,slug,content,seo_title,seo_description,canonical_url,published_at,updated_at FROM cms_pages WHERE slug=$1 AND status=\'PUBLISHED\' AND published_at <= now() LIMIT 1', [slug]);
    if (!result.rowCount) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    return NextResponse.json({ page: result.rows[0] }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' } });
  } catch (error) {
    if (error instanceof Error && error.message === 'CMS_DATABASE_NOT_CONFIGURED') return NextResponse.json({ error: 'Database-backed publishing is not enabled yet.' }, { status: 503 });
    console.error('[Public Pages API] Request failed.', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ error: 'Published page could not be loaded.' }, { status: 500 });
  }
}
