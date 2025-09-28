import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        design: { 1: '#E8083E', 2: '#FD5058', 3: '#FF867E', 4: '#FFC0BC' },
        build: { 1: '#0000FF', 2: '#2A61EE', 3: '#5984F2', 4: '#A0B9F7' },
        reach: { 1: '#E49B08', 2: '#FBBA27', 3: '#FDCC65', 4: '#FFD997' },
        neutral: {
          'base-1': '#FAFAFA', 'base-2': '#F1F1F0', 'base-3': '#CCCBCA',
          'base-4': '#A5A4A3', 'base-5': '#807F7E', 'base-6': '#5C5B5B',
          'base-7': '#3B3A3A', 'base-8': '#1C1C1C',
        },
      },
      fontFamily: { space: ['var(--font-space-grotesk)', 'sans-serif'] },
      fontSize: {
        'h1': '120px', 'h2': '80px', 'h3': '48px',
        'h4': '32px', 'h5': '24px', 'body': '16px', 'body-sm': '12px',
      },
      lineHeight: {
        'h1': '120px', 'h2': '80px', 'h3': '64px', 'h4': '39px', 'h5': '24px',
      },
      letterSpacing: {
        'h1': '-6px', 'h2': '-4px', 'h3': '-2.4px', 'h4': '-1.6px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
export default config