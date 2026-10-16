import { NextResponse } from 'next/server';
import { CATEGORIES, CategoryKey, getAllPosts } from '@/lib/posts';

export async function GET() {
  const posts = getAllPosts();
  const categories = (Object.keys(CATEGORIES) as CategoryKey[]).map(slug => ({
    id: slug, slug, name: CATEGORIES[slug].name, description: CATEGORIES[slug].description,
    published_posts: posts.filter(post => post.category === slug).length,
  }));
  return NextResponse.json({ categories }, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60' } });
}
