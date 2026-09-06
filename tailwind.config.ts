import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#04120D',
          900: '#061A14', // primary dark background
          850: '#071E18',
          800: '#0A241B', // card deep green
          750: '#0E2E23',
          700: '#164B38', // secondary green
          600: '#1D6548',
          500: '#2A8662',
          400: '#40A37A',
        },
        botanical: {
          accent: '#79A96B', // accent leaf green
          light: '#A7C99B',
          glow: '#C2DFB8',
          muted: '#9DB0A3', // secondary text soft muted gray-green
        },
        warm: {
          accent: '#E8C75A', // warm mustard/gold accent
          gold: '#DFB738',
          amber: '#F3D57A',
          subtle: '#FAF3DC',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FAF9F5',
          200: '#F7F6F1', // light section background
          300: '#F4F5EF', // alternate light section
          400: '#F6F3EA', // main text on dark
          500: '#E8E5DA',
          600: '#D5D1C4',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
};

export default config;
