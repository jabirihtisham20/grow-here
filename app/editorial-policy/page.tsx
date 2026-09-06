import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Editorial Policy | Grow Here',
  description:
    "Read Grow Here's standards for accuracy, sourcing, updates, corrections, independence and responsible product recommendations.",
  keywords: ['editorial policy', 'Grow Here standards', 'fact checking', 'journalistic standards'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/editorial-policy`,
  },
  openGraph: {
    title: 'Editorial Policy | Grow Here',
    description:
      "Read Grow Here's standards for accuracy, sourcing, updates, corrections, independence and responsible product recommendations.",
    url: `${SITE_CONFIG.url}/editorial-policy`,
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="pt-28 pb-20 bg-forest-950 min-h-screen">
      <Container size="article">
        <div className="py-12 border-b border-forest-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700 text-[11px] uppercase tracking-[0.2em] font-semibold text-warm-accent mb-4">
            <span>Journalistic Standards</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-cream-100 tracking-tight mb-4">
            Editorial Policy
          </h1>
        </div>

        <div className="py-10 space-y-10 text-cream-400 font-sans leading-relaxed text-base">
          <section>
            <h2 className="font-serif text-2xl text-cream-100 font-medium mb-3">
              Purpose
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Grow Here publishes practical lifestyle content that should help readers make informed everyday decisions. We aim for clarity, accuracy and usefulness, while being transparent about uncertainty and regional differences.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream-100 font-medium mb-3">
              Accuracy and Sources
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              We prefer reliable primary or expert sources for factual claims, including government agencies, universities, recognized horticultural organizations and established research publications. We avoid presenting estimates or anecdotes as universal facts.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream-100 font-medium mb-3">
              Fact Checking
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Writers should verify names, measurements, safety notes, dates and technical claims before publication. Energy, electrical and equipment guidance should clearly separate general information from work that requires a qualified professional.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream-100 font-medium mb-3">
              Corrections
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              If a meaningful error is found, we correct it as soon as practical. Significant updates may include an updated date or editor&apos;s note. Readers can report possible errors through the <Link href="/contact" className="text-warm-accent underline">Contact page</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream-100 font-medium mb-3">
              Independence
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Editorial decisions are based on reader value. Commercial relationships should not determine conclusions. Sponsored material, if used, must be clearly labeled.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream-100 font-medium mb-3">
              Product Recommendations
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              When products are discussed, selection criteria should be explained. We aim to recommend categories and features first, not encourage unnecessary buying.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-cream-100 font-medium mb-3">
              Updates
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Time-sensitive articles are reviewed periodically. Solar incentives, energy tariffs, regulations, product standards and software features can change quickly and should be checked before major decisions.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
