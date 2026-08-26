/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/popup/index.html', './src/options/index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        msblue: '#0078D4',
        'msblue-dark': '#005A9E',
        'msblue-light': '#2B88D8',
      },
    },
  },
  plugins: [],
};
