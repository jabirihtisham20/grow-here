import React from 'react';

interface QuoteProps {
  children: React.ReactNode;
  author?: string;
  source?: string;
}

export function Quote({ children, author, source }: QuoteProps) {
  return (
    <figure className="my-10 border-l-4 border-warm-accent pl-6 py-2">
      <blockquote className="font-serif text-xl md:text-2xl text-cream-200 italic leading-relaxed">
        &ldquo;{children}&rdquo;
      </blockquote>
      {(author || source) && (
        <figcaption className="mt-3 text-sm text-botanical-muted font-sans tracking-wide">
          {author && <span className="font-medium text-cream-400">{author}</span>}
          {author && source && <span> &mdash; </span>}
          {source && <span>{source}</span>}
        </figcaption>
      )}
    </figure>
  );
}
