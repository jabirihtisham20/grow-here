// Shared filesystem reader used by Next.js and the standalone validation command.
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const categories = ['grow', 'space', 'energy', 'life'];
const root = process.cwd();

function slugify(title) {
  return title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function fail(file, message) { throw new Error(`${file}: ${message}`); }
function text(value, file, field) {
  if (typeof value !== 'string' || !value.trim()) fail(file, `${field} must be a non-empty string`);
  return value;
}
function list(value, file, field) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some(v => typeof v !== 'string' || !v.trim())) fail(file, `${field} must be a string array`);
  return value;
}
function alias(data, oldKey, newKey, file) {
  if (data[oldKey] !== undefined && data[newKey] !== undefined && String(data[oldKey]) !== String(data[newKey])) fail(file, `conflicting ${oldKey}/${newKey}`);
  return data[oldKey] ?? data[newKey];
}
function date(value, file, field, optional = false) {
  if (value === undefined && optional) return undefined;
  const result = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  if (typeof result !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(result) || Number.isNaN(Date.parse(result)) || new Date(result).toISOString().slice(0, 10) !== result.slice(0, 10)) fail(file, `invalid ${field}`);
  return result;
}
function media(value, file, field) {
  text(value, file, field);
  if (value.startsWith('/')) {
    const asset = path.resolve(root, 'public', `.${value}`);
    if (!asset.startsWith(path.resolve(root, 'public') + path.sep) || !fs.existsSync(asset) || !fs.statSync(asset).isFile()) fail(file, `missing or unsafe ${field}: ${value}`);
  } else {
    let url; try { url = new URL(value); } catch { fail(file, `invalid ${field} URL`); }
    if (url.protocol !== 'https:' || url.username || url.password) fail(file, `${field} must use public HTTPS or /images/...`);
  }
  return value;
}

/** @returns {import('./posts').Post[]} */
function readContentPosts(includeDrafts = false) {
  const posts = [], owners = new Map();
  const removed = new Set(JSON.parse(fs.readFileSync(path.join(root, 'content', 'removed-posts.json'), 'utf8')).map(r => r.slug));
  for (const category of categories) {
    const directory = path.join(root, 'content', category);
    if (!fs.existsSync(directory)) continue;
    for (const filename of fs.readdirSync(directory).filter(f => /\.(md|mdx)$/.test(f))) {
      const file = `content/${category}/${filename}`;
      const slug = filename.replace(/\.(md|mdx)$/, '');
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(file, 'filename must be a lowercase hyphenated slug');
      if (removed.has(slug)) fail(file, 'slug is retired; restore only through an explicitly reviewed reversal');
      if (owners.has(slug)) fail(file, `duplicate slug also found in ${owners.get(slug)}`);
      owners.set(slug, file);
      const { data, content } = matter(fs.readFileSync(path.join(root, file), 'utf8'));
      if (data.slug !== undefined && data.slug !== slug) fail(file, 'frontmatter slug differs from filename; URLs must not change silently');
      if (data.category !== undefined && data.category !== category) fail(file, 'category must match collection directory');
      const status = data.status ?? 'published'; // Preserve legacy entries predating the status field.
      if (!['draft', 'published'].includes(status)) fail(file, 'status must be draft or published');
      const author = data.author;
      if (!author || typeof author !== 'object') fail(file, 'author object is required');
      text(author.name, file, 'author.name'); text(author.role, file, 'author.role'); media(author.avatar, file, 'author.avatar');
      if (!content.trim()) fail(file, 'article body is empty');
      const post = {
        slug, title: text(data.title, file, 'title'), description: text(data.description, file, 'description'), category,
        subcategory: data.subcategory || 'General', author,
        publishedAt: date(alias(data, 'publishedAt', 'datePublished', file), file, 'publishedAt/datePublished'),
        updatedAt: date(alias(data, 'updatedAt', 'dateModified', file), file, 'updatedAt/dateModified', true),
        image: media(alias(data, 'image', 'featuredImage', file), file, 'image/featuredImage'),
        imageAlt: text(data.imageAlt, file, 'imageAlt'), featured: Boolean(data.featured), editorsPick: Boolean(data.editorsPick), status,
        readingTime: data.readingTime || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
        tags: list(data.tags, file, 'tags'), seoTitle: data.seoTitle || undefined, metaDescription: data.metaDescription || undefined,
        primaryKeyword: data.primaryKeyword || undefined, secondaryKeywords: list(data.secondaryKeywords, file, 'secondaryKeywords'),
        relatedPosts: list(data.relatedPosts, file, 'relatedPosts'), noindex: Boolean(data.noindex), content,
      };
      posts.push(post);
    }
  }
  for (const post of posts) for (const slug of post.relatedPosts) {
    const target = posts.find(p => p.slug === slug);
    if (!target || slug === post.slug || (post.status === 'published' && target.status !== 'published')) fail(post.slug, `invalid relatedPosts target: ${slug}`);
  }
  return posts.filter(p => includeDrafts || p.status === 'published').sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}
module.exports = { readContentPosts, slugify };
