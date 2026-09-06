import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getPostBySlug,
  getRelatedPosts,
  CategoryKey,
} from '@/lib/posts';
import { Container } from '@/components/ui/Container';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ArticleAuthor } from '@/components/blog/ArticleAuthor';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { RenderMDX } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import { Clock, Calendar, ChevronRight, Eye, Edit3, ArrowLeft } from 'lucide-react';

interface PreviewPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: PreviewPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(
    resolvedParams.category as CategoryKey,
    resolvedParams.slug,
    true
  );

  return {
    title: post ? `[PREVIEW] ${post.title}` : 'Draft Preview',
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function PreviewArticlePage({ params }: PreviewPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(
    resolvedParams.category as CategoryKey,
    resolvedParams.slug,
    true
  );

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(
    post.slug,
    post.category,
    post.tags,
    3
  );

  const isDraft = post.status === 'draft';

  return (
    <div className="min-h-screen bg-forest-950">
      {/* Editorial Draft Preview Banner */}
      <aside
        aria-label="Draft Preview Notice"
        className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-forest-950 px-4 py-3 shadow-lg border-b border-amber-400"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest-950 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
              <Eye className="w-3.5 h-3.5" />
              {isDraft ? 'Draft Preview' : 'Preview Mode'}
            </span>
            <span>
              This is a live preview of &ldquo;<span className="font-semibold">{post.title}</span>&rdquo;.
              {isDraft ? ' Status: Unpublished Draft.' : ' Status: Published.'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/keystatic/collection/${post.category}/item/${post.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-forest-950 text-cream-100 hover:bg-forest-900 transition-colors font-medium text-xs shadow"
            >
              <Edit3 className="w-3.5 h-3.5 text-botanical-accent" />
              Edit in Admin
            </Link>
            <Link
              href="/keystatic"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 text-forest-950 transition-colors font-semibold text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Admin Home
            </Link>
          </div>
        </div>
      </aside>

      <article className="pt-16 pb-20 bg-forest-950 min-h-screen">
        {/* Header Container */}
        <Container size="article" className="pt-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-botanical-muted mb-6">
            <Link href="/" className="hover:text-cream-200 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-forest-700" />
            <Link
              href={`/${post.category}`}
              className="capitalize hover:text-cream-200 transition-colors"
            >
              {post.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-forest-700" />
            <span className="text-botanical-accent font-medium truncate max-w-[200px]">
              {post.subcategory}
            </span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700/80 text-[11px] uppercase tracking-[0.2em] font-semibold text-botanical-accent mb-4">
            <span>{post.category}</span>
            <span>&bull;</span>
            <span className="text-warm-accent">{post.subcategory}</span>
            {isDraft && (
              <>
                <span>&bull;</span>
                <span className="text-amber-400 font-bold">DRAFT</span>
              </>
            )}
          </div>

          {/* Semantic Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-cream-100 tracking-tight leading-[1.12] mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg sm:text-xl text-botanical-muted leading-relaxed font-sans mb-8">
            {post.description}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-forest-800 text-xs text-botanical-muted font-sans">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-botanical-accent/30 bg-forest-700">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-cream-200">{post.author.name}</p>
                <p className="text-[11px] text-botanical-muted/80">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-botanical-accent" />
                {formatDate(post.publishedAt)}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-botanical-accent" />
                {post.readingTime}
              </span>
            </div>
          </div>
        </Container>

        {/* Hero Image */}
        <Container size="default" className="my-10">
          <div className="relative aspect-[16/9] max-h-[580px] rounded-3xl overflow-hidden border border-forest-750 bg-forest-850 shadow-2xl">
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        </Container>

        {/* Article Body */}
        <Container size="article">
          <TableOfContents />

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-cream-100 prose-p:text-cream-400/90 prose-p:leading-relaxed prose-li:text-cream-400/90 prose-a:text-warm-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-cream-200">
            <RenderMDX source={post.content} />
          </div>

          <div className="mt-12 pt-8 border-t border-forest-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-forest-850 border border-forest-750 text-xs text-botanical-muted font-sans"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <ShareButtons title={post.title} />
          </div>

          <ArticleAuthor author={post.author} />
          <RelatedPosts posts={relatedPosts} />
        </Container>
      </article>
    </div>
  );
}
