import { NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { cmsQuery } from '@/lib/cms/db';
import { cmsErrorResponse } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireCmsUser();
    // Keep the overview to one query. Issuing six queries in parallel can
    // exhaust the connection budget of hosted PostgreSQL pools when several
    // admin pages load together.
    const result = await cmsQuery(`
      SELECT
        json_build_object(
          'total', (SELECT COUNT(*)::int FROM cms_posts),
          'published', (SELECT COUNT(*)::int FROM cms_posts WHERE status='PUBLISHED'),
          'drafts', (SELECT COUNT(*)::int FROM cms_posts WHERE status='DRAFT')
        ) AS post_counts,
        (SELECT COUNT(*)::int FROM cms_categories) AS category_count,
        (SELECT COUNT(*)::int FROM cms_media) AS media_count,
        (SELECT COUNT(*)::int FROM cms_users WHERE status='ACTIVE') AS user_count,
        COALESCE((
          SELECT json_agg(recent_posts)
          FROM (SELECT id,title,slug,status,updated_at FROM cms_posts ORDER BY updated_at DESC LIMIT 5) recent_posts
        ), '[]'::json) AS recent_posts,
        COALESCE((
          SELECT json_agg(recent_activity)
          FROM (
            SELECT l.id,l.action,l.entity,l.entity_id,l.created_at,u.display_name,u.email
            FROM cms_activity_logs l LEFT JOIN cms_users u ON u.id=l.user_id
            ORDER BY l.created_at DESC LIMIT 8
          ) recent_activity
        ), '[]'::json) AS recent_activity
    `);
    const overview = result.rows[0];
    return NextResponse.json({
      counts: { posts: overview.post_counts, categories: overview.category_count, media: overview.media_count, users: overview.user_count },
      recentPosts: overview.recent_posts,
      recentActivity: overview.recent_activity,
    }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
