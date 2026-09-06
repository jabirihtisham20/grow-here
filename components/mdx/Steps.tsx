import React from 'react';

interface StepItem {
  title: string;
  description: string;
}

interface StepsProps {
  steps: StepItem[];
}

export function Steps({ steps }: StepsProps) {
  return (
    <div className="my-10 space-y-6">
      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-4 items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-forest-700 border border-botanical-accent/40 text-warm-accent font-serif text-base font-bold flex items-center justify-center mt-1">
            {idx + 1}
          </div>
          <div className="flex-1 rounded-xl bg-forest-800/60 border border-forest-700/40 p-4">
            <h4 className="font-serif text-lg font-medium text-cream-200 mb-1">{step.title}</h4>
            <p className="text-sm text-cream-400/85 leading-relaxed m-0">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
