import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post, CategoryKey } from '@/lib/posts';
import { Container } from '@/components/ui/Container';
import { formatDate } from '@/lib/utils';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface CategorySectionProps {
  category: CategoryKey;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  posts: Post[];
  theme?: 'default' | 'warm' | 'cream';
}

export function CategorySection({
  category,
  icon,
  eyebrow,
  title,
  description,
  ctaText,
  posts,
  theme = 'default',
}: CategorySectionProps) {
  if (posts.length === 0) return null;

  const leadPost = posts[0];
  const secondaryPosts = posts.slice(1, 4);

  const bgStyles = {
    default: 'bg-forest-900 border-forest-800',
    warm: 'bg-gradient-to-b from-[#101F18] to-forest-950 border-warm-accent/20',
    cream: 'bg-[#082119] border-forest-750',
  };

  return (
    <section className={`py-20 md:py-28 border-t ${bgStyles[theme]}`}>
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{icon}</span>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-botanical-accent">
                {eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-cream-100 tracking-tight">
              {title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-botanical-muted max-w-xl font-sans">
              {description}
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link
              href={`/${category}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-forest-600 bg-forest-850/80 text-xs font-semibold uppercase tracking-wider text-cream-200 hover:border-warm-accent hover:text-warm-accent transition-colors"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Editorial composition: 1 Large Left Card + 3 Stacked Right Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Lead Card (7 cols) */}
          <div className="lg:col-span-7">
            <article className="group rounded-2xl border border-forest-750/80 bg-forest-850 overflow-hidden shadow-xl hover:border-forest-600 transition-all duration-300">
              <Link href={`/${leadPost.category}/${leadPost.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-forest-800">
                <Image
                  src={leadPost.image}
                  alt={leadPost.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-forest-950/80 backdrop-blur-md border border-forest-700 text-xs font-semibold text-warm-accent uppercase tracking-wider">
                  Featured in {category}
                </div>
              </Link>

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs text-botanical-muted mb-3 font-sans">
                  <span className="text-botanical-accent font-medium">{leadPost.subcategory}</span>
                  <span>&bull;</span>
                  <span>{formatDate(leadPost.publishedAt)}</span>
                  <span>&bull;</span>
                  <span>{leadPost.readingTime}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-cream-100 group-hover:text-warm-accent transition-colors leading-snug">
                  <Link href={`/${leadPost.category}/${leadPost.slug}`}>
                    {leadPost.title}
                  </Link>
                </h3>

                <p className="mt-3 text-sm text-botanical-muted leading-relaxed font-sans">
                  {leadPost.description}
                </p>

                <div className="mt-6 pt-5 border-t border-forest-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-forest-700">
                      <Image
                        src={leadPost.author.avatar}
                        alt={leadPost.author.name}
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-cream-400 font-medium">{leadPost.author.name}</span>
                  </div>

                  <Link
                    href={`/${leadPost.category}/${leadPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-botanical-accent group-hover:text-warm-accent font-semibold uppercase tracking-wider"
                  >
                    <span>Read Guide</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* Secondary Stacked List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {secondaryPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex gap-4 rounded-2xl border border-forest-750/60 bg-forest-850/60 p-4 hover:border-forest-600 hover:bg-forest-850 transition-all duration-300"
              >
                <div className="relative w-28 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-forest-800">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 py-0.5">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-botanical-accent">
                      {post.subcategory}
                    </span>
                    <h3 className="font-serif text-base font-medium text-cream-200 group-hover:text-warm-accent transition-colors line-clamp-2 leading-snug mt-1">
                      <Link href={`/${post.category}/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-botanical-muted mt-2">
                    <span>{post.readingTime}</span>
                    <span>&bull;</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
