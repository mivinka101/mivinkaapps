import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        canvas: "#f5f5f5",
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(15, 23, 42, 0.2)",
      }
    },
  },
  plugins: [],
};

export default config;
