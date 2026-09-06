'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to join. Please try again.');
      }

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Network error occurred. Please try again.');
    }
  };

  return (
    <section id="newsletter" className="py-20 md:py-28 bg-forest-900 border-t border-forest-800 relative overflow-hidden">
      {/* Subtle organic background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-forest-800/30 blur-3xl pointer-events-none" />

      <Container size="narrow" className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 border border-forest-700 text-[11px] uppercase tracking-[0.2em] font-semibold text-warm-accent mb-6">
          <span>Weekly Editorial Dispatch</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-cream-100 tracking-tight mb-4">
          Grow Better Every Week.
        </h2>

        <p className="text-base sm:text-lg text-botanical-muted max-w-xl mx-auto leading-relaxed mb-8 font-sans">
          Fresh ideas for plants, spaces, energy and intentional living &mdash; delivered without the noise.
        </p>

        {status === 'success' ? (
          <div className="rounded-2xl border border-botanical-accent/40 bg-forest-850/90 p-8 max-w-md mx-auto animate-fade-in shadow-xl">
            <CheckCircle2 className="w-10 h-10 text-botanical-accent mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-cream-100 mb-1">
              Welcome to Grow Here.
            </h3>
            <p className="text-sm text-botanical-muted">
              We&apos;ve sent a confirmation link to your inbox. Thank you for joining our community of intentional living.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Your email address"
                aria-label="Email address"
                required
                className="flex-1 px-5 py-3.5 rounded-full bg-forest-850 border border-forest-700 text-cream-200 text-sm placeholder-botanical-muted/60 focus:outline-none focus:border-warm-accent shadow-inner"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-warm-accent text-forest-950 font-semibold text-xs uppercase tracking-wider hover:bg-warm-gold transition-colors shadow-md disabled:opacity-50"
              >
                <span>{status === 'loading' ? 'Joining...' : 'Join Grow Here'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {status === 'error' && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <p className="mt-4 text-xs text-botanical-muted font-sans">
              No spam. Just useful ideas.
            </p>
          </form>
        )}
      </Container>
    </section>
  );
}
