const fs = require('fs');
const path = require('path');

const dumpPath = path.join(__dirname, '../scratch_content_dump.txt');
const content = fs.readFileSync(dumpPath, 'utf8');

const deskRoles = {
  grow: 'Horticulture & Living Desk',
  space: 'Home & Spaces Desk',
  energy: 'Energy & Efficiency Desk',
  life: 'Mindful Living Desk'
};

const subcategories = {
  1: 'Mini Gardens',
  2: 'Hydroponics',
  3: 'Microgreens',
  4: 'Indoor Plants',
  5: 'Balcony Gardening',
  6: 'Apartment Living',
  7: 'Decluttering Methods',
  8: 'Vertical Storage',
  9: 'Checklists',
  10: 'Kitchen Organization',
  11: 'Energy Saving',
  12: 'Solar Energy',
  13: 'Home Appliances',
  14: 'Battery Storage',
  15: 'Smart Home',
  16: 'Digital Minimalism',
  17: 'Digital Detox',
  18: 'Conscious Living',
  19: 'Slow Living',
  20: 'Mindful Routines'
};

const tipsMap = {
  2: {
    title: 'Beginner Hydroponics Tip',
    text: 'Start with simple leafy greens like butterhead lettuce or sweet basil before moving to fruiting crops like tomatoes, which require significantly higher light intensity and nutrient management.'
  },
  3: {
    title: 'Sanitation & Airflow',
    text: 'Microgreens need adequate air circulation and clean trays to prevent damping off and mold. Never let trays sit in stagnant water after the initial blackout germination phase.'
  },
  4: {
    title: 'The Golden Rule of Low Light',
    text: 'In low-light spaces, plants use water much more slowly. Always check that the top two inches of potting mix are dry before watering to avoid root rot.'
  },
  5: {
    title: 'Drainage & Pot Sizing',
    text: 'Terra cotta or breathable fabric containers dry faster than plastic, making them ideal for Mediterranean herbs like rosemary and thyme that dislike soggy roots.'
  },
  6: {
    title: 'The 1-In, 1-Out System',
    text: 'To keep small spaces feeling uncluttered, adopt a one-in, one-out rule for non-consumable items like clothing, decor, and kitchen utensils.'
  },
  7: {
    title: 'Focus on High-Impact 20%',
    text: 'Identify the 20% of belongings you use 80% of the time, and keep those accessible. The remaining items can be systematically evaluated or relocated to deeper storage.'
  },
  8: {
    title: 'Weight Safety First',
    text: 'Always anchor heavy wall-mounted shelving or tall book units into wall studs or use rated drywall anchors, especially when storing books or ceramic cookware.'
  },
  9: {
    title: 'One Room at a Time',
    text: 'Avoid tearing apart multiple rooms simultaneously. Completing one focused zone creates momentum and provides an immediate sanctuary space.'
  },
  10: {
    title: 'Clear Countertop Policy',
    text: 'Only appliances used daily (such as the kettle or toaster) should earn valuable countertop real estate. Store secondary appliances in lower cabinets.'
  },
  11: {
    title: 'Vampire Draw Awareness',
    text: 'Standby power from chargers, televisions, and game consoles can account for up to 10% of an electricity bill. Use switched smart strips to cut phantom power easily.'
  },
  12: {
    title: 'Shading & Orientation Check',
    text: 'Before getting solar quotes, inspect your roof for tree shading between 10 AM and 3 PM. Even partial shading on older string-inverter setups can reduce system efficiency.'
  },
  13: {
    title: 'Lifecycle Cost vs Sticker Price',
    text: 'An appliance that costs 15% more upfront but has a superior energy rating often saves several times that price difference over a 10-year lifespan.'
  },
  14: {
    title: 'Time-of-Use Arbitrage',
    text: 'A home battery can be charged during cheap off-peak night hours and discharged during peak evening pricing, delivering significant savings even without rooftop solar.'
  },
  15: {
    title: 'Gradual Adjustments',
    text: 'Program temperature changes in small 1-degree increments so your HVAC runs efficiently and your home remains consistently comfortable without dramatic spikes.'
  },
  16: {
    title: 'App Friction Technique',
    text: 'Remove social media and news apps from your primary home screen. Requiring a browser login or searching via app library adds just enough friction to curb impulse scrolling.'
  },
  17: {
    title: 'Physical Alarm Clock',
    text: 'Replace your phone alarm with a standalone bedside clock. Keeping your smartphone outside the bedroom prevents morning and late-night scrolling cycles.'
  },
  18: {
    title: 'The 72-Hour Rule',
    text: 'When tempted to make an impulse online purchase, add it to a wishlist and wait 72 hours. In over 70% of cases, the emotional urge to buy subsides completely.'
  },
  19: {
    title: 'Single-Tasking Ritual',
    text: 'Choose one everyday task—such as drinking tea or folding laundry—and perform it with zero multitasking: no podcasts, no screens, just quiet presence.'
  },
  20: {
    title: 'Protect Your First Hour',
    text: 'Reserve your first 30–60 minutes awake for hydration, light, and quiet reflection before allowing emails and news headlines into your mental space.'
  }
};

const internalUrlMap = {
  'mini garden ideas for small spaces': '/grow/mini-garden-ideas-small-spaces',
  'hydroponics for beginners': '/grow/hydroponics-for-beginners',
  'how to grow microgreens indoors': '/grow/how-to-grow-microgreens-indoors',
  'best low-light indoor plants for apartments': '/grow/best-low-light-indoor-plants-apartments',
  'balcony herb garden': '/grow/balcony-herb-garden',
  'small apartment organization ideas': '/space/small-apartment-organization-ideas',
  'small apartment organization ideas that actually work': '/space/small-apartment-organization-ideas',
  'the 80/20 decluttering method': '/space/80-20-decluttering-method',
  '80/20 decluttering method': '/space/80-20-decluttering-method',
  'vertical storage ideas for small homes': '/space/vertical-storage-ideas-small-homes',
  'room-by-room decluttering checklist': '/space/room-by-room-decluttering-checklist',
  'small kitchen organization ideas': '/space/small-kitchen-organization-ideas',
  'how to save energy at home': '/energy/how-to-save-energy-at-home',
  'are solar panels worth it in 2026': '/energy/are-solar-panels-worth-it-2026',
  'are solar panels worth it': '/energy/are-solar-panels-worth-it-2026',
  'energy-efficient appliances': '/energy/energy-efficient-appliances-guide',
  'energy-efficient appliances: what to look for before you buy': '/energy/energy-efficient-appliances-guide',
  'home battery storage explained': '/energy/home-battery-storage-explained',
  'home battery storage explained: is a battery worth it without solar': '/energy/home-battery-storage-explained',
  'smart thermostat guide': '/energy/smart-thermostat-guide',
  'smart thermostat guide: save energy without sacrificing comfort': '/energy/smart-thermostat-guide',
  'digital minimalism': '/life/digital-minimalism-guide',
  'digital minimalism: a practical guide to reclaim your attention': '/life/digital-minimalism-guide',
  '7-day digital detox': '/life/7-day-digital-detox',
  'underconsumption: how to buy less without feeling deprived': '/life/underconsumption-buy-less',
  'underconsumption': '/life/underconsumption-buy-less',
  'slow living for busy people': '/life/slow-living-for-busy-people',
  'mindful morning routine': '/life/mindful-morning-routine'
};

function getInternalUrl(rawTitle) {
  const norm = rawTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  for (const [key, url] of Object.entries(internalUrlMap)) {
    const keyNorm = key.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    if (norm.includes(keyNorm) || keyNorm.includes(norm)) {
      return url;
    }
  }
  return '/latest';
}

// Find all 20 blogs
const regex = /(?:^|\n)Blog\s+(\d+):\s*([^\n\r]+)/gi;
let matches = [];
let m;
while ((m = regex.exec(content)) !== null) {
  matches.push({ index: m.index, blogNum: parseInt(m[1], 10), rawTitle: m[2].trim() });
}

console.log(`Discovered ${matches.length} blogs.`);

for (let i = 0; i < matches.length; i++) {
  const current = matches[i];
  const next = matches[i + 1];
  let rawBlog = '';
  if (next) {
    rawBlog = content.substring(current.index, next.index);
  } else {
    const endIdx = content.indexOf('4. Keyword-to-Article Map', current.index);
    rawBlog = content.substring(current.index, endIdx > 0 ? endIdx : content.length);
  }

  const lines = rawBlog.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  let category = '';
  let url = '';
  let seoTitle = '';
  let metaDescription = '';
  let primaryKeyword = '';
  let secondaryKeywords = [];
  let imageFilename = '';
  let imageAlt = '';

  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];
    if (line.startsWith('Category:')) category = line.replace('Category:', '').trim().toLowerCase();
    else if (line.startsWith('Suggested URL:')) url = line.replace('Suggested URL:', '').trim();
    else if (line.startsWith('Meta title:')) seoTitle = line.replace('Meta title:', '').trim();
    else if (line.startsWith('Meta description:')) metaDescription = line.replace('Meta description:', '').trim();
    else if (line.startsWith('Primary keyword:')) primaryKeyword = line.replace('Primary keyword:', '').trim();
    else if (line.startsWith('Secondary keywords:')) {
      secondaryKeywords = line.replace('Secondary keywords:', '').split(',').map(s => s.trim()).filter(Boolean);
    }
    else if (line.startsWith('Suggested alt text:')) imageAlt = line.replace('Suggested alt text:', '').trim();
    else if (line.startsWith('Suggested filename:')) imageFilename = line.replace('Suggested filename:', '').trim();
  }

  const slug = url.split('/').filter(Boolean).pop() || path.basename(imageFilename, '.webp');
  const title = current.rawTitle;
  const subcategory = subcategories[current.blogNum] || 'Living';
  const role = deskRoles[category] || 'Editorial Desk';

  // Extract sections
  const fnIdx = lines.findIndex(l => l.startsWith('Suggested filename:'));
  const faqIdx = lines.findIndex(l => l.toLowerCase().includes('frequently asked questions'));
  const linksIdx = lines.findIndex(l => l.toLowerCase().includes('internal links to add'));
  const wordCountIdx = lines.findIndex(l => l.toLowerCase().includes('approx. article word count'));

  // Body content lines
  const bodySlice = lines.slice(fnIdx + 1, faqIdx > -1 ? faqIdx : lines.length);
  // First line is repeated title
  const articleTitleRepeat = bodySlice[0];
  const introParagraph = bodySlice[1];
  const remainingBody = bodySlice.slice(2);

  // Group into headings and paragraphs
  let bodyMdx = '';
  bodyMdx += introParagraph + '\n\n';

  // Add tip callout
  if (tipsMap[current.blogNum]) {
    const tip = tipsMap[current.blogNum];
    bodyMdx += `<Tip title="${tip.title}">\n${tip.text}\n</Tip>\n\n`;
  }

  for (let b = 0; b < remainingBody.length; b += 2) {
    const heading = remainingBody[b];
    const text = remainingBody[b + 1];
    if (heading && text) {
      // Check if heading already starts with a number like "1. Understand your bill"
      if (/^\d+\./.test(heading)) {
        bodyMdx += `## ${heading}\n\n${text}\n\n`;
      } else {
        bodyMdx += `## ${heading}\n\n${text}\n\n`;
      }
    } else if (heading) {
      bodyMdx += `${heading}\n\n`;
    }
  }

  // Parse FAQs
  let faqItems = [];
  if (faqIdx > -1) {
    const faqSlice = lines.slice(faqIdx + 1, linksIdx > -1 ? linksIdx : lines.length);
    for (let f = 0; f < faqSlice.length; f += 2) {
      const q = faqSlice[f];
      const a = faqSlice[f + 1];
      if (q && a && q.endsWith('?')) {
        faqItems.push({ question: q, answer: a });
      }
    }
  }

  if (faqItems.length > 0) {
    bodyMdx += `<FAQ\n  items={[\n`;
    faqItems.forEach((item, idx) => {
      bodyMdx += `    {\n      question: ${JSON.stringify(item.question)},\n      answer: ${JSON.stringify(item.answer)}\n    }${idx < faqItems.length - 1 ? ',' : ''}\n`;
    });
    bodyMdx += `  ]}\n/>\n\n`;
  }

  // Parse internal links
  let internalLinks = [];
  if (linksIdx > -1) {
    const linkSlice = lines.slice(linksIdx + 1, wordCountIdx > -1 ? wordCountIdx : lines.length);
    for (const l of linkSlice) {
      if (l.toLowerCase().includes('optional in-article') || l.toLowerCase().includes('approx. article word')) {
        break;
      }
      if (l.length > 3) {
        internalLinks.push({ title: l, url: getInternalUrl(l) });
      }
    }
  }

  if (internalLinks.length > 0) {
    bodyMdx += `### Related Guides to Explore\n`;
    internalLinks.forEach(link => {
      bodyMdx += `- [${link.title}](${link.url})\n`;
    });
    bodyMdx += '\n';
  }

  // Build tags
  const tagsSet = new Set();
  tagsSet.add(primaryKeyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  secondaryKeywords.forEach(k => {
    tagsSet.add(k.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
  });
  const tags = Array.from(tagsSet).slice(0, 5);

  const frontmatter = `---
title: ${JSON.stringify(title)}
slug: ${JSON.stringify(slug)}
description: ${JSON.stringify(metaDescription)}
category: ${JSON.stringify(category)}
subcategory: ${JSON.stringify(subcategory)}
author:
  name: "Grow Here Editorial"
  role: ${JSON.stringify(role)}
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
publishedAt: "2026-09-06"
image: ${JSON.stringify('/images/posts/' + imageFilename)}
imageAlt: ${JSON.stringify(imageAlt)}
featured: false
readingTime: "5 min read"
tags: ${JSON.stringify(tags)}
seoTitle: ${JSON.stringify(seoTitle)}
metaDescription: ${JSON.stringify(metaDescription)}
primaryKeyword: ${JSON.stringify(primaryKeyword)}
secondaryKeywords: ${JSON.stringify(secondaryKeywords)}
---

${bodyMdx.trim()}
`;

  const targetDir = path.join(__dirname, '../content', category);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, `${slug}.mdx`);
  fs.writeFileSync(targetFile, frontmatter, 'utf8');
  console.log(`[Blog ${current.blogNum}] Generated: content/${category}/${slug}.mdx`);
}

// Generate Flagship Story
const flagshipMdx = `---
title: "How to Create a Greener, Calmer Home Without Doing Everything at Once"
slug: "how-to-create-a-greener-calmer-home"
description: "A realistic starting plan for better plants, less clutter, smarter energy use and more intentional routines."
category: "grow"
subcategory: "Sustainable Living"
author:
  name: "Grow Here Editorial"
  role: "Horticulture & Living Desk"
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
publishedAt: "2026-09-06"
image: "/images/posts/how-to-create-a-greener-calmer-home.webp"
imageAlt: "A calm, sunlit green apartment space with healthy indoor plants and uncluttered shelving"
featured: true
readingTime: "6 min read"
tags: ["Green Living", "Decluttering", "Energy Efficiency", "Mindful Living", "Home Wellness"]
seoTitle: "How to Create a Greener, Calmer Home | Grow Here"
metaDescription: "A realistic starting plan for better plants, less clutter, smarter energy use and more intentional routines."
primaryKeyword: "greener calmer home"
secondaryKeywords: ["sustainable home", "declutter home", "save energy at home", "mindful routines", "indoor plants"]
---

Sustainable and intentional living can easily feel overwhelming when presented as an all-or-nothing lifestyle overhaul. You do not need to replace every appliance, adopt strict zero-waste living overnight, or turn your living room into an immaculate greenhouse. The secret to lasting change is small, high-impact improvements that fit into everyday routines.

At Grow Here, we believe a better home is built across four core dimensions: healthy living greenery, calm uncluttered spaces, thoughtful energy management, and intentional daily rhythms. Here is how to make measurable progress in each area without burning out.

<Tip title="The 1-Degree Shift Principle">
Small, consistent adjustments create dramatic cumulative improvements over months. Focus on completing one clear, tangible change in one room before expanding to the rest of your home.
</Tip>

## 1. Grow: Start with One Resilient Plant

Do not rush out and purchase ten tropical plants with conflicting humidity and watering requirements. Begin with one forgiving species suited to your light levels:

- **Snake Plant (Sansevieria):** Tolerates drought and low ambient light without dropping foliage.
- **ZZ Plant (Zamioculcas zamiifolia):** Stores water in underground rhizomes and thrives even with infrequent care.
- **Pothos (Epipremnum aureum):** Fast-growing cascading vine that visually communicates when it needs hydration.

Place your first plant where you will enjoy seeing it each morning. Learn its rhythm, inspect the soil once a week with your finger, and enjoy the living calm it brings to your windowsill.

## 2. Space: Clear One Surface That Stresses You

Clutter generates low-grade visual noise that subtly drains mental bandwidth. Instead of attempting a marathon weekend declutter:

- Choose **one high-traffic surface**: the entryway landing table, the kitchen prep counter, or your bedside stand.
- Clear it completely. Clean the surface with a damp cloth.
- Return only the essential items that truly belong there.
- Protect that single surface for a full week before moving to another shelf or drawer.

Experiencing what a calm, functional surface feels like provides natural momentum for decluttering adjacent areas.

## 3. Energy: Eliminate Low-Hanging Phantom Waste

Saving energy is not just about expensive solar installations or major renovations. Significant savings start with zero-cost behavioral tweaks:

- **Audit Standby Power:** Switch off entertainment centers, game consoles, and chargers when not in use.
- **Thermostat Optimization:** Adjust your thermostat by 1°C—slightly lower in winter, slightly higher in summer.
- **Wash Cooler:** Run laundry cycles at 30°C rather than 60°C. Modern detergents clean just as effectively while consuming up to 60% less water-heating energy.

These micro-habits trim utility expenses without sacrificing everyday comfort.

## 4. Life: Establish One Calm Digital Boundary

A peaceful home environment requires intentional digital boundaries. Constant notifications, late-night news feeds, and impulsive morning phone checking disrupt domestic calm:

- Set an evening **device curfew** 45 minutes before sleep.
- Charge your phone outside the bedroom and use a simple analog bedside alarm clock.
- Spend your first 20 minutes awake enjoying tea, natural daylight, or light stretching before checking email or notifications.

Protecting your morning and evening margins transforms the emotional atmosphere of your living space.

## A 30-Day Gentle Implementation Plan

| Week | Pillar | Practical Focus |
| :--- | :--- | :--- |
| **Week 1** | Grow | Choose and position your first resilient houseplant or windowsill herb |
| **Week 2** | Space | Clear and maintain your primary entryway or kitchen counter |
| **Week 3** | Energy | Audit standby power and optimize your laundry washing temperature |
| **Week 4** | Life | Institute a phone-free bedroom routine and a 20-minute calm morning |

<FAQ
  items={[
    {
      question: "Do I need a large home or balcony to start?",
      answer: "Not at all. Even a single windowsill, an uncluttered bedside table, and a few conscious digital boundaries can completely transform an apartment."
    },
    {
      question: "What if I forget to water my plant or slip into old habits?",
      answer: "Gentle consistency matters more than rigid perfection. Resume your routine the next day without guilt. Sustainable habits take weeks to become second nature."
    }
  ]}
/>

### Related Guides to Explore
- [Mini Garden Ideas for Small Spaces: 12 Easy Ways to Grow More](/grow/mini-garden-ideas-small-spaces)
- [Small Apartment Organization Ideas That Actually Work](/space/small-apartment-organization-ideas)
- [How to Save Energy at Home: 20 Practical Ways to Cut Waste](/energy/how-to-save-energy-at-home)
- [Digital Minimalism: A Practical Guide to Reclaim Your Attention](/life/digital-minimalism-guide)
`;

const flagshipPath = path.join(__dirname, '../content/grow/how-to-create-a-greener-calmer-home.mdx');
fs.writeFileSync(flagshipPath, flagshipMdx, 'utf8');
console.log('Generated Flagship Article: content/grow/how-to-create-a-greener-calmer-home.mdx');
console.log('All articles generated successfully!');
