import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Grow Here',
  description:
    'Read the terms governing use of Grow Here, including informational content, intellectual property, links and limitation of liability.',
  keywords: ['Grow Here terms', 'terms and conditions', 'terms of use'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms-and-conditions`,
  },
  openGraph: {
    title: 'Terms and Conditions | Grow Here',
    description:
      'Read the terms governing use of Grow Here, including informational content, intellectual property, links and limitation of liability.',
    url: `${SITE_CONFIG.url}/terms-and-conditions`,
  },
};

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 bg-forest-950 min-h-screen">
      <Container size="article">
        <div className="py-12 border-b border-forest-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700 text-[11px] uppercase tracking-[0.2em] font-semibold text-warm-accent mb-4">
            <span>Agreement</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-cream-100 tracking-tight mb-4">
            Terms and Conditions
          </h1>
          <p className="text-xs text-botanical-muted font-mono">
            Last Updated: September 2026
          </p>
        </div>

        <div className="py-10 space-y-8 text-cream-400 font-sans leading-relaxed text-sm sm:text-base">
          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Using the Site
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              By using Grow Here, you agree to use the website lawfully and not interfere with its operation, security or other visitors.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Informational Content
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Grow Here content is provided for general informational and educational purposes. It is not a substitute for professional medical, legal, financial, structural or electrical advice.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Plant and Home Safety
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Plant toxicity, allergies, electrical work, structural changes and appliance installation can involve safety risks. Verify plant safety for children and pets and use qualified professionals where work requires specialist knowledge.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Energy Information
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Energy prices, incentives, tariffs, standards and regulations vary by location and change over time. Confirm current local requirements before purchasing equipment or making major upgrades.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Intellectual Property
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Unless otherwise stated, original text, branding, graphics and site design are protected by applicable intellectual-property laws. Content may not be republished commercially without permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              External Links
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              Links to third-party websites are provided for convenience or reference. Grow Here does not control third-party content, policies or availability.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              No Guarantee
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              We work to keep information useful and accurate, but we do not guarantee that every page is complete, current or suitable for every situation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-cream-100 font-medium mb-3">
              Changes
            </h2>
            <p className="text-botanical-muted leading-relaxed">
              These terms may be updated as the website develops. The version published on the website is the current version.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
