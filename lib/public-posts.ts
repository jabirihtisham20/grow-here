import { Post, getAllPosts } from './posts';

// Preserve the existing read API field names while using immutable file identities.
export function publicPost(post: Post, includeContent = false) {
  const canonical = `https://growhere.online/blog/${post.slug}`;
  return {
    id: post.slug, title: post.title, slug: post.slug, excerpt: post.description,
    ...(includeContent ? { content: post.content } : {}),
    featured_image: post.image, image_alt: post.imageAlt, author_snapshot: post.author,
    status: 'PUBLISHED', seo_title: post.seoTitle || post.title,
    seo_description: post.metaDescription || post.description, canonical_url: canonical,
    open_graph_title: post.title, open_graph_description: post.description, open_graph_image: post.image,
    published_at: post.publishedAt, updated_at: post.updatedAt || post.publishedAt,
    category_slug: post.category, tags: post.tags,
    primary_keyword: post.primaryKeyword, secondary_keywords: post.secondaryKeywords,
  };
}

export function publishedPosts() {
  return getAllPosts();
}
