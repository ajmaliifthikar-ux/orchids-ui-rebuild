/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme palette
        dark: {
          bg: "#0a0a0a",
          surface: "#1a1a1a",
          border: "#252525",
          text: "#ffffff",
          muted: "#a0a0a0",
        },
        brand: {
          blue: "#3b82f6",
          gold: "#f59e0b",
          green: "#10b981",
          red: "#ef4444",
          yellow: "#eab308",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
}
