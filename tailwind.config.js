/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#EFECE6',
        espresso: '#23201D',
        terracotta: '#9A6E57',
        paper: '#F8F7F3',
      },
      fontFamily: {
        sans: ['DM Sans', 'Noto Sans KR', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Noto Serif KR', 'serif'],
        display: ['Cormorant Garamond', 'DM Sans', 'Noto Sans KR', 'serif'],
      },
    },
  },
  plugins: [],
};
