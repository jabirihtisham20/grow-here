import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
  noindex?: boolean;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getAllPosts(includeDrafts = false): Post[] {
  const categories: CategoryKey[] = ['grow', 'space', 'energy', 'life'];
  const allPosts: Post[] = [];

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;

    const filenames = fs.readdirSync(categoryDir).filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));

    for (const filename of filenames) {
      const filePath = path.join(categoryDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const slug = filename.replace(/\.(mdx|md)$/, '');

      const status = (data.status as 'draft' | 'published') || 'published';
      if (!includeDrafts && status === 'draft') {
        continue;
      }

      allPosts.push({
        slug,
        title: data.title || 'Untitled',
        description: data.description || '',
        category: (data.category as CategoryKey) || category,
        subcategory: data.subcategory || 'General',
        author: data.author || {
          name: 'Grow Here Editorial',
          role: 'Staff Writer',
          avatar: '/images/authors/editorial.webp',
        },
        publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
        updatedAt: data.updatedAt,
        image: data.image || '/images/posts/hydroponics-for-beginners.webp',
        imageAlt: data.imageAlt || data.title || '',
        featured: Boolean(data.featured),
        editorsPick: Boolean(data.editorsPick),
        status,
        readingTime: data.readingTime || '5 min read',
        tags: Array.isArray(data.tags) ? data.tags : [],
        seoTitle: data.seoTitle || undefined,
        metaDescription: data.metaDescription || undefined,
        primaryKeyword: data.primaryKeyword || undefined,
        secondaryKeywords: Array.isArray(data.secondaryKeywords) ? data.secondaryKeywords : [],
        noindex: Boolean(data.noindex),
        content,
      });
    }
  }

  // Sort by published date descending
  return allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPostsByCategory(category: CategoryKey, includeDrafts = false): Post[] {
  return getAllPosts(includeDrafts).filter((post) => post.category.toLowerCase() === category.toLowerCase());
}

export function getPostBySlug(category: CategoryKey, slug: string, includeDrafts = false): Post | null {
  const posts = getPostsByCategory(category, includeDrafts);
  return posts.find((p) => p.slug === slug) || null;
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
  const categoryPosts = getPostsByCategory(category).filter((p) => p.slug !== currentSlug);

  // Score posts based on matching tags
  const scored = categoryPosts.map((post) => {
    let score = 0;
    for (const tag of tags) {
      if (post.tags.includes(tag)) score += 2;
    }
    if (post.subcategory === categoryPosts.find((p) => p.slug === currentSlug)?.subcategory) {
      score += 1;
    }
    return { post, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const results = scored.slice(0, limit).map((item) => item.post);

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
