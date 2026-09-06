import React from 'react';
import Link from 'next/link';
import { Post } from '@/lib/posts';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { ArrowRight } from 'lucide-react';

interface LatestStoriesProps {
  posts: Post[];
}

export function LatestStories({ posts }: LatestStoriesProps) {
  return (
    <section id="latest-stories" className="py-20 md:py-28 bg-forest-950 border-t border-forest-850">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Recent Dispatches"
            title="Latest Stories"
            description="Fresh, useful guides designed to help you make one good change at a time."
            className="mb-0"
          />
          <div className="mt-4 md:mt-0">
            <Link
              href="/latest"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warm-accent hover:text-warm-gold transition-colors"
            >
              <span>View All Stories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 8 Post Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.slice(0, 8).map((post, idx) => (
            <ArticleCard key={post.slug} post={post} priority={idx < 2} />
          ))}
        </div>
      </Container>
    </section>
  );
}
