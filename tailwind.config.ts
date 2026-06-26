import type { Config } from "tailwindcss";
import scrollbarHide from "tailwind-scrollbar-hide";
import textShadow from "tailwindcss-textshadow";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0e1a",
        surface: {
          0: "#0a0e1a",
          1: "#111827",
          2: "#1e293b",
          3: "#334155",
        },
        accent: {
          DEFAULT: "#14b8a6",
          hover: "#0d9488",
          secondary: "#6366f1",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [scrollbarHide, textShadow],
};

export default config;
