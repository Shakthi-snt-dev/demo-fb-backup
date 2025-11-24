/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // map Tailwind's `font-sans` to Nunito Sans
        sans: ['"Nunito Sans"', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        // primary color as requested
        primary: 'rgba(7,126,242,1)'
      }
    }
  },
  plugins: []
}
