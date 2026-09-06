import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Compass, ArrowLeft, Search, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Grow Here',
  description: 'The dispatch, story, or guide you are looking for has been moved, renamed, or does not exist.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function NotFound() {
  const quickLinks = [
    { name: '🌱 Plants & Gardening', href: '/grow' },
    { name: '🏠 Home & Organization', href: '/space' },
    { name: '⚡ Energy & Savings', href: '/energy' },
    { name: '🧘 Mindful Living', href: '/life' },
  ];

  return (
    <div className="pt-32 pb-24 bg-forest-950 min-h-[85vh] flex items-center">
      <Container size="narrow" className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-850 border border-forest-750 text-xs uppercase tracking-[0.2em] font-semibold text-warm-accent mb-6 shadow-sm">
          <Compass className="w-3.5 h-3.5 text-botanical-accent" />
          <span>404 &bull; Navigation Error</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal text-cream-100 tracking-tight mb-6">
          Lost in the Foliage.
        </h1>

        <p className="text-base sm:text-lg text-botanical-muted max-w-lg mx-auto leading-relaxed mb-10 font-sans">
          The dispatch, article, or page you are looking for does not exist, has been moved, or has a typo in its web address.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-warm-accent text-forest-950 font-semibold text-sm tracking-wide shadow-lg hover:bg-warm-gold transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-forest-700 bg-forest-900/60 text-cream-300 font-medium text-sm tracking-wide hover:border-botanical-accent hover:text-cream-100 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search Library</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-forest-850 max-w-md mx-auto">
          <p className="text-xs uppercase tracking-widest text-botanical-muted mb-4 font-sans">
            Or explore by content pillar
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="p-3 rounded-xl border border-forest-800/80 bg-forest-900/40 text-cream-300 hover:border-forest-650 hover:bg-forest-850 hover:text-warm-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
