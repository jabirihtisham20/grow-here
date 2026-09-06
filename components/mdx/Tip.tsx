import React from 'react';
import { Lightbulb } from 'lucide-react';

interface TipProps {
  title?: string;
  children: React.ReactNode;
}

export function Tip({ title = 'Pro Tip', children }: TipProps) {
  return (
    <div className="my-8 rounded-xl border border-warm-accent/30 bg-forest-800/90 p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-2 text-warm-accent font-medium text-sm tracking-wider uppercase">
        <Lightbulb className="w-4 h-4 text-warm-accent flex-shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-cream-400/90 text-base leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
