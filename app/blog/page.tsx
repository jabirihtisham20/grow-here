import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { LatestFilter } from '@/components/blog/LatestFilter';
import { Newsletter } from '@/components/home/Newsletter';
import { getAllPosts } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Blog | Grow Here',
  description: 'Explore the latest practical guides from Grow Here on gardening, small spaces, energy, and mindful living.',
  alternates: { canonical: `${SITE_CONFIG.url}/blog` },
  openGraph: {
    title: 'Blog | Grow Here',
    description: 'Explore the latest practical guides from Grow Here on gardening, small spaces, energy, and mindful living.',
    url: `${SITE_CONFIG.url}/blog`,
  },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const requestedPage = Math.max(1, Math.floor(Number((await searchParams).page) || 1));
  const posts = getAllPosts();
  return (
    <div className="pt-28 pb-20 bg-forest-950 min-h-screen">
      <Container>
        <div className="relative py-14 sm:py-20 border-b border-forest-800 mb-12 overflow-hidden">
          <div className="absolute right-0 top-4 hidden md:block font-serif italic text-[10rem] leading-none text-forest-800/40 select-none" aria-hidden="true">gh.</div>
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700/80 text-[11px] uppercase tracking-[0.2em] font-semibold text-warm-accent mb-5">Stories &amp; Guides</div>
            <p className="text-xs uppercase tracking-[.24em] text-botanical-muted mb-3">The Grow Here Journal</p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-cream-100 tracking-tight leading-[1.02] mb-5">Ideas for a more<br className="hidden sm:block" /> thoughtful everyday.</h1>
            <p className="text-lg sm:text-xl text-botanical-muted max-w-2xl font-sans leading-relaxed">Practical ideas for greener spaces, smarter homes, and lighter living.</p>
          </div>
        </div>
        <LatestFilter initialVisibleCount={Math.min(posts.length, 12 + (requestedPage - 1) * 6)} posts={posts} />
      </Container>
      <div className="mt-24"><Newsletter /></div>
    </div>
  );
}
