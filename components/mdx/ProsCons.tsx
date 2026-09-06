import React from 'react';
import { Check, X } from 'lucide-react';

interface ProsConsProps {
  pros?: string[];
  cons?: string[];
}

export function ProsCons({ pros = [], cons = [] }: ProsConsProps) {
  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-botanical-accent/30 bg-forest-800/80 p-5">
        <h4 className="flex items-center gap-2 text-botanical-accent font-semibold text-base mb-3">
          <Check className="w-5 h-5 text-botanical-accent" />
          The Advantages
        </h4>
        <ul className="space-y-2.5 text-sm text-cream-400/90 list-none pl-0">
          {pros.map((pro, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-botanical-accent mt-0.5">•</span>
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-amber-600/30 bg-forest-800/80 p-5">
        <h4 className="flex items-center gap-2 text-amber-400 font-semibold text-base mb-3">
          <X className="w-5 h-5 text-amber-400" />
          Considerations & Drawbacks
        </h4>
        <ul className="space-y-2.5 text-sm text-cream-400/90 list-none pl-0">
          {cons.map((con, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
