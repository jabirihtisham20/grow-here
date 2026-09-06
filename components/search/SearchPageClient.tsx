'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search as SearchIcon, ArrowRight, Clock, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface SearchItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  readingTime: string;
  publishedAt: string;
  image: string;
}

interface SearchPageClientProps {
  initialPosts: SearchItem[];
}

const categoryNames: Record<string, string> = {
  grow: 'Plants & Gardening',
  space: 'Home & Organization',
  energy: 'Energy & Savings',
  life: 'Mindful Living',
};

export function SearchPageClient({ initialPosts }: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(urlQuery);
  const [submittedQuery, setSubmittedQuery] = useState(urlQuery);

  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      setSubmittedQuery(urlQuery);
    }
  }, [urlQuery]);

  const cleanQuery = query.toLowerCase().trim();

  const results = cleanQuery
    ? initialPosts.filter((p) => {
        const catName = (categoryNames[p.category] || '').toLowerCase();
        const inTitle = p.title.toLowerCase().includes(cleanQuery);
        const inDesc = p.description.toLowerCase().includes(cleanQuery);
        const inCat = p.category.toLowerCase().includes(cleanQuery) || catName.includes(cleanQuery);
        const inSubcat = p.subcategory.toLowerCase().includes(cleanQuery);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(cleanQuery));
        return inTitle || inDesc || inCat || inSubcat || inTags;
      })
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(query);
  };

  return (
    <div className="space-y-12">
      {/* Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plants, storage, solar, digital wellness..."
            aria-label="Search query"
            className="w-full px-6 py-4 pl-14 rounded-full bg-forest-900 border border-forest-750 text-cream-100 placeholder-botanical-muted/60 text-base focus:outline-none focus:border-warm-accent shadow-xl"
          />
          <SearchIcon className="absolute left-5 w-5 h-5 text-botanical-muted pointer-events-none" />
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 rounded-full bg-warm-accent text-forest-950 text-xs font-semibold uppercase tracking-wider hover:bg-warm-gold transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results Header */}
      {cleanQuery && (
        <div className="text-center">
          <p className="text-sm uppercase tracking-wider font-semibold text-botanical-accent">
            Results for &ldquo;{query}&rdquo; ({results.length})
          </p>
        </div>
      )}

      {/* Results Grid or Empty State */}
      {cleanQuery && results.length === 0 ? (
        <div className="p-12 rounded-3xl border border-forest-800 bg-forest-900/50 text-center max-w-xl mx-auto shadow-xl">
          <h3 className="font-serif text-xl font-normal text-cream-200 mb-3">
            No matching guides found
          </h3>
          <p className="text-sm text-botanical-muted leading-relaxed mb-6">
            We could not find a matching guide. Try a broader term or browse Grow, Space, Energy or Life.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/grow"
              className="px-4 py-2 rounded-full bg-forest-850 border border-forest-700 text-xs text-cream-200 hover:border-warm-accent"
            >
              🌱 Grow
            </Link>
            <Link
              href="/space"
              className="px-4 py-2 rounded-full bg-forest-850 border border-forest-700 text-xs text-cream-200 hover:border-warm-accent"
            >
              🏠 Space
            </Link>
            <Link
              href="/energy"
              className="px-4 py-2 rounded-full bg-forest-850 border border-forest-700 text-xs text-cream-200 hover:border-warm-accent"
            >
              ⚡ Energy
            </Link>
            <Link
              href="/life"
              className="px-4 py-2 rounded-full bg-forest-850 border border-forest-700 text-xs text-cream-200 hover:border-warm-accent"
            >
              🧘 Life
            </Link>
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-forest-800 bg-forest-900/60 overflow-hidden flex flex-col justify-between hover:border-forest-650 transition-all shadow-lg hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] w-full bg-forest-850 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-forest-950/80 backdrop-blur-sm text-[10px] uppercase tracking-wider font-semibold text-warm-accent border border-forest-700">
                  {categoryNames[post.category] || post.category}
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-xs text-botanical-muted mb-2 font-sans">
                    <span className="text-botanical-accent">{post.subcategory}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-normal text-cream-100 group-hover:text-warm-accent transition-colors leading-snug">
                    <Link href={`/${post.category}/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="mt-2 text-xs text-botanical-muted leading-relaxed font-sans line-clamp-3">
                    {post.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-forest-800 flex items-center justify-between text-xs text-botanical-muted">
                  <span>{formatDate(post.publishedAt)}</span>
                  <Link
                    href={`/${post.category}/${post.slug}`}
                    className="inline-flex items-center gap-1 text-warm-accent font-medium hover:underline"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Initial prompt suggestions when query is empty */
        <div className="text-center py-12">
          <p className="text-sm uppercase tracking-wider font-semibold text-botanical-muted/70 mb-4">
            Suggested Search Queries
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
            {[
              'mini garden ideas',
              'hydroponics for beginners',
              'low light indoor plants',
              'small apartment organization',
              '80/20 decluttering',
              'how to save energy at home',
              'solar panels',
              'digital minimalism',
              'mindful morning routine',
            ].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3.5 py-1.5 rounded-full bg-forest-900/80 border border-forest-800 text-xs text-cream-300 hover:border-warm-accent hover:text-warm-accent transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
