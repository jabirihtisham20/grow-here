import { NextResponse } from 'next/server';
import { getSearchIndex } from '@/lib/posts';

export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET() {
  const index = getSearchIndex();
  return NextResponse.json(index, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
