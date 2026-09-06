import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WarningProps {
  title?: string;
  children: React.ReactNode;
}

export function Warning({ title = 'Important Caution', children }: WarningProps) {
  return (
    <div className="my-8 rounded-xl border border-amber-600/40 bg-[#1A1608]/80 p-5 md:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-2 text-amber-400 font-medium text-sm tracking-wider uppercase">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-cream-400/90 text-base leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
