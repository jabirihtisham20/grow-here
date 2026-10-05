import { NextResponse } from 'next/server';
import { requireCmsUser } from '@/lib/cms/auth';
import { cmsQuery } from '@/lib/cms/db';
import { cmsErrorResponse } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireCmsUser();
    const result = await cmsQuery('SELECT id,storage_key,public_url,filename,mime_type,size_bytes,alt_text,created_at FROM cms_media ORDER BY created_at DESC');
    return NextResponse.json({ media: result.rows }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) { return cmsErrorResponse(error); }
}
