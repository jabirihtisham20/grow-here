import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter((post) => !post.noindex);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'monthly',
    priority: post.featured ? 0.9 : 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/grow',
    '/space',
    '/energy',
    '/life',
    '/latest',
    '/blog',
    '/search',
    '/about',
    '/contact',
    '/editorial-policy',
    '/privacy-policy',
    '/terms-and-conditions',
  ].map((route) => ({
    url: `${SITE_CONFIG.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticRoutes, ...postEntries];
}
