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
        deep: "#0a0a23",
        gold: {
          DEFAULT: "#d4af37",
          light: "#e8c547",
          dim: "#a68b28",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Noto Serif KR", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
