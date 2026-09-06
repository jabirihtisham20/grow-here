import { Post } from './posts';

export const SITE_CONFIG = {
  name: 'Grow Here',
  title: 'Grow Here | Greener Spaces, Smarter Homes, Lighter Living',
  description: 'Practical guides for indoor plants, small-space living, energy saving, solar, digital wellness, minimalism and mindful everyday life.',
  primaryKeyword: 'sustainable living ideas',
  url: 'https://growhere.online',
  ogImage: 'https://growhere.online/images/posts/how-to-create-a-greener-calmer-home.webp',
  author: 'Grow Here Editorial Team',
  twitterHandle: '@growhere',
};

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/favicon-192.png`,
    sameAs: [
      'https://instagram.com/growhere',
      'https://pinterest.com/growhere',
      'https://youtube.com/growhere',
      'https://facebook.com/growhere',
    ],
  };
}

export function generateArticleSchema(post: Post) {
  const absoluteImage = post.image.startsWith('http')
    ? post.image
    : `${SITE_CONFIG.url}${post.image.startsWith('/') ? '' : '/'}${post.image}`;

  const authorAvatar = post.author.avatar.startsWith('http')
    ? post.author.avatar
    : `${SITE_CONFIG.url}${post.author.avatar.startsWith('/') ? '' : '/'}${post.author.avatar}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: [absoluteImage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: [
      {
        '@type': 'Person',
        name: post.author.name,
        jobTitle: post.author.role,
        image: authorAvatar,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/favicon-192.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/${post.category}/${post.slug}`,
    },
    keywords: post.tags.join(', '),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
