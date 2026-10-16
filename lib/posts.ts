import { readContentPosts } from './blog-content.js';

export * from './categories';
import { CategoryKey, CATEGORIES } from './categories';

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  category: CategoryKey;
  subcategory: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
  editorsPick?: boolean;
  status?: 'draft' | 'published';
  readingTime: string;
  tags: string[];
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  relatedPosts?: string[];
  noindex?: boolean;
  content: string;
}

export function getAllPosts(includeDrafts = false): Post[] {
  return readContentPosts(includeDrafts);
}

export function getPostsByCategory(category: CategoryKey, includeDrafts = false): Post[] {
  return getAllPosts(includeDrafts).filter((post) => post.category.toLowerCase() === category.toLowerCase());
}

export function getPostBySlug(category: CategoryKey, slug: string, includeDrafts = false): Post | null {
  const posts = getPostsByCategory(category, includeDrafts);
  return posts.find((p) => p.slug === slug) || null;
}

export function getPostByAnySlug(slug: string, includeDrafts = false): Post | null {
  return getAllPosts(includeDrafts).find((post) => post.slug === slug) || null;
}

export function getFeaturedPost(): Post | null {
  const all = getAllPosts();
  return all.find((p) => p.featured) || all[0] || null;
}

export function getLatestPosts(limit = 8): Post[] {
  return getAllPosts().slice(0, limit);
}

export function getPopularGuides(): Post[] {
  // Select 5 curated popular posts across categories
  const all = getAllPosts();
  const popularSlugs = [
    'best-low-light-indoor-plants-apartments',
    'small-apartment-organization-ideas',
    'how-to-save-energy-at-home',
    'digital-minimalism-guide',
    'balcony-herb-garden',
  ];
  const matched = popularSlugs
    .map((s) => all.find((p) => p.slug === s))
    .filter((p): p is Post => Boolean(p));

  if (matched.length < 5) {
    return all.slice(0, 5);
  }
  return matched;
}

export function getRelatedPosts(currentSlug: string, category: CategoryKey, tags: string[] = [], limit = 3): Post[] {
  const current = getPostByAnySlug(currentSlug, true);
  const explicit = (current?.relatedPosts || [])
    .map((slug) => getPostByAnySlug(slug))
    .filter((post): post is Post => Boolean(post) && post!.slug !== currentSlug);
  const categoryPosts = getPostsByCategory(category).filter((p) => p.slug !== currentSlug);

  // Score posts based on matching tags
  const scored = categoryPosts.map((post) => {
    let score = 0;
    for (const tag of tags) {
      if (post.tags.includes(tag)) score += 2;
    }
    if (post.subcategory === current?.subcategory) {
      score += 1;
    }
    return { post, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const results = [...explicit, ...scored.map((item) => item.post)]
    .filter((post, index, posts) => posts.findIndex((p) => p.slug === post.slug) === index)
    .slice(0, limit);

  // Fallback if not enough scored posts
  if (results.length < limit) {
    const remaining = getAllPosts().filter((p) => p.slug !== currentSlug && !results.some((r) => r.slug === p.slug));
    results.push(...remaining.slice(0, limit - results.length));
  }

  return results;
}

export function getSearchIndex() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    subcategory: post.subcategory,
    tags: post.tags,
    readingTime: post.readingTime,
    publishedAt: post.publishedAt,
    image: post.image,
  }));
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(markdown: string): HeadingItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const text = rawText
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .trim();

    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    headings.push({
      id: slug,
      text,
      level,
    });
  }

  return headings;
}
