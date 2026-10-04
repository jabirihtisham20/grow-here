import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post, CATEGORIES, CategoryKey } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

interface FeaturedStoryProps {
  post: Post;
}

export function FeaturedStory({ post }: FeaturedStoryProps) {
  const categoryInfo = CATEGORIES[post.category as CategoryKey];
  const categoryName = categoryInfo?.name || post.category;
  const categoryIcon = categoryInfo?.icon || '🌱';

  return (
    <section className="py-16 md:py-24 bg-forest-950 border-t border-forest-850">
      <Container>
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-warm-accent" />
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-botanical-accent">
              Featured
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-cream-100 font-normal tracking-tight mb-3">
            Simple changes that make everyday life work better.
          </h2>
          <p className="text-base text-botanical-muted leading-relaxed font-sans max-w-2xl">
            Grow Here turns big lifestyle goals into practical steps you can use at home. Start with a plant, clear one shelf, reduce one source of energy waste, or create one calmer digital habit.
          </p>
        </div>

        <div className="relative rounded-3xl border border-forest-750/80 bg-forest-900/60 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Editorial Image (desktop 7 cols) */}
            <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] lg:min-h-[500px] overflow-hidden bg-forest-850">
              {post.image && <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />}
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-forest-950/85 backdrop-blur-md border border-forest-700/80 text-xs font-semibold uppercase tracking-wider text-warm-accent flex items-center gap-1.5">
                <span>{categoryIcon}</span>
                <span>{categoryName}</span>
              </div>
            </div>

            {/* Editorial Story Content (desktop 5 cols) */}
            <div className="lg:col-span-5 p-7 sm:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-forest-900/90 to-forest-850/90">
              <div>
                <div className="flex items-center gap-4 text-xs text-botanical-muted mb-4 font-sans">
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

                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-cream-100 leading-snug tracking-tight hover:text-warm-accent transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-4 text-sm sm:text-base text-botanical-muted leading-relaxed font-sans">
                  {post.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-forest-800 text-[11px] font-sans text-cream-400 border border-forest-700/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-forest-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-botanical-accent/40 bg-forest-700">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      unoptimized={post.author.avatar.startsWith('http')}
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-cream-200">{post.author.name}</p>
                    <p className="text-[11px] text-botanical-muted">{post.author.role}</p>
                  </div>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-warm-accent text-forest-950 font-semibold text-xs uppercase tracking-wider hover:bg-warm-gold transition-colors shadow-md group"
                >
                  <span>Read The Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
