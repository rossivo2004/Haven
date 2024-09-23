import { nextui } from '@nextui-org/theme';
const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'svn-gilroy': ['SVN-Gilroy', 'sans-serif'],
      },
      colors: {
        main: '#FFC535',
        secondary: '#1B1D21',
        price: '#F01919',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui(), daisyui],
};
