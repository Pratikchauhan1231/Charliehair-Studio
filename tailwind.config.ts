import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0B0B0B",
          900: "#111111",
          850: "#161616",
          800: "#1B1B1B",
          700: "#242424",
          600: "#333333",
        },
        gold: {
          400: "#DFBA4E",
          500: "#C9A227",
          600: "#B38F1E",
          700: "#947414",
        },
        beige: {
          100: "#FAF7F2",
          200: "#F3EDE2",
          300: "#E6DCB8",
          400: "#D4C79F",
        },
        offwhite: "#F5F1E8",
        muted: "#9A9A9A",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
