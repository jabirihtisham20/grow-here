import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Newsletter } from '@/components/home/Newsletter';
import { SITE_CONFIG } from '@/lib/seo';
import { CheckCircle, Sparkles, BookOpen, Compass, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Grow Here | Practical Sustainable & Intentional Living',
  description:
    'Learn why Grow Here publishes practical, easy-to-understand guides about growing, small spaces, home energy and intentional living.',
  keywords: ['practical sustainable living', 'about Grow Here', 'sustainable lifestyle editorial'],
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: 'About Grow Here | Practical Sustainable & Intentional Living',
    description:
      'Learn why Grow Here publishes practical, easy-to-understand guides about growing, small spaces, home energy and intentional living.',
    url: `${SITE_CONFIG.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 bg-forest-950">
      <Container size="narrow">
        {/* Header */}
        <div className="py-12 border-b border-forest-800 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700/80 text-[11px] uppercase tracking-[0.2em] font-semibold text-warm-accent mb-4">
            <span>About Us</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-cream-100 tracking-tight mb-6">
            Helping Everyday Life Grow Better.
          </h1>
          <p className="text-lg sm:text-xl text-botanical-muted leading-relaxed font-sans max-w-2xl mx-auto">
            Grow Here is an independent editorial website about greener spaces, smarter homes and more intentional living.
          </p>
        </div>

        {/* Lead Image */}
        <div className="my-12 relative aspect-[16/9] rounded-3xl overflow-hidden border border-forest-750 bg-forest-850 shadow-2xl">
          <Image
            src="/images/posts/how-to-create-a-greener-calmer-home.webp"
            alt="Grow Here botanical editorial table"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Content sections */}
        <div className="space-y-12 py-6 text-cream-400 font-sans leading-relaxed">
          {/* Section 1: Our Mission */}
          <section>
            <h2 className="font-serif text-3xl text-cream-100 font-medium mb-4">
              Our Mission
            </h2>
            <p className="text-base sm:text-lg text-botanical-muted leading-relaxed">
              Our mission is to make useful lifestyle information easier to understand and easier to act on. We focus on small changes that can improve the way people grow plants, organize their homes, use energy and manage attention.
            </p>
          </section>

          {/* Section 2: What We Cover */}
          <section className="rounded-2xl border border-forest-800 bg-forest-900/60 p-8">
            <h2 className="font-serif text-2xl text-cream-100 font-medium mb-6">
              What We Cover
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h3 className="font-serif text-lg text-warm-accent flex items-center gap-2">
                  <span>🌱</span> Grow
                </h3>
                <p className="text-botanical-muted">
                  Plants, herbs, balconies, microgreens and hydroponics.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg text-warm-accent flex items-center gap-2">
                  <span>🏠</span> Space
                </h3>
                <p className="text-botanical-muted">
                  Organization, decluttering, storage and small-home living.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg text-warm-accent flex items-center gap-2">
                  <span>⚡</span> Energy
                </h3>
                <p className="text-botanical-muted">
                  Household energy use, solar, appliances, batteries and efficiency.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg text-warm-accent flex items-center gap-2">
                  <span>🧘</span> Life
                </h3>
                <p className="text-botanical-muted">
                  Digital wellness, minimalism, mindful routines and intentional consumption.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: How We Work */}
          <section>
            <h2 className="font-serif text-3xl text-cream-100 font-medium mb-4">
              How We Work
            </h2>
            <p className="text-base sm:text-lg text-botanical-muted leading-relaxed">
              We aim to explain the basics first, distinguish facts from preferences, and avoid turning every problem into a shopping list. Where information can vary by location &mdash; such as energy incentives or electrical standards &mdash; we tell readers to verify local rules.
            </p>
          </section>

          {/* Section 4: Our Promise */}
          <section className="p-8 rounded-2xl border border-warm-accent/30 bg-warm-accent/5 text-center">
            <h2 className="font-serif text-2xl text-cream-100 font-medium mb-3">
              Our Promise
            </h2>
            <p className="font-serif text-xl text-warm-accent italic">
              Helpful before impressive. Clear before clever. Practical before perfect.
            </p>
          </section>
        </div>
      </Container>

      <div className="mt-16">
        <Newsletter />
      </div>
    </div>
  );
}
