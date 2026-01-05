/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './privacy.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        brand: {
          accent: 'var(--color-accent)',
          base: 'var(--color-base)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
