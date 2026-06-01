/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        darkBase: '#000000',
        darkPanel: '#09090b',
        ink: '#f7f5f0',
        slateText: '#8a8f98',
        neonTeal: '#00f0ff',
        neonPink: '#ff007f',
        neonGreen: '#00ff66',
        warmGold: '#e8a842',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
