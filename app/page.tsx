import React from 'react';
import { Hero } from '@/components/home/Hero';
import { FeaturedStory } from '@/components/home/FeaturedStory';
import { ContentPillars } from '@/components/home/ContentPillars';
import { LatestStories } from '@/components/home/LatestStories';
import { CategorySection } from '@/components/home/CategorySection';
import { PopularGuides } from '@/components/home/PopularGuides';
import { Newsletter } from '@/components/home/Newsletter';
import { BrandStatement } from '@/components/home/BrandStatement';
import {
  getFeaturedPost,
  getLatestPosts,
  getPostsByCategory,
  getPopularGuides,
} from '@/lib/posts';

export default function HomePage() {
  const featuredPost = getFeaturedPost();
  const latestPosts = getLatestPosts(8);
  const growPosts = getPostsByCategory('grow');
  const spacePosts = getPostsByCategory('space');
  const energyPosts = getPostsByCategory('energy');
  const lifePosts = getPostsByCategory('life');
  const popularPosts = getPopularGuides();

  return (
    <>
      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Featured Story */}
      {featuredPost && <FeaturedStory post={featuredPost} />}

      {/* 4. Four Content Pillars */}
      <ContentPillars />

      {/* 5. Latest Stories */}
      <LatestStories posts={latestPosts} />

      {/* 6. Grow Editorial Section */}
      <CategorySection
        category="grow"
        icon="🌱"
        eyebrow="Grow Something"
        title="Nurturing Life in Everyday Spaces"
        description="Practical guidance for bringing more green into compact apartments, windowsills, and urban spaces."
        ctaText="View All Grow Stories"
        posts={growPosts}
        theme="default"
      />

      {/* 7. Space Editorial Section */}
      <CategorySection
        category="space"
        icon="🏠"
        eyebrow="Make Room for Better Living"
        title="Functional Design & Spatial Clarity"
        description="Organization and small-space ideas designed around how people actually live, work, and rest."
        ctaText="View All Space Stories"
        posts={spacePosts}
        theme="cream"
      />

      {/* 8. Energy Editorial Section (with warm accent styling) */}
      <CategorySection
        category="energy"
        icon="⚡"
        eyebrow="Use Less. Live Smarter."
        title="Quiet Power & Home Efficiency"
        description="Demystifying solar economics, eliminating phantom draw, and making smarter home-energy choices."
        ctaText="View All Energy Stories"
        posts={energyPosts}
        theme="warm"
      />

      {/* 9. Life Editorial Section */}
      <CategorySection
        category="life"
        icon="🧘"
        eyebrow="Live With Intention"
        title="Mindful Cadence in a Fast World"
        description="Digital minimalism, grounding daily habits, and practical philosophy for more intentional living."
        ctaText="View All Life Stories"
        posts={lifePosts}
        theme="default"
      />

      {/* 10. Popular Guides */}
      <PopularGuides posts={popularPosts} />

      {/* 11. Newsletter */}
      <Newsletter />

      {/* 12. Editorial / Brand Message */}
      <BrandStatement />
    </>
  );
}
