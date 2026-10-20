import React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { HeroCanvas } from './HeroCanvas';

const categoryShortcuts = [
  { name: 'Plants & Gardening', href: '/grow', index: '01', desc: 'Plants & gardens' },
  { name: 'Home & Organization', href: '/space', index: '02', desc: 'Homes & decluttering' },
  { name: 'Energy & Savings', href: '/energy', index: '03', desc: 'Solar & efficiency' },
  { name: 'Mindful Living', href: '/life', index: '04', desc: 'Mindfulness & habits' },
];

export function Hero() {
  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-center pt-28 pb-16 overflow-hidden bg-forest-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-forest-800/50 via-forest-950 to-forest-950 pointer-events-none" />
      <HeroCanvas />
      <div className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-forest-700/10 blur-3xl pointer-events-none" />
      <Container className="relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-12 lg:gap-20 items-center">
          <div className="relative z-10 max-w-2xl">
            <div className="hero-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-850/90 border border-forest-700/80 text-botanical-accent text-xs uppercase tracking-[0.2em] font-semibold mb-7 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-warm-accent" />
              <span>Better everyday living</span>
            </div>
            <p className="mb-5 text-[11px] uppercase tracking-[.28em] text-warm-accent">A journal for a more considered home</p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-normal text-cream-200 tracking-tight leading-[.98] mb-7">
              Grow Better.<br /><span className="italic text-cream-100 font-light">Live Lighter.</span>
            </h1>
            <p className="hero-reveal text-base sm:text-lg md:text-xl text-botanical-muted leading-relaxed font-sans max-w-xl mb-9">
              Practical ideas for greener spaces, smarter homes, lower energy use, and a more intentional life.
            </p>
            <div className="hero-reveal flex flex-col sm:flex-row items-center gap-4 mb-12">
              <a href="#latest-stories" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-warm-accent text-forest-950 font-semibold text-sm tracking-wide shadow-lg hover:bg-warm-gold hover:shadow-xl transition-all duration-200 group">
                <span>Explore Stories</span><ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <Link href="/grow" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-forest-600/80 bg-forest-900/60 text-cream-300 font-medium text-sm tracking-wide hover:border-botanical-accent hover:text-cream-100 hover:bg-forest-850 transition-all duration-200">
                <span>Start With Grow</span><ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex items-center gap-3 text-xs text-botanical-muted">
              <span className="flex -space-x-2" aria-hidden="true"><span className="w-7 h-7 rounded-full border-2 border-forest-950 bg-botanical-accent/70" /><span className="w-7 h-7 rounded-full border-2 border-forest-950 bg-warm-accent/70" /><span className="w-7 h-7 rounded-full border-2 border-forest-950 bg-forest-600" /></span>
              <span>Thoughtful ideas for everyday spaces</span>
            </div>
          </div>
          <div className="hero-reveal relative lg:mt-10">
            <div className="absolute -inset-5 rounded-[2rem] border border-forest-700/25 rotate-2" />
            <div className="relative rounded-[1.7rem] border border-forest-700/60 bg-forest-900/80 p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-forest-700/60">
                <p className="text-[11px] uppercase tracking-[.22em] text-botanical-muted">Explore the journal</p>
                <span className="font-serif italic text-warm-accent text-sm">A field guide to living well</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-botanical-muted mb-2 font-sans">Four ways to live a little lighter</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
                {categoryShortcuts.map((cat) => (
                  <Link key={cat.href} href={cat.href} className="group flex items-center gap-4 py-4 border-b border-forest-800/70 hover:border-warm-accent/60 transition-colors duration-200">
                    <span className="font-serif italic text-warm-accent/80">{cat.index}</span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-serif font-medium text-cream-200 group-hover:text-warm-accent transition-colors">{cat.name}</span><span className="block text-[11px] text-botanical-muted mt-1">{cat.desc}</span></span>
                    <ArrowRight className="w-4 h-4 text-botanical-muted group-hover:text-warm-accent group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
              <div className="pt-5 mt-1 flex items-center justify-between text-[11px] uppercase tracking-[.18em] text-botanical-muted"><span>Nature · home · habit</span><span className="text-warm-accent">Est. for everyday</span></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
