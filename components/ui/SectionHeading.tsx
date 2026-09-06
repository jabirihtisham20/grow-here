import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  theme?: 'dark' | 'light' | 'warm';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  theme = 'dark',
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  const themeStyles = {
    dark: {
      eyebrow: 'text-botanical-accent',
      title: 'text-cream-200',
      desc: 'text-botanical-muted',
    },
    light: {
      eyebrow: 'text-forest-700 font-semibold',
      title: 'text-forest-950',
      desc: 'text-forest-700/80',
    },
    warm: {
      eyebrow: 'text-warm-accent',
      title: 'text-cream-200',
      desc: 'text-botanical-muted',
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className={cn('mb-10 md:mb-14', isCenter && 'text-center mx-auto max-w-2xl', className)}>
      {eyebrow && (
        <div className={cn('flex items-center gap-2 mb-3', isCenter && 'justify-center')}>
          <span className="inline-block w-2 h-2 rounded-full bg-warm-accent" />
          <span className={cn('text-xs uppercase tracking-[0.2em] font-semibold', currentTheme.eyebrow)}>
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className={cn('font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-[1.15]', currentTheme.title)}>
        {title}
      </h2>
      {description && (
        <p className={cn('mt-4 text-base sm:text-lg leading-relaxed font-sans max-w-2xl', isCenter && 'mx-auto', currentTheme.desc)}>
          {description}
        </p>
      )}
    </div>
  );
}
