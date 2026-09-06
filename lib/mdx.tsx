import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from '@/components/mdx';

interface RenderMdxProps {
  source: string;
}

export function RenderMDX({ source }: RenderMdxProps) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        blockJS: false,
        blockDangerousJS: true,
      }}
    />
  );
}
