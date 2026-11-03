/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#1e293b',
          DEFAULT: '#0f172a', // Dark Navy Blue
          dark: '#020617',
        },
        secondary: {
          light: '#9333ea',
          DEFAULT: '#7c3aed', // Purple
          dark: '#581c87',
        },
        accent: {
          light: '#22d3ee',
          DEFAULT: '#06b6d4', // Cyan
          dark: '#0e7490',
        },
        background: {
          light: '#f8fafc',
          DEFAULT: '#ffffff',
          alt: '#f1f5f9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
