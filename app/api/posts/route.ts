import { NextRequest, NextResponse } from 'next/server';
import { publicPost, publishedPosts } from '@/lib/public-posts';
import { CATEGORIES } from '@/lib/categories';

export async function GET(request: NextRequest) {
  const number = (value: string | null, fallback: number) => value && /^\d+$/.test(value) ? Number(value) : fallback;
  const page = Math.max(1, number(request.nextUrl.searchParams.get('page'), 1));
  const limit = Math.min(50, Math.max(1, number(request.nextUrl.searchParams.get('limit'), 20)));
  const category = request.nextUrl.searchParams.get('category');
  const all = publishedPosts().filter(post => !category || post.category === category);
  const posts = all.slice((page - 1) * limit, page * limit).map(post => ({ ...publicPost(post), category_name: CATEGORIES[post.category].name }));
  return NextResponse.json({ posts, page, limit, total: all.length }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60' } });
}
