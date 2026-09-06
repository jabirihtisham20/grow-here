import React from 'react';
import { Post } from '@/lib/posts';
import { ArticleCard } from './ArticleCard';

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-forest-800/80">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-warm-accent" />
        <h3 className="font-serif text-2xl text-cream-200 font-medium">
          Related Stories
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
