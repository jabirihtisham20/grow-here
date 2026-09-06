'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Search, Menu } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';

const MobileMenu = dynamic(
  () => import('./MobileMenu').then((mod) => mod.MobileMenu),
  { ssr: false }
);

const SearchModal = dynamic(
  () => import('@/components/search/SearchModal').then((mod) => mod.SearchModal),
  { ssr: false }
);

interface HeaderProps {
  searchIndex?: Array<{
    slug: string;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    tags: string[];
    readingTime: string;
  }>;
}

export function Header({ searchIndex }: HeaderProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/keystatic')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Plants & Gardening', href: '/grow' },
    { name: 'Home & Organization', href: '/space' },
    { name: 'Energy & Savings', href: '/energy' },
    { name: 'Mindful Living', href: '/life' },
    { name: 'Latest', href: '/latest' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-forest-950/85 backdrop-blur-md border-b border-forest-800/80 py-3 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center transition-opacity hover:opacity-95"
            >
              <Logo variant="horizontal" showTagline={true} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-sans tracking-wide transition-colors relative py-1 ${
                      isActive
                        ? 'text-warm-accent font-medium'
                        : 'text-cream-400 hover:text-warm-accent'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-accent rounded-full animate-fade-in" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search articles (Ctrl+K)"
                className="p-2.5 rounded-full text-cream-400 hover:text-warm-accent hover:bg-forest-800/60 transition-colors flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>

              <a
                href="#newsletter"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-warm-accent text-forest-950 text-xs font-semibold uppercase tracking-wider hover:bg-warm-gold hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Join Grow Here
              </a>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open mobile menu"
                className="md:hidden p-2 rounded-lg text-cream-400 hover:text-cream-200 hover:bg-forest-800/60 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {isMobileMenuOpen && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          posts={searchIndex}
        />
      )}
    </>
  );
}
