import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/posts';
import { CATEGORIES, CategoryKey } from '@/lib/categories';
import { formatDate } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  post: Post;
  variant?: 'standard' | 'horizontal' | 'compact' | 'featured';
  priority?: boolean;
}

export function ArticleCard({
  post,
  variant = 'standard',
  priority = false,
}: ArticleCardProps) {
  const categoryName = CATEGORIES[post.category as CategoryKey]?.name || post.category;
  if (variant === 'horizontal') {
    return (
      <article className="group flex flex-col sm:flex-row gap-5 items-start rounded-2xl border border-forest-750/70 bg-forest-850/70 p-4 transition-all duration-300 hover:border-forest-600/80 hover:bg-forest-800/80">
        <div className="relative w-full sm:w-48 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 bg-forest-800">
          {post.image && <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />}
        </div>
        <div className="flex flex-col justify-between flex-1 py-1">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-botanical-accent mb-2">
              <span>{categoryName}</span>
              <span>&bull;</span>
              <span className="text-botanical-muted">{post.subcategory}</span>
            </div>
            <h3 className="font-serif text-lg font-medium text-cream-200 group-hover:text-warm-accent transition-colors line-clamp-2 leading-snug">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h3>
            <p className="text-xs text-botanical-muted line-clamp-2 mt-2 font-sans leading-relaxed">
              {post.description}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-botanical-muted/80 pt-2 border-t border-forest-750/60">
            <span>{formatDate(post.publishedAt)}</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group py-4 border-b border-forest-800/80 last:border-none">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-botanical-accent mb-1.5">
          <span>{categoryName}</span>
          <span>&bull;</span>
          <span className="text-botanical-muted">{post.readingTime}</span>
        </div>
        <h3 className="font-serif text-base font-medium text-cream-200 group-hover:text-warm-accent transition-colors leading-snug">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <p className="text-xs text-botanical-muted line-clamp-1 mt-1 font-sans">
          {post.description}
        </p>
      </article>
    );
  }

  // Standard vertical card
  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-forest-750/70 bg-forest-850/60 overflow-hidden transition-all duration-300 hover:border-forest-600/80 hover:bg-forest-800/80 hover:-translate-y-1 shadow-md hover:shadow-xl">
      <div>
        <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-forest-800">
          {post.image && <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-forest-950/80 backdrop-blur-md border border-forest-700/60 text-[11px] font-semibold tracking-wider uppercase text-cream-200">
            {categoryName}
          </div>
        </Link>

        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs text-botanical-muted mb-2.5">
            <span className="text-botanical-accent font-medium">{post.subcategory}</span>
            <span>&bull;</span>
            <span>{post.readingTime}</span>
          </div>

          <h3 className="font-serif text-xl font-medium text-cream-200 group-hover:text-warm-accent transition-colors line-clamp-2 leading-tight">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          <p className="mt-3 text-xs sm:text-sm text-botanical-muted line-clamp-2 leading-relaxed font-sans">
            {post.description}
          </p>
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-forest-800 px-2 py-1 text-[10px] text-botanical-muted">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-3 flex items-center justify-between border-t border-forest-800/60 text-xs text-botanical-muted">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-forest-700">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              unoptimized={post.author.avatar.startsWith('http')}
              sizes="24px"
              className="object-cover"
            />
          </div>
          <span className="font-medium text-cream-400">{post.author.name}</span>
        </div>
        <span className="text-[11px] text-botanical-muted/80">{formatDate(post.publishedAt)}</span>
      </div>
    </article>
  );
}
