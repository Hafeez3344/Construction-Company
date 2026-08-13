import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#bae0ff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#0f2c59', // Construction Navy Blue Primary
          950: '#0a1d3c',
        },
        construction: {
          yellow: '#f59e0b',
          amber: '#d97706',
          orange: '#ea580c',
          dark: '#111827',
          gray: '#374151',
          lightGray: '#f3f4f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
