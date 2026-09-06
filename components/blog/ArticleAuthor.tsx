import React from 'react';
import Image from 'next/image';
import { Author } from '@/lib/posts';

interface ArticleAuthorProps {
  author: Author;
}

export function ArticleAuthor({ author }: ArticleAuthorProps) {
  return (
    <div className="my-12 rounded-2xl border border-forest-700/60 bg-forest-850/80 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-botanical-accent/40 bg-forest-800">
        <Image
          src={author.avatar}
          alt={author.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="text-center sm:text-left flex-1">
        <div className="text-xs uppercase tracking-wider font-semibold text-botanical-accent">
          Written By
        </div>
        <h3 className="font-serif text-xl font-medium text-cream-200 mt-0.5">
          {author.name}
        </h3>
        <p className="text-xs text-warm-accent font-sans mt-0.5">
          {author.role}
        </p>
        <p className="text-sm text-botanical-muted mt-2 leading-relaxed font-sans">
          Curating practical, evidence-backed advice for greener homes, sustainable systems, and intentional daily living across Grow Here.
        </p>
      </div>
    </div>
  );
}
