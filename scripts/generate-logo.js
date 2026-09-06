const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outputDir = path.join(process.cwd(), 'public/images/logo');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to generate the GH Monogram Mark SVG (ViewBox: 0 0 100 100)
function generateMarkSvg({ strokeColor = '#FAF7F2', leafColor = '#7C9A82', bg = 'none' }) {
  return `
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    ${bg !== 'none' ? `<rect width="100" height="100" rx="26" fill="${bg}" />` : ''}
    
    <!-- Outer Squircle with smooth organic curvature -->
    <rect x="7" y="7" width="86" height="86" rx="24" ry="24" stroke="${strokeColor}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
    
    <!-- G & H Interlocking Monogram -->
    <g transform="translate(0, 0)">
      <!-- G Letterform (Serif style with high stroke modulation) -->
      <!-- G Top Hook & Left Curve -->
      <path d="M 44 26 C 41 24.5 37 23.5 32.5 23.5 C 20.5 23.5 14 33.5 14 50 C 14 66.5 21 76.5 32.5 76.5 C 38 76.5 42.5 74.5 45.5 71.5" 
            stroke="${strokeColor}" stroke-width="5.2" stroke-linecap="round" />
      
      <!-- G Top Serif -->
      <path d="M 43 23 L 45 28" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" />
      
      <!-- G Vertical Stem / Spur -->
      <path d="M 45 56 L 45 72" stroke="${strokeColor}" stroke-width="4.8" stroke-linecap="round" />
      
      <!-- G Crossbar -->
      <path d="M 34 56 L 47 56" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round" />

      <!-- H Letterform (Interlocking on the right) -->
      <!-- H Left Vertical Stem (shares/intertwines near G spur) -->
      <path d="M 48 37 L 48 76" stroke="${strokeColor}" stroke-width="4.8" stroke-linecap="round" />
      <!-- H Left Top Serif -->
      <path d="M 45 37 L 51 37" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" />
      <!-- H Left Bottom Serif -->
      <path d="M 45 76 L 51 76" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" />

      <!-- H Crossbar -->
      <path d="M 48 56 L 68 56" stroke="${strokeColor}" stroke-width="4" stroke-linecap="round" />

      <!-- H Right Vertical Stem -->
      <path d="M 68 28 L 68 76" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" />
      <!-- H Right Top Serif -->
      <path d="M 64 28 L 73 28" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" />
      <!-- H Right Bottom Serif -->
      <path d="M 63 76 L 74 76" stroke="${strokeColor}" stroke-width="3.2" stroke-linecap="round" />

      <!-- Botanical Sprouting Leaf (Sage Green accent emerging from crossbar) -->
      <!-- Leaf body -->
      <path d="M 57 53 C 58 45 64 34 76 26 C 76 36 71 45 61 51 Z" 
            fill="${leafColor}" />
      <!-- Leaf delicate stem / central vein -->
      <path d="M 56 54 Q 65 42 75 27" 
            stroke="${strokeColor}" stroke-width="1.2" stroke-linecap="round" opacity="0.85" />
    </g>
  </svg>
  `;
}

// Function to generate the Complete Horizontal Logo (ViewBox: 0 0 460 100)
function generateHorizontalSvg({ textColor = '#FAF7F2', leafColor = '#7C9A82', bg = 'none' }) {
  return `
  <svg viewBox="0 0 460 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    ${bg !== 'none' ? `<rect width="460" height="100" rx="12" fill="${bg}" />` : ''}

    <!-- Logomark (Left Squircle) -->
    <g transform="translate(10, 8)">
      <!-- Outer Squircle -->
      <rect x="2" y="2" width="80" height="80" rx="22" ry="22" stroke="${textColor}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- G Letterform -->
      <path d="M 37 23 C 34 21.5 30 20.5 26 20.5 C 15 20.5 9 29.5 9 44 C 9 58.5 15.5 67.5 26 67.5 C 31 67.5 35 65.5 38 63" 
            stroke="${textColor}" stroke-width="4.8" stroke-linecap="round" />
      <path d="M 38 49 L 38 63" stroke="${textColor}" stroke-width="4.4" stroke-linecap="round" />
      <path d="M 28 49 L 40 49" stroke="${textColor}" stroke-width="4" stroke-linecap="round" />

      <!-- H Letterform -->
      <path d="M 41 32 L 41 67" stroke="${textColor}" stroke-width="4.4" stroke-linecap="round" />
      <path d="M 38 32 L 44 32" stroke="${textColor}" stroke-width="2.8" stroke-linecap="round" />
      <path d="M 38 67 L 44 67" stroke="${textColor}" stroke-width="2.8" stroke-linecap="round" />

      <path d="M 41 49 L 58 49" stroke="${textColor}" stroke-width="3.6" stroke-linecap="round" />

      <path d="M 58 24 L 58 67" stroke="${textColor}" stroke-width="4.6" stroke-linecap="round" />
      <path d="M 54 24 L 62 24" stroke="${textColor}" stroke-width="2.8" stroke-linecap="round" />
      <path d="M 54 67 L 63 67" stroke="${textColor}" stroke-width="2.8" stroke-linecap="round" />

      <!-- Leaf Accent -->
      <path d="M 48 46 C 49 39 55 29 65 22 C 65 31 60 39 52 44 Z" 
            fill="${leafColor}" />
      <path d="M 47 47 Q 56 36 64 23" 
            stroke="${textColor}" stroke-width="1" stroke-linecap="round" opacity="0.8" />
    </g>

    <!-- Refined Vertical Divider Line -->
    <line x1="116" y1="20" x2="116" y2="80" stroke="${textColor}" stroke-opacity="0.35" stroke-width="1.2" stroke-linecap="round" />

    <!-- Brand Typography -->
    <g transform="translate(138, 0)">
      <!-- Wordmark: G R O W H E R E -->
      <text x="0" y="50" 
            font-family="Georgia, 'Times New Roman', serif" 
            font-size="28" 
            font-weight="500" 
            letter-spacing="7" 
            fill="${textColor}">
        GROWHERE
      </text>

      <!-- Tagline: Grow a better way of living. -->
      <text x="2" y="73" 
            font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
            font-size="13" 
            font-weight="300" 
            font-style="italic" 
            letter-spacing="0.8" 
            fill="${textColor}" 
            opacity="0.75">
        Grow a better way of living.
      </text>
    </g>
  </svg>
  `;
}

// Function to generate the Stacked Centered Logo (ViewBox: 0 0 320 240)
function generateStackedSvg({ textColor = '#FAF7F2', leafColor = '#7C9A82', bg = 'none' }) {
  return `
  <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    ${bg !== 'none' ? `<rect width="320" height="240" rx="16" fill="${bg}" />` : ''}

    <!-- Centered Mark -->
    <g transform="translate(110, 20)">
      <!-- Outer Squircle -->
      <rect x="4" y="4" width="92" height="92" rx="26" ry="26" stroke="${textColor}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- G Letterform -->
      <path d="M 44 26 C 41 24.5 37 23.5 32.5 23.5 C 20.5 23.5 14 33.5 14 50 C 14 66.5 21 76.5 32.5 76.5 C 38 76.5 42.5 74.5 45.5 71.5" 
            stroke="${textColor}" stroke-width="5.2" stroke-linecap="round" />
      <path d="M 45 56 L 45 72" stroke="${textColor}" stroke-width="4.8" stroke-linecap="round" />
      <path d="M 34 56 L 47 56" stroke="${textColor}" stroke-width="4.5" stroke-linecap="round" />

      <!-- H Letterform -->
      <path d="M 48 37 L 48 76" stroke="${textColor}" stroke-width="4.8" stroke-linecap="round" />
      <path d="M 45 37 L 51 37" stroke="${textColor}" stroke-width="3" stroke-linecap="round" />
      <path d="M 45 76 L 51 76" stroke="${textColor}" stroke-width="3" stroke-linecap="round" />

      <path d="M 48 56 L 68 56" stroke="${textColor}" stroke-width="4" stroke-linecap="round" />

      <path d="M 68 28 L 68 76" stroke="${textColor}" stroke-width="5" stroke-linecap="round" />
      <path d="M 64 28 L 73 28" stroke="${textColor}" stroke-width="3.2" stroke-linecap="round" />
      <path d="M 63 76 L 74 76" stroke="${textColor}" stroke-width="3.2" stroke-linecap="round" />

      <!-- Leaf Accent -->
      <path d="M 57 53 C 58 45 64 34 76 26 C 76 36 71 45 61 51 Z" fill="${leafColor}" />
      <path d="M 56 54 Q 65 42 75 27" stroke="${textColor}" stroke-width="1.2" stroke-linecap="round" opacity="0.85" />
    </g>

    <!-- Stacked Brand Typography -->
    <text x="160" y="172" 
          font-family="Georgia, 'Times New Roman', serif" 
          font-size="28" 
          font-weight="500" 
          letter-spacing="9" 
          text-anchor="middle" 
          fill="${textColor}">
      GROWHERE
    </text>

    <text x="160" y="202" 
          font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="14" 
          font-weight="300" 
          font-style="italic" 
          letter-spacing="1" 
          text-anchor="middle" 
          fill="${textColor}" 
          opacity="0.8">
      Grow a better way of living.
    </text>
  </svg>
  `;
}

// Favicon (Circle with Forest Green background, White GH mark, Sage Green Leaf)
function generateFaviconSvg() {
  return `
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#132B20" />
    
    <g transform="translate(10, 10) scale(0.8)">
      <!-- G Letterform -->
      <path d="M 44 26 C 41 24.5 37 23.5 32.5 23.5 C 20.5 23.5 14 33.5 14 50 C 14 66.5 21 76.5 32.5 76.5 C 38 76.5 42.5 74.5 45.5 71.5" 
            stroke="#FAF7F2" stroke-width="6" stroke-linecap="round" />
      <path d="M 45 56 L 45 72" stroke="#FAF7F2" stroke-width="5.5" stroke-linecap="round" />
      <path d="M 34 56 L 47 56" stroke="#FAF7F2" stroke-width="5" stroke-linecap="round" />

      <!-- H Letterform -->
      <path d="M 48 37 L 48 76" stroke="#FAF7F2" stroke-width="5.5" stroke-linecap="round" />
      <path d="M 48 56 L 68 56" stroke="#FAF7F2" stroke-width="5" stroke-linecap="round" />
      <path d="M 68 28 L 68 76" stroke="#FAF7F2" stroke-width="6" stroke-linecap="round" />

      <!-- Leaf Accent -->
      <path d="M 57 53 C 58 45 64 34 76 26 C 76 36 71 45 61 51 Z" fill="#7C9A82" />
      <path d="M 56 54 Q 65 42 75 27" stroke="#FAF7F2" stroke-width="1.5" stroke-linecap="round" opacity="0.9" />
    </g>
  </svg>
  `;
}

async function buildLogos() {
  console.log('Generating brand logo assets...');

  // 1. Mark for dark background
  const markDarkSvg = generateMarkSvg({ strokeColor: '#FAF7F2', leafColor: '#7C9A82' });
  fs.writeFileSync(path.join(outputDir, 'logo-mark-dark.svg'), markDarkSvg.trim(), 'utf8');

  // 2. Mark for light background
  const markLightSvg = generateMarkSvg({ strokeColor: '#132B20', leafColor: '#7C9A82' });
  fs.writeFileSync(path.join(outputDir, 'logo-mark-light.svg'), markLightSvg.trim(), 'utf8');

  // 3. Horizontal Dark
  const horizDarkSvg = generateHorizontalSvg({ textColor: '#FAF7F2', leafColor: '#7C9A82' });
  fs.writeFileSync(path.join(outputDir, 'logo-horizontal-dark.svg'), horizDarkSvg.trim(), 'utf8');

  // 4. Horizontal Light
  const horizLightSvg = generateHorizontalSvg({ textColor: '#132B20', leafColor: '#7C9A82' });
  fs.writeFileSync(path.join(outputDir, 'logo-horizontal-light.svg'), horizLightSvg.trim(), 'utf8');

  // 5. Stacked Dark & Light
  const stackedDarkSvg = generateStackedSvg({ textColor: '#FAF7F2', leafColor: '#7C9A82' });
  fs.writeFileSync(path.join(outputDir, 'logo-stacked-dark.svg'), stackedDarkSvg.trim(), 'utf8');

  const stackedLightSvg = generateStackedSvg({ textColor: '#132B20', leafColor: '#7C9A82' });
  fs.writeFileSync(path.join(outputDir, 'logo-stacked-light.svg'), stackedLightSvg.trim(), 'utf8');

  // 6. Favicon & App Icon
  const faviconSvg = generateFaviconSvg();
  fs.writeFileSync(path.join(process.cwd(), 'public/favicon.svg'), faviconSvg.trim(), 'utf8');
  
  const appIconSvg = generateMarkSvg({ strokeColor: '#FAF7F2', leafColor: '#7C9A82', bg: '#132B20' });
  fs.writeFileSync(path.join(process.cwd(), 'app/icon.svg'), appIconSvg.trim(), 'utf8');

  // Generate PNGs via sharp
  await sharp(Buffer.from(horizDarkSvg))
    .png()
    .toFile(path.join(outputDir, 'logo-horizontal-dark.png'));

  await sharp(Buffer.from(horizLightSvg))
    .png()
    .toFile(path.join(outputDir, 'logo-horizontal-light.png'));

  await sharp(Buffer.from(stackedDarkSvg))
    .png()
    .toFile(path.join(outputDir, 'logo-stacked-dark.png'));

  await sharp(Buffer.from(faviconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(process.cwd(), 'public/favicon-192.png'));

  console.log('All logo assets successfully generated in public/images/logo, public/favicon.svg, and app/icon.svg!');
}

buildLogos().catch(console.error);
