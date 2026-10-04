import React from 'react';
import Image from 'next/image';

interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function ArticleImage({
  src,
  alt,
  caption,
  width = 1200,
  height = 700,
}: ArticleImageProps) {
  return (
    <figure className="my-10">
      <div className="relative overflow-hidden rounded-2xl border border-forest-700/60 bg-forest-850 aspect-[16/9] shadow-xl">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized={src.startsWith('http')}
          className="object-cover transition-transform duration-500 hover:scale-[1.01]"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-botanical-muted italic font-sans tracking-wide">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
