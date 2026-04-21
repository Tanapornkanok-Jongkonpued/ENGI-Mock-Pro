/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0A0F1E",
        "bg-secondary": "#0F1729",
        "bg-tertiary": "#141D35",
        "accent-gold": "#F5C842",
        "accent-green": "#22C55E",
        "accent-red": "#EF4444",
        "accent-blue": "#3B82F6",
        "text-primary": "#EFF4FF",
        "text-muted": "#7C8BA1",
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', "sans-serif"],
        heading: ['"Space Grotesk"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
