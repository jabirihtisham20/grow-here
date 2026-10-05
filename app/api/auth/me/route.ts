import { NextResponse } from 'next/server';
import { getCmsUser } from '@/lib/cms/auth';
import { cmsErrorResponse } from '@/lib/cms/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ user: await getCmsUser() }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
