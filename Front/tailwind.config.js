/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      scrollSnap: {
        y: 'scroll-snap-type-y',
        start: 'scroll-snap-align: start',
      },
      backgroundColor: {
        smoke: '#848884',
        'smoke-light': '#a3a6a3',
        apricot: '#f5ceb8',
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      scrollSnap: ['responsive'],
    },
  },
};
