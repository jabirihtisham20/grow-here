import React from 'react';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';

export function BrandStatement() {
  return (
    <section className="py-24 md:py-36 bg-forest-950 border-t border-forest-850 relative overflow-hidden text-center">
      {/* Subtle organic light accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-forest-800/20 blur-[100px] pointer-events-none" />

      <Container size="narrow" className="relative z-10">
        <div className="w-12 h-12 mx-auto mb-6 text-cream-200/90 hover:scale-105 transition-transform duration-300">
          <Logo variant="mark" />
        </div>
        <div className="inline-block w-12 h-[1px] bg-warm-accent/60 mb-8" />

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-cream-100 leading-[1.15] tracking-tight">
          Small Changes. <br />
          <span className="italic font-normal text-cream-200">Better Places.</span> <br />
          Lighter Living.
        </h2>

        <p className="mt-8 text-base sm:text-lg md:text-xl text-botanical-muted max-w-2xl mx-auto leading-relaxed font-sans">
          Grow Here exists to make sustainable and intentional living feel practical rather than complicated. You do not need a perfect home, a huge garden or a complete lifestyle reset. Start where you are and improve what matters most.
        </p>

        <div className="mt-10 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.2em] text-warm-accent font-semibold font-sans">
          <span>🌱 Nurture</span>
          <span>&bull;</span>
          <span>🏠 Organize</span>
          <span>&bull;</span>
          <span>⚡ Conserve</span>
          <span>&bull;</span>
          <span>🧘 Ground</span>
        </div>
      </Container>
    </section>
  );
}
