import React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { HeroCanvas } from './HeroCanvas';

export function Hero() {
  const categoryShortcuts = [
    { name: 'Plants & Gardening', href: '/grow', icon: '🌱', desc: 'Plants & Gardens' },
    { name: 'Home & Organization', href: '/space', icon: '🏠', desc: 'Homes & Decluttering' },
    { name: 'Energy & Savings', href: '/energy', icon: '⚡', desc: 'Solar & Efficiency' },
    { name: 'Mindful Living', href: '/life', icon: '🧘', desc: 'Mindfulness & Habits' },
  ];

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-center pt-28 pb-16 overflow-hidden bg-forest-950">
      {/* Background botanical gradient and subtle Three.js backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest-800/40 via-forest-950 to-forest-950 pointer-events-none" />
      <HeroCanvas />

      {/* Decorative subtle botanical ring / vignette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-forest-700/10 blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="hero-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-850/90 border border-forest-700/80 text-botanical-accent text-xs uppercase tracking-[0.2em] font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-warm-accent animate-pulse" />
            <span>Better Everyday Living</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal text-cream-200 tracking-tight leading-[1.08] mb-6">
            Grow Better. <br className="hidden sm:inline" />
            <span className="italic text-cream-100 font-light">Live Lighter.</span>
          </h1>

          {/* Supporting Text */}
          <p className="hero-reveal text-base sm:text-lg md:text-xl text-botanical-muted leading-relaxed font-sans max-w-2xl mx-auto mb-10">
            Practical ideas for greener spaces, smarter homes, lower energy use, and a more intentional life.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="hero-reveal flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="#latest-stories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-warm-accent text-forest-950 font-semibold text-sm tracking-wide shadow-lg hover:bg-warm-gold hover:shadow-xl transition-all duration-200 group"
            >
              <span>Explore Stories</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </a>

            <Link
              href="/grow"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-forest-600/80 bg-forest-900/60 text-cream-300 font-medium text-sm tracking-wide hover:border-botanical-accent hover:text-cream-100 hover:bg-forest-850 transition-all duration-200"
            >
              <span>Start With Grow</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Shortcuts */}
          <div className="hero-reveal pt-4 border-t border-forest-800/60">
            <p className="text-xs uppercase tracking-widest text-botanical-muted mb-4 font-sans">
              Discover Content Pillars
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categoryShortcuts.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group flex flex-col items-center p-3 rounded-xl border border-forest-800/80 bg-forest-900/50 hover:border-forest-600 hover:bg-forest-850 transition-all duration-200"
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-sm font-serif font-medium text-cream-200 group-hover:text-warm-accent transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-botanical-muted hidden sm:inline">
                    {cat.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
