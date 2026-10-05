import { NextRequest, NextResponse } from 'next/server';
import { CMS_SESSION_COOKIE, destroyCmsSession } from '@/lib/cms/auth';
import { assertSameOrigin, cmsErrorResponse } from '@/lib/cms/http';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const token = request.cookies.get(CMS_SESSION_COOKIE)?.value;
    if (token) await destroyCmsSession(token);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(CMS_SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
    return response;
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
