'use client';

import React, { useState } from 'react';
import { Post } from '@/lib/posts';
import { ArticleCard } from './ArticleCard';

interface LatestFilterProps {
  posts: Post[];
}

export function LatestFilter({ posts }: LatestFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const filterTabs = [
    { label: 'All', value: 'all' },
    { label: 'Plants & Gardening', value: 'grow', icon: '🌱' },
    { label: 'Home & Organization', value: 'space', icon: '🏠' },
    { label: 'Energy & Savings', value: 'energy', icon: '⚡' },
    { label: 'Mindful Living', value: 'life', icon: '🧘' },
  ];

  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = filteredPosts.length > visibleCount;

  return (
    <div className="space-y-10">
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setSelectedCategory(tab.value);
              setVisibleCount(12);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === tab.value
                ? 'bg-warm-accent text-forest-950 shadow-md'
                : 'bg-forest-850/80 text-cream-400 border border-forest-750 hover:border-forest-600 hover:text-cream-200'
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid or Empty State */}
      {displayedPosts.length === 0 ? (
        <div className="p-12 rounded-3xl border border-forest-800 bg-forest-900/40 text-center max-w-lg mx-auto">
          <p className="text-base text-botanical-muted">
            No stories found for this filter. Try another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.map((post, idx) => (
            <ArticleCard key={post.slug} post={post} priority={idx < 3} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-8 py-3.5 rounded-full bg-forest-850 border border-forest-700 text-xs font-semibold uppercase tracking-wider text-warm-accent hover:bg-forest-750 hover:border-warm-accent transition-all shadow-md"
          >
            Load More Stories
          </button>
        </div>
      )}
    </div>
  );
}
