import React from 'react';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { Container } from '@/components/ui/Container';
import { LatestFilter } from '@/components/blog/LatestFilter';
import { Newsletter } from '@/components/home/Newsletter';
import { generateBreadcrumbSchema, SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Latest Stories | Grow Here',
  description:
    'Read the newest Grow Here guides on indoor plants, small-space organization, energy saving, digital wellness and intentional living.',
  keywords: ['sustainable living blog', 'latest stories', 'Grow Here stories', 'green living guides'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/latest`,
  },
  openGraph: {
    title: 'Latest Stories | Grow Here',
    description:
      'Read the newest Grow Here guides on indoor plants, small-space organization, energy saving, digital wellness and intentional living.',
    url: `${SITE_CONFIG.url}/latest`,
  },
};

export default function LatestStoriesPage() {
  const posts = getAllPosts();

  const breadcrumbs = [
    { name: 'Home', url: SITE_CONFIG.url },
    { name: 'Latest Stories', url: `${SITE_CONFIG.url}/latest` },
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
        <div className="py-12 border-b border-forest-800 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700/80 text-[11px] uppercase tracking-[0.2em] font-semibold text-warm-accent mb-4">
            <span>Archive</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-cream-100 tracking-tight mb-4">
            Latest Stories
          </h1>
          <p className="text-lg sm:text-xl text-botanical-muted max-w-2xl font-sans leading-relaxed">
            New practical guides from Grow, Space, Energy and Life.
          </p>
        </div>

        {/* Filter and Articles */}
        <LatestFilter posts={posts} />
      </Container>

      <div className="mt-24">
        <Newsletter />
      </div>
    </div>
  );
}
