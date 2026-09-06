import React from 'react';
import { Info } from 'lucide-react';

interface CalloutProps {
  title?: string;
  children: React.ReactNode;
}

export function Callout({ title = 'Editorial Note', children }: CalloutProps) {
  return (
    <aside className="my-8 rounded-xl border border-forest-600/50 bg-forest-800/80 p-5 md:p-6 backdrop-blur-sm text-cream-400 shadow-md">
      <div className="flex items-center gap-2.5 mb-2.5 text-botanical-accent font-medium text-sm tracking-wider uppercase">
        <Info className="w-4 h-4 text-botanical-accent flex-shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-cream-400/90 text-base leading-relaxed space-y-2 font-normal">
        {children}
      </div>
    </aside>
  );
}
