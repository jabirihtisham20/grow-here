import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-forest-800/80 bg-forest-950 text-cream-400 pt-16 pb-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 border-b border-forest-850">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-block transition-opacity hover:opacity-95"
            >
              <Logo variant="horizontal" showTagline={true} />
            </Link>
            <p className="text-sm text-botanical-muted leading-relaxed max-w-sm font-sans">
              Practical ideas for greener spaces, smarter homes, lower energy use, and a more intentional life. Nature + Modern Living + Practical Sustainability.
            </p>
            <div className="pt-2 text-xs text-botanical-accent font-mono">
              Better spaces &bull; Greener habits &bull; Mindful living
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] font-semibold text-warm-accent mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-botanical-muted">
              <li>
                <Link href="/grow" className="hover:text-cream-200 transition-colors">
                  🌱 Plants &amp; Gardening
                </Link>
              </li>
              <li>
                <Link href="/space" className="hover:text-cream-200 transition-colors">
                  🏠 Home &amp; Organization
                </Link>
              </li>
              <li>
                <Link href="/energy" className="hover:text-cream-200 transition-colors">
                  ⚡ Energy &amp; Savings
                </Link>
              </li>
              <li>
                <Link href="/life" className="hover:text-cream-200 transition-colors">
                  🧘 Mindful Living
                </Link>
              </li>
              <li>
                <Link href="/latest" className="hover:text-cream-200 transition-colors">
                  Latest Stories
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-cream-200 transition-colors">
                  Search Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages & Legal */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] font-semibold text-warm-accent mb-4">
              Pages
            </h3>
            <ul className="space-y-2.5 text-sm text-botanical-muted">
              <li>
                <Link href="/about" className="hover:text-cream-200 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cream-200 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-cream-200 transition-colors">
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-cream-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-cream-200 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] font-semibold text-warm-accent mb-4">
              Follow
            </h3>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Grow Here on Instagram"
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-800 flex items-center justify-center text-cream-300 hover:text-warm-accent hover:border-warm-accent/50 hover:bg-forest-850 hover:scale-110 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Grow Here on Pinterest"
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-800 flex items-center justify-center text-cream-300 hover:text-warm-accent hover:border-warm-accent/50 hover:bg-forest-850 hover:scale-110 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to Grow Here on YouTube"
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-800 flex items-center justify-center text-cream-300 hover:text-warm-accent hover:border-warm-accent/50 hover:bg-forest-850 hover:scale-110 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Grow Here on Facebook"
                className="w-9 h-9 rounded-full bg-forest-900 border border-forest-800 flex items-center justify-center text-cream-300 hover:text-warm-accent hover:border-warm-accent/50 hover:bg-forest-850 hover:scale-110 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-botanical-muted/80">
          <p>&copy; {currentYear} Grow Here. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-cream-200 transition-colors">
              Privacy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-cream-200 transition-colors">
              Terms
            </Link>
            <Link href="/editorial-policy" className="hover:text-cream-200 transition-colors">
              Ethics
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
