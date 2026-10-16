const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const { readContentPosts } = require('../lib/blog-content');
const manifest = require('../reports/image-refresh/generated-sources.json');
const descriptions = [
 'Hand checking compost moisture in a terracotta herb pot on a sunny balcony',
 'Potted herbs sheltered by a woven willow screen on a British balcony',
 'Purple asters, pink sedum and dahlias in terracotta pots with visiting bumblebees',
 'Closed worm compost bin with an insulating wrap beside a sheltered balcony wall',
 'Strawberry plants in terracotta pots raised beside a sheltered brick wall in winter',
 'Condensation droplets along the inside edge of a window overlooking a winter garden',
 'Laundry spaced on an airer with a dehumidifier nearby in a bright small flat',
 'Covered cooked leftovers on fridge shelves above separately stored raw meat',
 'Closed freezer beside a notebook and digital thermometer in a utility room',
 'Open under-sink cupboard showing plumbing, accessible valve, torch and dry cloth',
 'Plug-in energy monitor with an appliance connected at a UK wall socket',
 'Interior letterbox with draught-excluding bristles on a sage green front door',
 'Front-loading washing machine beside a notebook and calculator in a utility room',
 'Portable dehumidifier with clear space around it beside a table with a cost notebook',
 'In-home energy display beside an electricity bill and pencil on a kitchen table',
 'Phone resting face down in a wooden tray beside an open book in a calm home',
 'Person reviewing an email inbox on a laptop at a naturally lit home desk',
 'Two volunteers inspecting a table lamp at a community repair event',
 'Cordless drill, carry case and canvas bag on a community tool lending counter',
 'Laptop photo library with a separate backup drive connected on a wooden desk',
];
async function main() {
 const posts = readContentPosts();
 const backup = 'data/migration-backups/image-refresh-2026-10-17';
 fs.mkdirSync(backup, { recursive: true });
 const results = [];
 for (const [index, entry] of manifest.images.entries()) {
  const post = posts.find(p => p.slug === entry.slug);
  if (!post) throw Error('Missing post: ' + entry.slug);
  const article = path.join('content', post.category, entry.slug + '.mdx');
  const target = path.join('public', post.image);
  for (const file of [article, target]) {
   const copy = path.join(backup, file);
   fs.mkdirSync(path.dirname(copy), { recursive: true });
   if (!fs.existsSync(copy)) fs.copyFileSync(file, copy);
  }
  const before = fs.readFileSync(article, 'utf8');
  const image = await sharp(entry.source).resize(1600, 900, { fit: 'cover', position: 'centre' }).webp({ quality: 84, effort: 6 }).toBuffer();
  fs.writeFileSync(target, image);
  const after = before.replace(/^imageAlt:.*$/m, 'imageAlt: ' + JSON.stringify(descriptions[index]));
  if (before === after) throw Error('Alt text not updated: ' + article);
  fs.writeFileSync(article, after);
  const metadata = await sharp(image).metadata();
  if (metadata.width !== 1600 || metadata.height !== 900) throw Error('Incorrect dimensions');
  results.push({ slug: entry.slug, image: post.image, imageAlt: descriptions[index], width: metadata.width, height: metadata.height, bytes: image.length, sha256: crypto.createHash('sha256').update(image).digest('hex') });
 }
 fs.writeFileSync('reports/image-refresh/assets.json', JSON.stringify({ date: manifest.date, method: manifest.method, backup, images: results }, null, 2));
 console.log('Installed ' + results.length + ' realistic 1600x900 WebP images; previous images and metadata backed up.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
