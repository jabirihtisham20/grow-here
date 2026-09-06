import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getPostsByCategory, CATEGORIES } from '@/lib/posts';
import { Container } from '@/components/ui/Container';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { Newsletter } from '@/components/home/Newsletter';
import { generateBreadcrumbSchema, SITE_CONFIG } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { ArrowRight, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Life | Digital Wellness, Minimalism & Mindful Living | Grow Here',
  description:
    'Practical guides to digital minimalism, screen-time reduction, slow living, underconsumption and more intentional everyday habits.',
  keywords: ['digital wellness', 'digital minimalism', 'digital detox', 'reduce screen time', 'mindful living', 'slow living', 'underconsumption', 'intentional living'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/life`,
  },
  openGraph: {
    title: 'Life | Digital Wellness, Minimalism & Mindful Living | Grow Here',
    description:
      'Practical guides to digital minimalism, screen-time reduction, slow living, underconsumption and more intentional everyday habits.',
    url: `${SITE_CONFIG.url}/life`,
  },
};

export default function LifeCategoryPage() {
  const categoryInfo = CATEGORIES.life;
  const posts = getPostsByCategory('life');
  const featured = posts.find((p) => p.featured) || posts[0];

  const breadcrumbs = [
    { name: 'Home', url: SITE_CONFIG.url },
    { name: categoryInfo.name, url: `${SITE_CONFIG.url}/life` },
  ];

  const topics = [
    'Digital Minimalism',
    'Digital Detox',
    'Slow Living',
    'Mindful Routines',
    'Underconsumption',
    'Intentional Living',
    'Focus',
  ];

  return (
    <div className="pt-28 pb-20 bg-forest-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />

      <Container>
        {/* Category Hero */}
        <div className="py-12 border-b border-forest-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{categoryInfo.icon}</span>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-botanical-accent">
              {categoryInfo.name}
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-cream-100 tracking-tight mb-4">
            Make More Room for What Matters.
          </h1>
          <p className="text-lg sm:text-xl text-botanical-muted max-w-2xl font-sans leading-relaxed mb-6">
            Practical ways to use technology more intentionally, buy less, slow down and build calmer routines.
          </p>
          <p className="text-base text-cream-300 max-w-3xl font-sans leading-relaxed">
            Mindful living does not require leaving modern life behind. It means choosing your defaults more carefully. Our Life guides focus on digital wellness, minimalism, underconsumption and routines that are realistic enough to keep.
          </p>

          {/* Topics Pill List */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-botanical-accent mr-2">
              Topics:
            </span>
            {topics.map((t) => (
              <span
                key={t}
                className="px-3.5 py-1.5 rounded-full bg-forest-900 border border-forest-750 text-xs text-cream-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Category Featured Story */}
        {featured && (
          <div className="my-14">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-warm-accent" />
              <span className="text-xs uppercase tracking-wider font-semibold text-warm-accent">
                Editor&apos;s Pick
              </span>
            </div>

            <article className="group rounded-3xl border border-forest-750/80 bg-forest-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl hover:border-forest-600 transition-all duration-300">
              <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] bg-forest-850">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-botanical-muted mb-3 font-sans">
                    <span className="text-botanical-accent font-medium">{featured.subcategory}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-botanical-accent" />
                      {featured.readingTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-cream-100 group-hover:text-warm-accent transition-colors leading-snug">
                    <Link href={`/life/${featured.slug}`}>
                      {featured.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm text-botanical-muted leading-relaxed font-sans">
                    {featured.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-forest-800 flex items-center justify-between">
                  <span className="text-xs text-botanical-muted/80">{formatDate(featured.publishedAt)}</span>
                  <Link
                    href={`/life/${featured.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-warm-accent text-forest-950 text-xs font-semibold uppercase tracking-wider hover:bg-warm-gold transition-colors"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Subtopic Filter and Articles */}
        <div id="articles-list" className="mt-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream-200 font-medium mb-6">
            All Life Guides &amp; Perspectives
          </h2>
          <CategoryFilter posts={posts} subtopics={categoryInfo.subtopics} />
        </div>

        {/* Category CTA */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl border border-forest-750/80 bg-forest-900/60 text-center max-w-2xl mx-auto shadow-xl">
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-cream-100 mb-3">
            Change the default.
          </h3>
          <p className="text-sm sm:text-base text-botanical-muted mb-6 leading-relaxed">
            A quieter phone, a simpler routine or one less impulse purchase can create more space for the things you value.
          </p>
          <a
            href="#articles-list"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-warm-accent text-forest-950 text-xs font-semibold uppercase tracking-wider hover:bg-warm-gold transition-colors"
          >
            <span>Explore Life Guides</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </Container>

      <div className="mt-20">
        <Newsletter />
      </div>
    </div>
  );
}
