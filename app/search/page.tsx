import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getSearchIndex } from '@/lib/posts';
import { Container } from '@/components/ui/Container';
import { SearchPageClient } from '@/components/search/SearchPageClient';
import { Newsletter } from '@/components/home/Newsletter';
import { generateBreadcrumbSchema, SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Search Grow Here | Find Guides on Grow, Space, Energy & Life',
  description:
    'Search Grow Here for practical guides about plants, organization, energy saving, solar, digital wellness and intentional living.',
  keywords: ['search Grow Here', 'find sustainable guides', 'gardening search', 'energy efficiency search'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/search`,
  },
  openGraph: {
    title: 'Search Grow Here | Find Guides on Grow, Space, Energy & Life',
    description:
      'Search Grow Here for practical guides about plants, organization, energy saving, solar, digital wellness and intentional living.',
    url: `${SITE_CONFIG.url}/search`,
  },
};

export default function SearchPage() {
  const searchIndex = getSearchIndex();

  const breadcrumbs = [
    { name: 'Home', url: SITE_CONFIG.url },
    { name: 'Search', url: `${SITE_CONFIG.url}/search` },
  ];

  return (
    <div className="pt-28 pb-20 bg-forest-950 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />

      <Container>
        {/* Header */}
        <div className="py-12 border-b border-forest-800 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700/80 text-[11px] uppercase tracking-[0.2em] font-semibold text-warm-accent mb-4">
            <span>Library Search</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-cream-100 tracking-tight mb-4">
            Search Grow Here
          </h1>
          <p className="text-lg sm:text-xl text-botanical-muted max-w-xl mx-auto font-sans leading-relaxed">
            Find a guide by topic, question or keyword.
          </p>
        </div>

        {/* Client Search with Suspense */}
        <Suspense
          fallback={
            <div className="text-center py-12 text-botanical-muted">
              Loading library index...
            </div>
          }
        >
          <SearchPageClient initialPosts={searchIndex} />
        </Suspense>
      </Container>

      <div className="mt-24">
        <Newsletter />
      </div>
    </div>
  );
}
