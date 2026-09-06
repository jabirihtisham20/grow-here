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
  title: 'Energy | Save Energy, Solar & Efficient Home Guides | Grow Here',
  description:
    'Understand home energy use, solar panels, efficient appliances, batteries and smart thermostats with practical, easy-to-follow guides.',
  keywords: ['how to save energy at home', 'solar panels', 'energy efficient appliances', 'home battery storage', 'smart thermostat', 'electricity saving tips'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/energy`,
  },
  openGraph: {
    title: 'Energy | Save Energy, Solar & Efficient Home Guides | Grow Here',
    description:
      'Understand home energy use, solar panels, efficient appliances, batteries and smart thermostats with practical, easy-to-follow guides.',
    url: `${SITE_CONFIG.url}/energy`,
  },
};

export default function EnergyCategoryPage() {
  const categoryInfo = CATEGORIES.energy;
  const posts = getPostsByCategory('energy');
  const featured = posts.find((p) => p.featured) || posts[0];

  const breadcrumbs = [
    { name: 'Home', url: SITE_CONFIG.url },
    { name: categoryInfo.name, url: `${SITE_CONFIG.url}/energy` },
  ];

  const topics = [
    'Energy Saving',
    'Solar',
    'Efficient Appliances',
    'Home Batteries',
    'Smart Thermostats',
    'Heating & Cooling',
    'Electricity Basics',
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
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-warm-accent">
              {categoryInfo.name}
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-cream-100 tracking-tight mb-4">
            Use Less Energy. Make Smarter Choices.
          </h1>
          <p className="text-lg sm:text-xl text-botanical-muted max-w-2xl font-sans leading-relaxed mb-6">
            Clear guides for lowering waste, understanding home technology and making energy upgrades with confidence.
          </p>
          <p className="text-base text-cream-300 max-w-3xl font-sans leading-relaxed mb-6">
            Energy efficiency starts with knowing where energy goes. Grow Here explains everyday electricity use, efficient appliances, solar, batteries and smart controls in simple language.
          </p>

          {/* Regional Disclaimer Alert Box */}
          <div className="p-4 rounded-xl border border-warm-accent/30 bg-warm-accent/5 text-xs text-cream-300 font-sans leading-relaxed max-w-3xl mb-8">
            <span className="font-semibold text-warm-accent uppercase tracking-wider block mb-1">
              Important Note on Energy &amp; Solar Information:
            </span>
            Costs, incentives, tariffs, equipment rules and solar regulations differ by country and change over time. Always verify local requirements and get qualified advice for electrical or structural work.
          </div>

          {/* Topics Pill List */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-warm-accent mr-2">
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

            <article className="group rounded-3xl border border-forest-750/80 bg-forest-900 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-xl hover:border-warm-accent/40 transition-all duration-300">
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
                    <span className="text-warm-accent font-medium">{featured.subcategory}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-botanical-accent" />
                      {featured.readingTime}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-cream-100 group-hover:text-warm-accent transition-colors leading-snug">
                    <Link href={`/energy/${featured.slug}`}>
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
                    href={`/energy/${featured.slug}`}
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
            All Energy Guides &amp; Insights
          </h2>
          <CategoryFilter posts={posts} subtopics={categoryInfo.subtopics} />
        </div>

        {/* Category CTA */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl border border-forest-750/80 bg-forest-900/60 text-center max-w-2xl mx-auto shadow-xl">
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-cream-100 mb-3">
            Start with the easy savings.
          </h3>
          <p className="text-sm sm:text-base text-botanical-muted mb-6 leading-relaxed">
            Reduce waste first, then decide which upgrades are worth your money.
          </p>
          <a
            href="#articles-list"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-warm-accent text-forest-950 text-xs font-semibold uppercase tracking-wider hover:bg-warm-gold transition-colors"
          >
            <span>Explore Energy Guides</span>
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
