'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'General Question',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const topics = [
    'General Question',
    'Editorial Feedback',
    'Partnership',
    'Correction',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch message. Please try again.');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        topic: 'General Question',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Network error occurred. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-botanical-accent/50 bg-forest-900/90 p-10 text-center max-w-lg mx-auto shadow-2xl animate-fade-in">
        <CheckCircle2 className="w-12 h-12 text-botanical-accent mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-medium text-cream-100 mb-2">
          Message Dispatched
        </h2>
        <p className="text-sm text-botanical-muted leading-relaxed mb-6 font-sans">
          Thank you for reaching out. Our editorial desk reviews incoming inquiries within two business days.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="px-6 py-2.5 rounded-full bg-forest-800 border border-forest-700 text-xs uppercase tracking-wider font-semibold text-warm-accent hover:bg-forest-750 transition-colors"
        >
          Send Another Note
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-forest-750/80 bg-forest-900/60 p-8 sm:p-12 shadow-xl space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-xs uppercase tracking-wider font-semibold text-cream-300 mb-2 font-sans"
          >
            Your Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="E.g. Rowan Sterling"
            className="w-full px-4 py-3 rounded-xl bg-forest-850 border border-forest-700 text-cream-200 text-sm focus:outline-none focus:border-warm-accent shadow-inner placeholder-botanical-muted/50"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-wider font-semibold text-cream-300 mb-2 font-sans"
          >
            Your Email Address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="rowan@example.com"
            className="w-full px-4 py-3 rounded-xl bg-forest-850 border border-forest-700 text-cream-200 text-sm focus:outline-none focus:border-warm-accent shadow-inner placeholder-botanical-muted/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="topic"
            className="block text-xs uppercase tracking-wider font-semibold text-cream-300 mb-2 font-sans"
          >
            Topic *
          </label>
          <select
            id="topic"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-forest-850 border border-forest-700 text-cream-200 text-sm focus:outline-none focus:border-warm-accent shadow-inner"
          >
            {topics.map((t) => (
              <option key={t} value={t} className="bg-forest-900 text-cream-200">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-xs uppercase tracking-wider font-semibold text-cream-300 mb-2 font-sans"
          >
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Brief description..."
            className="w-full px-4 py-3 rounded-xl bg-forest-850 border border-forest-700 text-cream-200 text-sm focus:outline-none focus:border-warm-accent shadow-inner placeholder-botanical-muted/50"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs uppercase tracking-wider font-semibold text-cream-300 mb-2 font-sans"
        >
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Share your thoughts, suggestions, or questions..."
          className="w-full px-4 py-3 rounded-xl bg-forest-850 border border-forest-700 text-cream-200 text-sm focus:outline-none focus:border-warm-accent shadow-inner placeholder-botanical-muted/50"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-xs text-amber-400">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-forest-800">
        <p className="text-xs text-botanical-muted/70 font-sans">
          We read every message. Response times may vary, and we cannot provide personalized medical, legal, financial or electrical advice.
        </p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-warm-accent text-forest-950 font-semibold text-xs uppercase tracking-wider hover:bg-warm-gold transition-colors shadow-md disabled:opacity-50 flex-shrink-0"
        >
          <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}
