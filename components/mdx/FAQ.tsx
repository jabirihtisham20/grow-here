'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export function FAQ({ items, title = 'Frequently Asked Questions' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="my-12 rounded-2xl border border-forest-700/60 bg-forest-850/90 p-6 md:p-8">
      <h3 className="font-serif text-2xl text-cream-200 mb-6 font-semibold">{title}</h3>
      <div className="space-y-4">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-forest-700/50 bg-forest-800/60 overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 text-cream-200 hover:text-warm-accent transition-colors font-medium text-base"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-botanical-accent transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-sm text-cream-400/85 leading-relaxed border-t border-forest-700/30">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
