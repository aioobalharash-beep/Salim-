import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── Stitch Design Tokens ─────────────────────────────────── */
      colors: {
        // — Primary (Sage Gray) —
        primary: {
          DEFAULT: "#586059",
          dim: "#4d544d",
          container: "#dde5db",
          fixed: "#dde5db",
          "fixed-dim": "#cfd7cd",
        },
        "on-primary": {
          DEFAULT: "#f2faf0",
          container: "#4c544d",
          fixed: "#3a413b",
          "fixed-variant": "#565d56",
        },
        "inverse-primary": "#f4fcf2",

        // — Secondary —
        secondary: {
          DEFAULT: "#5f5f5f",
          dim: "#535353",
          container: "#e4e2e1",
          fixed: "#e4e2e1",
          "fixed-dim": "#d6d4d3",
        },
        "on-secondary": {
          DEFAULT: "#fbf8f8",
          container: "#525151",
          fixed: "#3f3f3f",
          "fixed-variant": "#5c5b5b",
        },

        // — Tertiary —
        tertiary: {
          DEFAULT: "#476657",
          dim: "#3b594b",
          container: "#d9fce8",
          fixed: "#d9fce8",
          "fixed-dim": "#cbedda",
        },
        "on-tertiary": {
          DEFAULT: "#e6fff0",
          container: "#446253",
          fixed: "#325042",
          "fixed-variant": "#4e6d5d",
        },

        // — Error —
        error: {
          DEFAULT: "#9f403d",
          dim: "#4e0309",
          container: "#fe8983",
        },
        "on-error": {
          DEFAULT: "#fff7f6",
          container: "#752121",
        },

        // — Surface (Warm Alabaster) —
        surface: {
          DEFAULT: "#fafaf5",
          dim: "#d5dcd0",
          bright: "#fafaf5",
          variant: "#dee4da",
          tint: "#586059",
          container: {
            DEFAULT: "#ecefe7",
            lowest: "#ffffff",
            low: "#f3f4ee",
            high: "#e5eae0",
            highest: "#dee4da",
          },
        },
        "on-surface": {
          DEFAULT: "#2e342d",
          variant: "#5b6159",
        },
        "inverse-surface": "#0d0f0c",
        "inverse-on-surface": "#9c9d99",

        // — Outline —
        outline: {
          DEFAULT: "#767c74",
          variant: "#aeb4aa",
        },

        // — Background alias —
        background: "#fafaf5",
        "on-background": "#2e342d",
      },

      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },

      fontFamily: {
        headline: ["Newsreader", "serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        "serif-brand": ['"Playfair Display"', "serif"],
      },

      boxShadow: {
        card: "0 20px 40px rgba(46, 52, 45, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
