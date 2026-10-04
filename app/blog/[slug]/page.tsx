import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArticlePage, generateArticleMetadata } from '@/components/blog/ArticlePage';
import { getAllPosts, getPostByAnySlug } from '@/lib/posts';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return generateArticleMetadata({ params });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostByAnySlug(slug);
  if (!post) notFound();
  return <ArticlePage params={Promise.resolve({ slug })} />;
}
