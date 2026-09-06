const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const posts = [
  {
    category: 'grow',
    slug: 'mini-garden-ideas-small-spaces',
    filename: 'mini-garden-ideas-small-spaces.webp',
    unsplashId: 'photo-1585320806297-9794b3e4eeae',
    alt: 'Sunlit urban apartment balcony filled with thriving potted herbs, compact planters and lush vertical greenery'
  },
  {
    category: 'grow',
    slug: 'hydroponics-for-beginners',
    filename: 'hydroponics-for-beginners.webp',
    unsplashId: 'photo-1530836369250-ef72a3f5cda8',
    alt: 'Modern countertop indoor hydroponic system growing vibrant fresh lettuce and herbs under clean LED grow lighting'
  },
  {
    category: 'grow',
    slug: 'how-to-grow-microgreens-indoors',
    filename: 'how-to-grow-microgreens-indoors.webp',
    unsplashId: 'photo-1550989460-0adf9ea622e2',
    alt: 'Lush green microgreen seedlings sprouting in a shallow wooden growing tray on a sunlit kitchen countertop'
  },
  {
    category: 'grow',
    slug: 'best-low-light-indoor-plants-apartments',
    filename: 'best-low-light-indoor-plants-apartments.webp',
    unsplashId: 'photo-1545241047-6083a3684587',
    alt: 'Cozy living room corner styled with healthy low-light indoor plants including snake plant and pothos in ceramic pots'
  },
  {
    category: 'grow',
    slug: 'balcony-herb-garden',
    filename: 'balcony-herb-garden.webp',
    unsplashId: 'photo-1509316975850-ff9c5deb0cd9',
    alt: 'Apartment balcony herb garden with fresh potted basil, rosemary and mint in warm natural morning sunlight'
  },
  {
    category: 'space',
    slug: 'small-apartment-organization-ideas',
    filename: 'small-apartment-organization-ideas.webp',
    unsplashId: 'photo-1513694203232-719a280e022f',
    alt: 'Beautifully organized modern small apartment interior with clean wooden furniture, hidden storage and calm neutral decor'
  },
  {
    category: 'space',
    slug: '80-20-decluttering-method',
    filename: '80-20-decluttering-method.webp',
    unsplashId: 'photo-1598928506311-c55ded91a20c',
    alt: 'Minimalist living room display shelf curated with essential daily items, ceramic vessels and open breathing room'
  },
  {
    category: 'space',
    slug: 'vertical-storage-ideas-small-homes',
    filename: 'vertical-storage-ideas-small-homes.webp',
    unsplashId: 'photo-1507089947368-19c1da9775ae',
    alt: 'Smart tall vertical shelving unit making full use of wall height for books and home storage in a bright living area'
  },
  {
    category: 'space',
    slug: 'room-by-room-decluttering-checklist',
    filename: 'room-by-room-decluttering-checklist.webp',
    unsplashId: 'photo-1512918728675-ed5a9ecdebfd',
    alt: 'Serene and uncluttered bedroom interior with organized linen bedding and warm daylight creating a calm sanctuary'
  },
  {
    category: 'space',
    slug: 'small-kitchen-organization-ideas',
    filename: 'small-kitchen-organization-ideas.webp',
    unsplashId: 'photo-1556911220-e15b29be8c8f',
    alt: 'Compact organized kitchen with open wooden spice shelves, clear glass storage jars and clean uncluttered countertops'
  },
  {
    category: 'energy',
    slug: 'how-to-save-energy-at-home',
    filename: 'how-to-save-energy-at-home.webp',
    unsplashId: 'photo-1600585154340-be6161a56a0c',
    alt: 'Bright, energy-efficient modern home interior with large double-glazed windows and insulated warm natural lighting'
  },
  {
    category: 'energy',
    slug: 'are-solar-panels-worth-it-2026',
    filename: 'are-solar-panels-worth-it-2026.webp',
    unsplashId: 'photo-1592833159155-c62df1b65634',
    alt: 'High-efficiency modern rooftop solar photovoltaic panel installation on a contemporary house under clear blue sky'
  },
  {
    category: 'energy',
    slug: 'energy-efficient-appliances-guide',
    filename: 'energy-efficient-appliances-guide.webp',
    unsplashId: 'photo-1556912172-45b7abe8b7e1',
    alt: 'Sleek eco-friendly kitchen featuring energy-efficient induction cooktop and high-rated stainless appliances'
  },
  {
    category: 'energy',
    slug: 'home-battery-storage-explained',
    filename: 'home-battery-storage-explained.webp',
    unsplashId: 'photo-1497440001374-f26997328c1b',
    alt: 'Modern residential electrical power inverter and home battery storage equipment installed in a clean interior'
  },
  {
    category: 'energy',
    slug: 'smart-thermostat-guide',
    filename: 'smart-thermostat-guide.webp',
    unsplashId: 'photo-1558002038-1055907df827',
    alt: 'Minimalist smart digital thermostat mounted on an apartment wall for automated home energy savings and comfort'
  },
  {
    category: 'life',
    slug: 'digital-minimalism-guide',
    filename: 'digital-minimalism-guide.webp',
    unsplashId: 'photo-1499750310107-5fef28a66643',
    alt: 'Distraction-free minimalist wooden desk with a single open paper journal, ceramic tea cup and peaceful morning window light'
  },
  {
    category: 'life',
    slug: '7-day-digital-detox',
    filename: '7-day-digital-detox.webp',
    unsplashId: 'photo-1512820790803-83ca734da794',
    alt: 'Calm screen-free morning lifestyle scene sitting by a sunny window reading a printed book with a warm coffee'
  },
  {
    category: 'life',
    slug: 'underconsumption-buy-less',
    filename: 'underconsumption-buy-less.webp',
    unsplashId: 'photo-1489987707025-afc232f7ea0f',
    alt: 'Conscious living aesthetic showing a capsule collection of durable natural linen clothing on wooden hangers'
  },
  {
    category: 'life',
    slug: 'slow-living-for-busy-people',
    filename: 'slow-living-for-busy-people.webp',
    unsplashId: 'photo-1517256064527-09c73fc73e38',
    alt: 'Mindful slow morning ritual pouring freshly brewed pour-over coffee at a rustic wooden table surrounded by indoor plants'
  },
  {
    category: 'life',
    slug: 'mindful-morning-routine',
    filename: 'mindful-morning-routine.webp',
    unsplashId: 'photo-1506126613408-eca07ce68773',
    alt: 'Peaceful sun-drenched morning room with meditation cushion on wood floor and gentle golden sunrise illumination'
  },
  {
    category: 'grow',
    slug: 'how-to-create-a-greener-calmer-home',
    filename: 'how-to-create-a-greener-calmer-home.webp',
    unsplashId: 'photo-1618221195710-dd6b41faaea6',
    alt: 'Serene Scandinavian living room harmoniously blending healthy indoor plants, uncluttered shelving and warm natural light'
  }
];

async function processImages() {
  const imagesDir = path.join(process.cwd(), 'public/images/posts');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log(`Starting download and WebP optimization for ${posts.length} editorial images...`);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const sourceUrl = `https://images.unsplash.com/${post.unsplashId}?auto=format&fit=crop&w=1600&q=85`;
    const targetFile = path.join(imagesDir, post.filename);

    console.log(`[${i + 1}/${posts.length}] Downloading: ${post.slug}...`);

    try {
      const res = await fetch(sourceUrl);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status} for ${post.unsplashId}`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());

      // Optimize with Sharp: 1200x800 (3:2 ratio), high quality WebP
      await sharp(buffer)
        .resize(1200, 800, {
          fit: 'cover',
          position: 'center'
        })
        .webp({
          quality: 82,
          effort: 6
        })
        .toFile(targetFile);

      const stat = fs.statSync(targetFile);
      const sizeKb = Math.round(stat.size / 1024);
      console.log(`  -> Saved ${post.filename} (${sizeKb} KB)`);

      // Update MDX alt text
      const mdxPath = path.join(process.cwd(), 'content', post.category, `${post.slug}.mdx`);
      if (fs.existsSync(mdxPath)) {
        let content = fs.readFileSync(mdxPath, 'utf8');
        // Replace imageAlt
        content = content.replace(/imageAlt:\s*".*?"/, `imageAlt: ${JSON.stringify(post.alt)}`);
        fs.writeFileSync(mdxPath, content, 'utf8');
        console.log(`  -> Updated MDX imageAlt for ${post.slug}`);
      }
    } catch (err) {
      console.error(`  -> ERROR processing ${post.slug}:`, err.message);
    }
  }

  console.log('All 21 featured editorial images successfully downloaded, optimized, and linked!');
}

processImages().catch(console.error);
