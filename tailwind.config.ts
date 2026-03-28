/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}', './src/**/*.css'],
  theme: {
    extend: {
      fontFamily: {
        default: ['ui-sans-serif', 'system-ui'],
        roboto: ['Roboto', 'sans-serif'],
        lora: ['Lora', 'serif']
      }
    }
  },
  plugins: []
}
