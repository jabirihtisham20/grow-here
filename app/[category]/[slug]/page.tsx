import { notFound } from 'next/navigation';
import { ArticlePage, generateArticleMetadata } from '@/components/blog/ArticlePage';
import { getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';

type Props = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map(({ category, slug }) => ({ category, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateArticleMetadata({ params });
}

export default async function CategoryArticlePage({ params }: Props) {
  const { category, slug } = await params;
  if (!getAllPosts().some((post) => post.category === category && post.slug === slug)) notFound();
  return <ArticlePage params={Promise.resolve({ category, slug })} />;
}
