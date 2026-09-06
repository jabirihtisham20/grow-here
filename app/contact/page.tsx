import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/contact/ContactForm';
import { generateBreadcrumbSchema, SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact Grow Here | Editorial Inquiries, Feedback & Partnerships',
  description:
    'Get in touch with the Grow Here editorial desk. Submit story ideas, corrections, partnerships, or general feedback.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
  openGraph: {
    title: 'Contact Grow Here | Editorial Inquiries & Feedback',
    description:
      'Get in touch with the Grow Here editorial desk. Submit story ideas, corrections, partnerships, or general feedback.',
    url: `${SITE_CONFIG.url}/contact`,
  },
};

export default function ContactPage() {
  const breadcrumbs = [
    { name: 'Home', url: SITE_CONFIG.url },
    { name: 'Contact', url: `${SITE_CONFIG.url}/contact` },
  ];

  return (
    <div className="pt-28 pb-20 bg-forest-950 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />

      <Container size="narrow">
        <div className="py-12 border-b border-forest-800 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700/80 text-[11px] uppercase tracking-[0.2em] font-semibold text-warm-accent mb-4">
            <span>Contact Us</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-cream-100 tracking-tight mb-4">
            Get in Touch.
          </h1>
          <p className="text-base sm:text-lg text-botanical-muted max-w-xl mx-auto leading-relaxed font-sans">
            Have a question, correction, story idea or partnership enquiry? Send us a message.
          </p>
        </div>

        <div className="my-12">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
