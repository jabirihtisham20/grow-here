const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const posts = [
  {
    filename: 'mini-garden-ideas-small-spaces.webp',
    pillar: 'GROW',
    title: 'Mini Garden Ideas for Small Spaces',
    subtitle: '12 Easy Ways to Grow More',
    icon: '🌱',
    c1: '#0d2818',
    c2: '#1b4332',
    accent: '#79A96B',
  },
  {
    filename: 'hydroponics-for-beginners.webp',
    pillar: 'GROW',
    title: 'Hydroponics for Beginners',
    subtitle: 'How to Start an Indoor Hydroponic Garden',
    icon: '💧',
    c1: '#072a24',
    c2: '#134e4a',
    accent: '#40A37A',
  },
  {
    filename: 'how-to-grow-microgreens-indoors.webp',
    pillar: 'GROW',
    title: 'How to Grow Microgreens Indoors',
    subtitle: 'A Simple Beginner Guide',
    icon: '🥗',
    c1: '#142812',
    c2: '#283618',
    accent: '#99d98c',
  },
  {
    filename: 'best-low-light-indoor-plants-apartments.webp',
    pillar: 'GROW',
    title: 'Best Low-Light Indoor Plants',
    subtitle: '9 Easy Choices for Dim Apartments',
    icon: '🪴',
    c1: '#0a1d12',
    c2: '#1b3a24',
    accent: '#74c69d',
  },
  {
    filename: 'balcony-herb-garden.webp',
    pillar: 'GROW',
    title: 'Balcony Herb Garden',
    subtitle: '10 Easy Herbs to Grow in Pots',
    icon: '🌿',
    c1: '#0e2316',
    c2: '#214d2e',
    accent: '#a7c957',
  },
  {
    filename: 'small-apartment-organization-ideas.webp',
    pillar: 'SPACE',
    title: 'Small Apartment Organization Ideas',
    subtitle: 'Systems That Actually Work',
    icon: '🏠',
    c1: '#0c1821',
    c2: '#1b2a4a',
    accent: '#40A37A',
  },
  {
    filename: '80-20-decluttering-method.webp',
    pillar: 'SPACE',
    title: 'The 80/20 Decluttering Method',
    subtitle: 'A Simple Way to Keep Storage Under Control',
    icon: '📦',
    c1: '#111d28',
    c2: '#1e324a',
    accent: '#64b5f6',
  },
  {
    filename: 'vertical-storage-ideas-small-homes.webp',
    pillar: 'SPACE',
    title: 'Vertical Storage Ideas for Small Homes',
    subtitle: '15 Ways to Use Your Walls',
    icon: '🪜',
    c1: '#10222a',
    c2: '#1e3c4d',
    accent: '#80cbc4',
  },
  {
    filename: 'room-by-room-decluttering-checklist.webp',
    pillar: 'SPACE',
    title: 'Room-by-Room Decluttering Checklist',
    subtitle: 'A Realistic Weekend Plan',
    icon: '📋',
    c1: '#0e1f2b',
    c2: '#203a43',
    accent: '#4dd0e1',
  },
  {
    filename: 'small-kitchen-organization-ideas.webp',
    pillar: 'SPACE',
    title: 'Small Kitchen Organization Ideas',
    subtitle: '14 Ways to Create More Usable Space',
    icon: '🍳',
    c1: '#122324',
    c2: '#264653',
    accent: '#2a9d8f',
  },
  {
    filename: 'how-to-save-energy-at-home.webp',
    pillar: 'ENERGY',
    title: 'How to Save Energy at Home',
    subtitle: '20 Practical Ways to Cut Waste',
    icon: '⚡',
    c1: '#1c1a0c',
    c2: '#3d3408',
    accent: '#E8C75A',
  },
  {
    filename: 'are-solar-panels-worth-it-2026.webp',
    pillar: 'ENERGY',
    title: 'Are Solar Panels Worth It in 2026?',
    subtitle: 'A Simple Homeowner Guide',
    icon: '☀️',
    c1: '#211807',
    c2: '#4a3810',
    accent: '#f39c12',
  },
  {
    filename: 'energy-efficient-appliances-guide.webp',
    pillar: 'ENERGY',
    title: 'Energy-Efficient Appliances',
    subtitle: 'What to Look For Before You Buy',
    icon: '🏷️',
    c1: '#1a1d20',
    c2: '#2c3e50',
    accent: '#f1c40f',
  },
  {
    filename: 'home-battery-storage-explained.webp',
    pillar: 'ENERGY',
    title: 'Home Battery Storage Explained',
    subtitle: 'Is a Battery Worth It Without Solar?',
    icon: '🔋',
    c1: '#1a180f',
    c2: '#3e3612',
    accent: '#e67e22',
  },
  {
    filename: 'smart-thermostat-guide.webp',
    pillar: 'ENERGY',
    title: 'Smart Thermostat Guide',
    subtitle: 'Save Energy Without Sacrificing Comfort',
    icon: '🌡️',
    c1: '#161d24',
    c2: '#283747',
    accent: '#e67e22',
  },
  {
    filename: 'digital-minimalism-guide.webp',
    pillar: 'LIFE',
    title: 'Digital Minimalism',
    subtitle: 'A Practical Guide to Reclaim Your Attention',
    icon: '📵',
    c1: '#141419',
    c2: '#20242c',
    accent: '#A7C99B',
  },
  {
    filename: '7-day-digital-detox.webp',
    pillar: 'LIFE',
    title: '7-Day Digital Detox',
    subtitle: 'A Realistic Plan to Reduce Screen Time',
    icon: '⏳',
    c1: '#17151f',
    c2: '#2c253d',
    accent: '#c084fc',
  },
  {
    filename: 'underconsumption-buy-less.webp',
    pillar: 'LIFE',
    title: 'Underconsumption: How to Buy Less',
    subtitle: 'Without Feeling Deprived',
    icon: '☕',
    c1: '#1a1a1c',
    c2: '#2d2e33',
    accent: '#94a3b8',
  },
  {
    filename: 'slow-living-for-busy-people.webp',
    pillar: 'LIFE',
    title: 'Slow Living for Busy People',
    subtitle: '10 Small Changes That Make Life Less Rushed',
    icon: '🍵',
    c1: '#131e1c',
    c2: '#223832',
    accent: '#86efac',
  },
  {
    filename: 'mindful-morning-routine.webp',
    pillar: 'LIFE',
    title: 'Mindful Morning Routine',
    subtitle: 'A Simple 30-Minute Start to the Day',
    icon: '🌅',
    c1: '#181b24',
    c2: '#2e3a4e',
    accent: '#fde047',
  },
  {
    filename: 'how-to-create-a-greener-calmer-home.webp',
    pillar: 'FEATURED',
    title: 'How to Create a Greener, Calmer Home',
    subtitle: 'Without Doing Everything at Once',
    icon: '🌿',
    c1: '#091f14',
    c2: '#18422d',
    accent: '#E8C75A',
  },
];

async function generateAll() {
  const outputDir = path.join(process.cwd(), 'public/images/posts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const post of posts) {
    const svg = `
    <svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-${post.filename}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${post.c1}" />
          <stop offset="100%" stop-color="${post.c2}" />
        </linearGradient>
        <radialGradient id="glow-${post.filename}" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stop-color="${post.accent}" stop-opacity="0.25" />
          <stop offset="100%" stop-color="${post.accent}" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Background Canvas -->
      <rect width="100%" height="100%" fill="url(#bg-${post.filename})" />
      <rect width="100%" height="100%" fill="url(#glow-${post.filename})" />

      <!-- Delicate Architectural Frame -->
      <rect x="40" y="40" width="1120" height="720" rx="24" fill="none" stroke="${post.accent}" stroke-opacity="0.3" stroke-width="1.5" />
      <rect x="52" y="52" width="1096" height="696" rx="18" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1" />

      <!-- Corner Accents -->
      <circle cx="70" cy="70" r="4" fill="${post.accent}" opacity="0.6" />
      <circle cx="1130" cy="70" r="4" fill="${post.accent}" opacity="0.6" />
      <circle cx="70" cy="730" r="4" fill="${post.accent}" opacity="0.6" />
      <circle cx="1130" cy="730" r="4" fill="${post.accent}" opacity="0.6" />

      <!-- Botanical / Themed Watermark Background Rings -->
      <circle cx="600" cy="380" r="240" fill="none" stroke="${post.accent}" stroke-opacity="0.08" stroke-width="60" />
      <circle cx="600" cy="380" r="160" fill="none" stroke="${post.accent}" stroke-opacity="0.12" stroke-width="2" />

      <!-- Category Pill Badge -->
      <g transform="translate(600, 220)">
        <rect x="-90" y="-18" width="180" height="36" rx="18" fill="#000000" fill-opacity="0.4" stroke="${post.accent}" stroke-opacity="0.5" stroke-width="1.5" />
        <text x="0" y="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" letter-spacing="3" fill="${post.accent}" text-anchor="middle">
          ${post.pillar}
        </text>
      </g>

      <!-- Center Icon -->
      <text x="600" y="340" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif" font-size="64" text-anchor="middle">
        ${post.icon}
      </text>

      <!-- Editorial Title -->
      <text x="600" y="440" font-family="Georgia, 'Times New Roman', serif" font-size="44" font-weight="400" fill="#f8fafc" text-anchor="middle" letter-spacing="-0.5">
        ${post.title}
      </text>

      <!-- Subtitle -->
      <text x="600" y="495" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="300" fill="#cbd5e1" text-anchor="middle">
        ${post.subtitle}
      </text>

      <!-- Brand Signature -->
      <g transform="translate(600, 670)">
        <line x1="-60" y1="0" x2="60" y2="0" stroke="${post.accent}" stroke-opacity="0.3" stroke-width="1" />
        <text x="0" y="24" font-family="Georgia, serif" font-size="14" letter-spacing="4" fill="#94a3b8" text-anchor="middle">
          GROW HERE &#8226; EDITORIAL
        </text>
      </g>
    </svg>
    `;

    const destPath = path.join(outputDir, post.filename);
    await sharp(Buffer.from(svg))
      .webp({ quality: 90 })
      .toFile(destPath);
    console.log(`Created ${post.filename}`);
  }
  console.log('All 21 WebP hero images generated successfully!');
}

generateAll().catch(console.error);
