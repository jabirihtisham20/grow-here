'use client';

import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import type { HeadingItem } from '@/lib/posts';

interface TableOfContentsProps {
  headings?: HeadingItem[];
}

export function TableOfContents({ headings: propHeadings }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>(propHeadings || []);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // If headings were provided via SSR, observe them directly
    if (propHeadings && propHeadings.length > 0) {
      setHeadings(propHeadings);
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '0% 0% -60% 0%' }
      );

      propHeadings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });

      return () => observer.disconnect();
    }

    // Fallback if no SSR headings passed
    const article = document.querySelector('article');
    if (!article) return;

    const elements = Array.from(article.querySelectorAll('h2, h3'));
    const items: HeadingItem[] = elements.map((elem, idx) => {
      if (!elem.id) {
        elem.id = `heading-${idx}-${elem.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      }
      return {
        id: elem.id,
        text: elem.textContent || '',
        level: Number(elem.tagName.substring(1)),
      };
    });

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -60% 0%' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [propHeadings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="my-8 rounded-2xl border border-forest-750/80 bg-forest-850/80 p-5 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-warm-accent mb-3">
        <List className="w-4 h-4" />
        <span>In This Guide</span>
      </div>
      <ul className="space-y-2 text-sm text-botanical-muted font-sans list-none pl-0">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? 'ml-4 text-xs' : 'text-sm'}
          >
            <a
              href={`#${heading.id}`}
              className={`block transition-colors hover:text-warm-accent ${
                activeId === heading.id
                  ? 'text-warm-accent font-medium'
                  : 'text-cream-400/90'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
