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
        studio: {
          bg: "#F5F3EE",
          text: "#111111",
          accent: "#222222",
          muted: "#777777",
          border: "#D8D4CB",
        },
      },
      fontFamily: {
        sans: ["var(--font-neue)", "var(--font-inter)", "Inter", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
        tightest: "-0.04em",
      },
      lineHeight: {
        hero: "0.85",
      },
    },
  },
  plugins: [],
};
export default config;
