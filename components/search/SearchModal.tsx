'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  readingTime: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts?: SearchResult[];
}

const categoryNames: Record<string, string> = {
  grow: 'Plants & Gardening',
  space: 'Home & Organization',
  energy: 'Energy & Savings',
  life: 'Mindful Living',
};

let cachedIndex: SearchResult[] | null = null;

export function SearchModal({ isOpen, onClose, posts: propPosts }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [fetchedPosts, setFetchedPosts] = useState<SearchResult[]>(cachedIndex || []);
  const inputRef = useRef<HTMLInputElement>(null);

  const posts = propPosts || fetchedPosts;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';

      if (!propPosts && (!cachedIndex || cachedIndex.length === 0)) {
        fetch('/api/search-index')
          .then((res) => res.json())
          .then((data: SearchResult[]) => {
            cachedIndex = data;
            setFetchedPosts(data);
          })
          .catch(() => {});
      }
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, propPosts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();
  const results = cleanQuery
    ? posts.filter((p) => {
        const catName = (categoryNames[p.category] || '').toLowerCase();
        return (
          p.title.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          catName.includes(cleanQuery) ||
          p.subcategory.toLowerCase().includes(cleanQuery) ||
          p.tags.some((t) => t.toLowerCase().includes(cleanQuery))
        );
      })
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-forest-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-forest-700 bg-forest-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-forest-800 pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-botanical-accent" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search plants, small spaces, solar, habits..."
              className="w-full bg-transparent text-lg text-cream-200 placeholder-botanical-muted/60 focus:outline-none"
            />
          </div>
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-lg text-botanical-muted hover:text-cream-200 hover:bg-forest-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-3 pr-1">
          {cleanQuery && results.length === 0 && (
            <p className="py-8 text-center text-sm text-botanical-muted font-sans">
              No stories found matching &ldquo;{query}&rdquo;. Try searching for &ldquo;plants&rdquo;, &ldquo;solar&rdquo;, or &ldquo;declutter&rdquo;.
            </p>
          )}

          {!cleanQuery && (
            <div className="py-6 text-center text-xs text-botanical-muted/80">
              <span className="inline-block px-2 py-1 rounded bg-forest-800 text-cream-400 mr-2">Tip</span>
              Search by topic, keyword, or category. Press <kbd className="font-mono bg-forest-800 px-1 py-0.5 rounded text-warm-accent">ESC</kbd> to exit.
            </div>
          )}

          {results.map((result) => (
            <Link
              key={`${result.category}-${result.slug}`}
              href={`/${result.category}/${result.slug}`}
              onClick={onClose}
              className="group block rounded-xl border border-forest-800/80 bg-forest-850/60 p-4 hover:border-forest-600 hover:bg-forest-800/90 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-botanical-accent">
                  {categoryNames[result.category] || result.category} &bull; {result.subcategory}
                </span>
                <span className="text-xs text-botanical-muted">{result.readingTime}</span>
              </div>
              <h4 className="font-serif text-base text-cream-200 group-hover:text-warm-accent transition-colors font-medium">
                {result.title}
              </h4>
              <p className="text-xs text-botanical-muted line-clamp-1 mt-1 font-sans">
                {result.description}
              </p>
              <div className="mt-2 flex items-center text-xs text-botanical-accent group-hover:text-warm-accent font-medium gap-1">
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
