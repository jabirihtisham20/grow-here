import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowUpRight } from 'lucide-react';

export function ContentPillars() {
  const pillars = [
    {
      number: '01',
      icon: '🌱',
      name: 'Plants & Gardening',
      href: '/grow',
      description: 'Indoor plants, balcony gardens, herbs, microgreens and beginner-friendly hydroponics.',
      cta: 'Explore Plants & Gardening',
      image: '/images/posts/mini-garden-ideas-small-spaces.webp',
      topics: 'Plants &bull; Herbs &bull; Hydroponics',
    },
    {
      number: '02',
      icon: '🏠',
      name: 'Home & Organization',
      href: '/space',
      description: 'Decluttering, organization and storage ideas that help small homes feel easier to live in.',
      cta: 'Explore Home & Organization',
      image: '/images/posts/small-apartment-organization-ideas.webp',
      topics: 'Organization &bull; Storage &bull; Decluttering',
    },
    {
      number: '03',
      icon: '⚡',
      name: 'Energy & Savings',
      href: '/energy',
      description: 'Practical ways to cut waste, understand solar and choose more efficient home technology.',
      cta: 'Explore Energy & Savings',
      image: '/images/posts/how-to-save-energy-at-home.webp',
      topics: 'Solar &bull; Efficiency &bull; Appliances',
    },
    {
      number: '04',
      icon: '🧘',
      name: 'Mindful Living',
      href: '/life',
      description: 'Digital wellness, minimalism and mindful routines for a calmer relationship with time and attention.',
      cta: 'Explore Mindful Living',
      image: '/images/posts/slow-living-for-busy-people.webp',
      topics: 'Digital Wellness &bull; Minimalism &bull; Mindful Living',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-forest-900 border-t border-forest-800">
      <Container>
        <SectionHeading
          eyebrow="Core Content Pillars"
          title="Explore Grow Here"
          description="Four areas. One simpler, more sustainable way to live."
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <Link
              key={pillar.name}
              href={pillar.href}
              className="group relative flex flex-col justify-between rounded-2xl border border-forest-750/70 bg-forest-850 overflow-hidden p-6 transition-all duration-300 hover:border-botanical-accent/60 hover:-translate-y-1.5 shadow-lg hover:shadow-2xl"
            >
              {/* Background image preview with dark gradient */}
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-forest-800">
                <Image
                  src={pillar.image}
                  alt={pillar.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-forest-950/80 backdrop-blur-sm border border-forest-700/80 text-[11px] font-mono text-warm-accent">
                  {pillar.number}
                </div>
              </div>

              {/* Text content */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{pillar.icon}</span>
                  <h3 className="font-serif text-2xl font-medium text-cream-100 group-hover:text-warm-accent transition-colors">
                    {pillar.name}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-botanical-muted leading-relaxed font-sans mb-4">
                  {pillar.description}
                </p>
              </div>

              {/* Card Footer CTA */}
              <div className="pt-4 border-t border-forest-750/60 flex items-center justify-between text-xs text-botanical-accent font-semibold tracking-wide uppercase group-hover:text-warm-accent">
                <span>{pillar.cta}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
