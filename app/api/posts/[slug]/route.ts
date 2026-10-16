import { NextResponse } from 'next/server';
import { getPostByAnySlug, CATEGORIES } from '@/lib/posts';
import { publicPost } from '@/lib/public-posts';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostByAnySlug(slug);
  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  return NextResponse.json({ post: { ...publicPost(post, true), category_name: CATEGORIES[post.category].name } }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60' } });
}
