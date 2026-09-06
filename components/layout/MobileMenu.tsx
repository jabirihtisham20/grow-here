'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, Search } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

export function MobileMenu({ isOpen, onClose, onOpenSearch }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Plants & Gardening', href: '/grow', icon: '🌱' },
    { name: 'Home & Organization', href: '/space', icon: '🏠' },
    { name: 'Energy & Savings', href: '/energy', icon: '⚡' },
    { name: 'Mindful Living', href: '/life', icon: '🧘' },
    { name: 'Latest Stories', href: '/latest' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 bg-forest-950/95 backdrop-blur-xl flex flex-col justify-between p-6 animate-fade-in md:hidden"
    >
      <div>
        <div className="flex items-center justify-between border-b border-forest-800/80 pb-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center"
          >
            <Logo variant="horizontal" showTagline={false} />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              aria-label="Search stories"
              className="p-2.5 rounded-full text-cream-400 hover:text-warm-accent hover:bg-forest-800 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2.5 rounded-full text-cream-400 hover:text-cream-200 hover:bg-forest-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <nav className="mt-8 space-y-1" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between py-3 px-3 rounded-xl text-lg font-serif text-cream-200 hover:text-warm-accent hover:bg-forest-900 transition-colors"
            >
              <span>{link.name}</span>
              {link.icon && <span className="text-base">{link.icon}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="pt-6 border-t border-forest-800/80">
        <a
          href="#newsletter"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-full bg-warm-accent text-forest-950 font-semibold text-sm tracking-wide shadow-md hover:bg-warm-gold transition-colors"
        >
          Join Grow Here
        </a>
        <p className="mt-4 text-center text-xs text-botanical-muted">
          Better spaces &bull; Greener habits &bull; Mindful living
        </p>
      </div>
    </div>
  );
}
