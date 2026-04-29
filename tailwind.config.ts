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
        // — Primary → Bronze/Gold accent (Palette #3) —
        // Uses <alpha-value> so opacity modifiers (bg-primary/15 etc.) work.
        primary: 'rgb(var(--accent-rgb) / <alpha-value>)',
        "on-primary": {
          DEFAULT: "var(--bg-main)",
          container: "#4c544d",
          fixed: "#3a413b",
          "fixed-variant": "#565d56",
        },

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

        // — Surface (Warm Ivory — Palette #3) —
        surface: {
          DEFAULT: "#F4F1EA",
          dim: "#dedad1",
          bright: "#F4F1EA",
          variant: "#e5e0d5",
          tint: "#8C7851",
          container: {
            DEFAULT: "#ece8df",
            lowest: "#ffffff",
            low: "#f2efe8",
            high: "#e5e0d5",
            highest: "#dedad1",
          },
        },
        "on-surface": {
          DEFAULT: "#1A1A1A",
          variant: "#5b5649",
        },
        "inverse-surface": "#1A1A1A",
        "inverse-on-surface": "#9c9a96",

        // — Outline —
        outline: {
          DEFAULT: "#7a7468",
          variant: "#b5afa4",
        },

        // — Background & Foreground (CSS-variable-driven, opacity-aware) —
        background: 'rgb(var(--bg-main-rgb) / <alpha-value>)',
        foreground: 'rgb(var(--text-main-rgb) / <alpha-value>)',
        "on-background": 'rgb(var(--text-main-rgb) / <alpha-value>)',
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
        "arabic-serif": ['"Aref Ruqaa"', "serif"],
      },

      boxShadow: {
        card: "0 20px 40px rgba(46, 52, 45, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
