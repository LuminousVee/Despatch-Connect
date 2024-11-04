/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        sans:['Roboto','sans-serify']
      },
      gridTemplateColumns:{
        '70/30': '70% 28%',
      },
    },
  },
  plugins: [],
}