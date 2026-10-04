import React from 'react';
import Link from 'next/link';
import { Post } from '@/lib/posts';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowRight } from 'lucide-react';

interface PopularGuidesProps {
  posts: Post[];
}

export function PopularGuides({ posts }: PopularGuidesProps) {
  return (
    <section className="py-20 md:py-28 bg-forest-950 border-t border-forest-850">
      <Container>
        <SectionHeading
          eyebrow="Community Favorites"
          title="Most Read Guides"
          description="The essential field guides our readers return to again and again."
        />

        <div className="divide-y divide-forest-800/80 border-y border-forest-800/80">
          {posts.slice(0, 5).map((post, idx) => {
            const number = String(idx + 1).padStart(2, '0');
            return (
              <article
                key={post.slug}
                className="group py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 transition-colors hover:bg-forest-900/40 px-3 sm:px-6 rounded-xl"
              >
                <div className="flex items-start md:items-center gap-6 sm:gap-8">
                  {/* Large Number */}
                  <span
                    aria-hidden="true"
                    className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-forest-400 group-hover:text-warm-accent transition-colors flex-shrink-0 select-none"
                  >
                    {number}
                  </span>

                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-botanical-accent mb-1.5 font-sans">
                      <span>{post.category}</span>
                      <span>&bull;</span>
                      <span className="text-botanical-muted">{post.subcategory}</span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-cream-200 group-hover:text-warm-accent transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm text-botanical-muted line-clamp-1 max-w-3xl font-sans">
                      {post.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 flex-shrink-0 pt-2 md:pt-0">
                  <span className="text-xs text-botanical-muted font-sans">
                    {post.readingTime}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    aria-label={`Read guide: ${post.title}`}
                    className="w-10 h-10 rounded-full border border-forest-700 bg-forest-850 flex items-center justify-center text-cream-300 group-hover:border-warm-accent group-hover:text-warm-accent group-hover:bg-forest-800 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
