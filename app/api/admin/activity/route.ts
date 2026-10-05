import { NextRequest, NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { cmsQuery } from '@/lib/cms/db';
import { cmsErrorResponse } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await requireCmsUser(['SUPER_ADMIN','ADMIN']);
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get('limit') || 50)));
    const result = await cmsQuery(`SELECT l.id,l.action,l.entity,l.entity_id,l.metadata,l.created_at,u.display_name,u.email
      FROM cms_activity_logs l LEFT JOIN cms_users u ON u.id=l.user_id ORDER BY l.created_at DESC LIMIT $1`, [limit]);
    return NextResponse.json({ activity: result.rows }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return cmsErrorResponse(error); }
}
