import React from 'react';
import { Callout } from './Callout';
import { Tip } from './Tip';
import { Warning } from './Warning';
import { ProsCons } from './ProsCons';
import { ComparisonTable } from './ComparisonTable';
import { Steps } from './Steps';
import { FAQ } from './FAQ';
import { Quote } from './Quote';
import { ArticleImage } from './ArticleImage';

function getHeadingId(children: any): string {
  const text = typeof children === 'string'
    ? children
    : Array.isArray(children)
    ? children.map((c) => (typeof c === 'string' ? c : c?.props?.children || '')).join('')
    : String(children || '');

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const mdxComponents = {
  h2: ({ children, ...props }: any) => {
    const id = getHeadingId(children);
    return React.createElement('h2', { id, ...props }, children);
  },
  h3: ({ children, ...props }: any) => {
    const id = getHeadingId(children);
    return React.createElement('h3', { id, ...props }, children);
  },
  Callout,
  Tip,
  Warning,
  ProsCons,
  ComparisonTable,
  Steps,
  FAQ,
  Quote,
  ArticleImage,
};

export {
  Callout,
  Tip,
  Warning,
  ProsCons,
  ComparisonTable,
  Steps,
  FAQ,
  Quote,
  ArticleImage,
};
