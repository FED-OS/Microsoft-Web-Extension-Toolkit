/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/taskpane/index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        msblue: '#0078D4',
        'msblue-dark': '#005A9E',
      },
    },
  },
  plugins: [],
};
