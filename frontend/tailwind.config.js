/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        arabic: [
          "var(--arabic-font-family)",
          "Scheherazade New",
          "Amiri",
          "Noto Naskh Arabic",
          "serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 500ms ease-out",
        "slide-in-right": "slideInRight 300ms ease-out",
        "pulse-glass": "pulseGlass 1.8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlass: {
          "0%, 100%": { opacity: "0.75" },
          "50%": { opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
        glass: "18px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },
      boxShadow: {
        glow: "0 0 24px rgba(16, 185, 129, 0.22)",
        "glass-xl": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
    },
  },
  plugins: [],
};
