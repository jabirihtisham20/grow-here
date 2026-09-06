'use client';

import React, { useState } from 'react';
import { Post } from '@/lib/posts';
import { ArticleCard } from './ArticleCard';

interface CategoryFilterProps {
  posts: Post[];
  subtopics: string[];
}

export function CategoryFilter({ posts, subtopics }: CategoryFilterProps) {
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const filteredPosts =
    selectedSubtopic === 'All'
      ? posts
      : posts.filter(
          (p) =>
            p.subcategory.toLowerCase() === selectedSubtopic.toLowerCase() ||
            p.tags.some((t) => t.toLowerCase() === selectedSubtopic.toLowerCase())
        );

  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = filteredPosts.length > visibleCount;

  return (
    <div className="space-y-8">
      {/* Subtopic Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            setSelectedSubtopic('All');
            setVisibleCount(6);
          }}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
            selectedSubtopic === 'All'
              ? 'bg-warm-accent text-forest-950 shadow-md'
              : 'bg-forest-850/80 text-cream-400 border border-forest-750 hover:border-forest-600 hover:text-cream-200'
          }`}
        >
          All Topics
        </button>

        {subtopics.map((topic) => (
          <button
            key={topic}
            onClick={() => {
              setSelectedSubtopic(topic);
              setVisibleCount(6);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
              selectedSubtopic === topic
                ? 'bg-warm-accent text-forest-950 shadow-md'
                : 'bg-forest-850/80 text-cream-400 border border-forest-750 hover:border-forest-600 hover:text-cream-200'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPosts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="py-12 text-center rounded-2xl border border-forest-800 bg-forest-850/50">
          <p className="text-botanical-muted text-sm font-sans">
            No articles found for &ldquo;{selectedSubtopic}&rdquo; yet. Check back soon!
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-8 py-3 rounded-full border border-forest-600 bg-forest-800/80 text-cream-200 text-xs uppercase tracking-widest font-semibold hover:border-warm-accent hover:text-warm-accent hover:bg-forest-800 transition-all duration-200"
          >
            Load More Stories
          </button>
        </div>
      )}
    </div>
  );
}
