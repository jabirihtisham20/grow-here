import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  extractHeadings,
  CategoryKey,
  CATEGORIES,
} from '@/lib/posts';
import { Container } from '@/components/ui/Container';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ArticleAuthor } from '@/components/blog/ArticleAuthor';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { Newsletter } from '@/components/home/Newsletter';
import { RenderMDX } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  SITE_CONFIG,
} from '@/lib/seo';
import { Clock, Calendar, ChevronRight } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(
    resolvedParams.category as CategoryKey,
    resolvedParams.slug
  );

  if (!post) {
    return {
      title: 'Story Not Found',
    };
  }

  const postUrl = `${SITE_CONFIG.url}/${post.category}/${post.slug}`;

  const title = post.seoTitle || post.title;
  const description = post.metaDescription || post.description;

  return {
    title,
    description,
    authors: [{ name: post.author.name }],
    alternates: {
      canonical: postUrl,
    },
    robots: post.noindex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      type: 'article',
      title: `${post.title} | Grow Here`,
      description: post.description,
      url: postUrl,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.image.startsWith('http')
            ? post.image
            : `${SITE_CONFIG.url}${post.image.startsWith('/') ? '' : '/'}${post.image}`,
          width: 1200,
          height: 675,
          alt: post.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [
        post.image.startsWith('http')
          ? post.image
          : `${SITE_CONFIG.url}${post.image.startsWith('/') ? '' : '/'}${post.image}`,
      ],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(
    resolvedParams.category as CategoryKey,
    resolvedParams.slug
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

  const categoryName = CATEGORIES[post.category as CategoryKey]?.name || post.category;

  const breadcrumbs = [
    { name: 'Home', url: SITE_CONFIG.url },
    { name: categoryName, url: `${SITE_CONFIG.url}/${post.category}` },
    { name: post.title, url: `${SITE_CONFIG.url}/${post.category}/${post.slug}` },
  ];

  const headings = extractHeadings(post.content);

  return (
    <article className="pt-28 pb-20 bg-forest-950 min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleSchema(post)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />

      {/* Hero / Header Container */}
      <Container size="article" className="pt-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-botanical-muted mb-6">
          <Link href="/" className="hover:text-cream-200 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-forest-700" />
          <Link
            href={`/${post.category}`}
            className="hover:text-cream-200 transition-colors"
          >
            {categoryName}
          </Link>
          <ChevronRight className="w-3 h-3 text-forest-700" />
          <span className="text-botanical-accent font-medium truncate max-w-[200px]">
            {post.subcategory}
          </span>
        </nav>

        {/* Category & Subcategory Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700/80 text-[11px] uppercase tracking-[0.2em] font-semibold text-botanical-accent mb-4">
          <span>{categoryName}</span>
          <span>&bull;</span>
          <span className="text-warm-accent">{post.subcategory}</span>
        </div>

        {/* Semantic H1 Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-cream-100 tracking-tight leading-[1.12] mb-6">
          {post.title}
        </h1>

        {/* Short introduction / deck */}
        <p className="text-lg sm:text-xl text-botanical-muted leading-relaxed font-sans mb-8">
          {post.description}
        </p>

        {/* Metadata row: Author, Date, Reading Time */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-forest-800 text-xs text-botanical-muted font-sans">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-botanical-accent/30 bg-forest-700">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                sizes="36px"
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
            alt={post.imageAlt}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </Container>

      {/* Article Content Body (Strictly 700-780px wide on desktop) */}
      <Container size="article">
        {/* Interactive Table of Contents */}
        <TableOfContents headings={headings} />

        {/* MDX Remote Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-cream-100 prose-p:text-cream-400/90 prose-p:leading-relaxed prose-li:text-cream-400/90 prose-a:text-warm-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-cream-200">
          <RenderMDX source={post.content} />
        </div>

        {/* Share Buttons and Tags */}
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

        {/* Author Bio Card */}
        <ArticleAuthor author={post.author} />

        {/* Contextual Related Stories */}
        <RelatedPosts posts={relatedPosts} />
      </Container>

      <div className="mt-20">
        <Newsletter />
      </div>
    </article>
  );
}
