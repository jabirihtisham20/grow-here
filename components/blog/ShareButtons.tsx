'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-wider font-semibold text-botanical-muted">
        Share
      </span>
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share article"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-forest-700 bg-forest-800/80 text-xs text-cream-300 hover:text-warm-accent hover:border-warm-accent/50 transition-colors"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link to article"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-forest-700 bg-forest-800/80 text-xs text-cream-300 hover:text-warm-accent hover:border-warm-accent/50 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-botanical-accent" />
            <span className="text-botanical-accent">Copied</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
