/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          'teal': '#5EEAD4',
          'dark': '#0F766E',
        },
        'cream': '#FEF9E7',
        'accent': {
          'yellow': '#FDE68A',
        },
        'text': {
          'primary': '#1E293B',
          'secondary': '#64748B',
        },
        'border': {
          'light': '#E2E8F0',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}