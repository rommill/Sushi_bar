/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sushi: {
          red: "#FF6B6B",
          salmon: "#FF9E7D",
          rice: "#F8F4E9",
          nori: "#2C3E50",
          avocado: "#8BC34A",
        },
      },
    },
  },
  plugins: [],
};
