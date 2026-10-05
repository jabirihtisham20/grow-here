const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const root = process.cwd();
const contentRoot = path.join(root, 'content');
const categories = ['grow', 'space', 'energy', 'life'];
const applying = process.argv.includes('--apply');

function toDate(value, fallback) {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date in MDX frontmatter: ${String(value)}`);
  return date.toISOString();
}

function readPosts() {
  const rows = [];
  const seenSlugs = new Set();

  for (const category of categories) {
    const directory = path.join(contentRoot, category);
    if (!fs.existsSync(directory)) continue;

    for (const filename of fs.readdirSync(directory).filter((file) => /\.(md|mdx)$/.test(file))) {
      const sourcePath = path.join(directory, filename);
      const relativePath = path.relative(root, sourcePath).replaceAll(path.sep, '/');
      const parsed = matter(fs.readFileSync(sourcePath, 'utf8'));
      const data = parsed.data;
      const slug = filename.replace(/\.(md|mdx)$/, '');
      if (seenSlugs.has(slug)) throw new Error(`Duplicate slug "${slug}" found while reading ${relativePath}`);
      seenSlugs.add(slug);
      if (typeof data.title !== 'string' || !data.title.trim()) throw new Error(`Missing title in ${relativePath}`);
      if (typeof data.description !== 'string' || !data.description.trim()) throw new Error(`Missing description in ${relativePath}`);
      if (data.status != null && !['draft', 'published'].includes(data.status)) throw new Error(`Unsupported publication status in ${relativePath}`);
      if (!data.publishedAt) throw new Error(`Missing publishedAt in ${relativePath}`);

      const image = typeof data.image === 'string' ? data.image : '';
      if (image.startsWith('/')) {
        const imagePath = path.join(root, 'public', image.replace(/^\/+/, ''));
        if (!fs.existsSync(imagePath)) throw new Error(`Image not found for ${relativePath}: ${image}`);
      }

      rows.push({
        title: data.title.trim(),
        slug,
        excerpt: data.description.trim(),
        content: parsed.content,
        image,
        imageAlt: typeof data.imageAlt === 'string' ? data.imageAlt : '',
        author: JSON.stringify(data.author || {}),
        category,
        subcategory: typeof data.subcategory === 'string' ? data.subcategory : '',
        featured: Boolean(data.featured),
        editorsPick: Boolean(data.editorsPick),
        readingTime: typeof data.readingTime === 'string' ? data.readingTime : '5 min read',
        primaryKeyword: typeof data.primaryKeyword === 'string' ? data.primaryKeyword : null,
        secondaryKeywords: JSON.stringify(Array.isArray(data.secondaryKeywords) ? data.secondaryKeywords : []),
        noindex: Boolean(data.noindex),
        status: data.status === 'draft' ? 'DRAFT' : 'PUBLISHED',
        seoTitle: data.seoTitle || null,
        seoDescription: data.metaDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        publishedAt: toDate(data.publishedAt, new Date().toISOString()),
        updatedAt: data.updatedAt ? toDate(data.updatedAt, null) : null,
        sourcePath: relativePath,
        tags: Array.isArray(data.tags) ? data.tags.filter((tag) => typeof tag === 'string') : [],
      });
    }
  }

  return rows;
}

function readMediaFiles(directory = path.join(root, 'public', 'images')) {
  const files = [];
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...readMediaFiles(absolute));
      continue;
    }
    if (!entry.isFile() || !/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(entry.name)) continue;
    const key = path.relative(path.join(root, 'public'), absolute).replaceAll(path.sep, '/');
    const mime = ({ avif:'image/avif',gif:'image/gif',jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',svg:'image/svg+xml',webp:'image/webp' })[path.extname(entry.name).slice(1).toLowerCase()];
    files.push({ key, url: `/${key}`, filename: entry.name, mime, size: fs.statSync(absolute).size });
  }
  return files;
}

async function main() {
  const rows = readPosts();
  const mediaFiles = readMediaFiles();
  console.log(`Validated ${rows.length} MDX entries and their local featured images.`);
  console.log(`Found ${mediaFiles.length} existing image files under public/images for metadata import.`);
  console.log('Import mode: ' + (applying ? 'APPLY (transactional upsert; no deletes)' : 'DRY RUN (no database writes)'));
  if (!applying) {
    console.log('Review the count and image checks, then rerun with --apply after taking a database backup.');
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required for --apply. No source files will be changed.');
  const { Pool } = require('pg');
  const pool = new Pool({ connectionString, max: 1, connectionTimeoutMillis: 5000 });
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const row of rows) {
        const categoryResult = await client.query(
          'SELECT id FROM cms_categories WHERE slug = $1',
          [row.category]
        );
        if (!categoryResult.rowCount) throw new Error(`Category is missing from CMS database: ${row.category}. Run db:migrate first.`);

        const postResult = await client.query(
          `INSERT INTO cms_posts
            (title, slug, excerpt, content, featured_image, image_alt, author_snapshot, category_id,
             legacy_category, subcategory, is_featured, editors_pick, reading_time, primary_keyword,
             secondary_keywords, noindex, legacy_source_path, status, seo_title, seo_description,
             canonical_url, published_at, created_at, updated_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16,$17,$18,$19,$20,$21,$22,now(),COALESCE($23::timestamptz,now()))
           ON CONFLICT (slug) DO UPDATE SET
             title = EXCLUDED.title,
             excerpt = EXCLUDED.excerpt,
             content = EXCLUDED.content,
             featured_image = EXCLUDED.featured_image,
             image_alt = EXCLUDED.image_alt,
             author_snapshot = EXCLUDED.author_snapshot,
             category_id = EXCLUDED.category_id,
             legacy_category = EXCLUDED.legacy_category,
             subcategory = EXCLUDED.subcategory,
             is_featured = EXCLUDED.is_featured,
             editors_pick = EXCLUDED.editors_pick,
             reading_time = EXCLUDED.reading_time,
             primary_keyword = EXCLUDED.primary_keyword,
             secondary_keywords = EXCLUDED.secondary_keywords,
             noindex = EXCLUDED.noindex,
             legacy_source_path = EXCLUDED.legacy_source_path,
             status = EXCLUDED.status,
             seo_title = EXCLUDED.seo_title,
             seo_description = EXCLUDED.seo_description,
             canonical_url = EXCLUDED.canonical_url,
             published_at = EXCLUDED.published_at,
             updated_at = COALESCE(EXCLUDED.updated_at, now())
           WHERE cms_posts.legacy_source_path = EXCLUDED.legacy_source_path
           RETURNING id`,
          [row.title,row.slug,row.excerpt,row.content,row.image,row.imageAlt,row.author,categoryResult.rows[0].id,row.category,row.subcategory,row.featured,row.editorsPick,row.readingTime,row.primaryKeyword,row.secondaryKeywords,row.noindex,row.sourcePath,row.status,row.seoTitle,row.seoDescription,row.canonicalUrl,row.publishedAt,row.updatedAt]
        );
        if (!postResult.rowCount) throw new Error(`Slug collision for "${row.slug}" with a record that did not originate from ${row.sourcePath}; no rows have been committed.`);

        for (const name of row.tags) {
          const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          if (!slug) continue;
          const tag = await client.query(
            'INSERT INTO cms_tags (name, slug) VALUES ($1,$2) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id',
            [name.trim(), slug]
          );
          await client.query('INSERT INTO cms_post_tags (post_id, tag_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [postResult.rows[0].id, tag.rows[0].id]);
        }
      }
      for (const file of mediaFiles) {
        await client.query(
          `INSERT INTO cms_media (storage_key,public_url,filename,mime_type,size_bytes,alt_text)
           VALUES ($1,$2,$3,$4,$5,'')
           ON CONFLICT (storage_key) DO UPDATE SET public_url=EXCLUDED.public_url,
             filename=EXCLUDED.filename,mime_type=EXCLUDED.mime_type,size_bytes=EXCLUDED.size_bytes`,
          [file.key,file.url,file.filename,file.mime,file.size]
        );
      }
      await client.query('COMMIT');
      console.log(`Imported ${rows.length} entries and ${mediaFiles.length} image records. No MDX files or images were deleted or moved.`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(`MDX import failed: ${error instanceof Error ? error.message : 'Unknown import error'}`);
  process.exitCode = 1;
});
