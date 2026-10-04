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

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="pt-28 pb-20 bg-forest-950 min-h-screen">
      <Container>
        <div className="py-12 border-b border-forest-800 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-850 border border-forest-700/80 text-[11px] uppercase tracking-[0.2em] font-semibold text-warm-accent mb-4">Stories &amp; Guides</div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-cream-100 tracking-tight mb-4">The Grow Here Blog</h1>
          <p className="text-lg sm:text-xl text-botanical-muted max-w-2xl font-sans leading-relaxed">Practical ideas for greener spaces, smarter homes, and lighter living.</p>
        </div>
        <LatestFilter posts={posts} />
      </Container>
      <div className="mt-24"><Newsletter /></div>
    </div>
  );
}
