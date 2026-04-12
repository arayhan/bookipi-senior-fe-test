import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6ff",
          200: "#bfd2ff",
          300: "#94b3ff",
          400: "#6088ff",
          500: "#3c63f5",
          600: "#2d4ae0",
          700: "#2438ad",
          800: "#22338a",
          900: "#1f2f6e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
