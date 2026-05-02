/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#14324f",
          foreground: "#f8f3e7",
        },
        secondary: {
          DEFAULT: "#c7a24b",
          foreground: "#1b1b1b",
        },
        accent: {
          DEFAULT: "#f1e7d0",
          foreground: "#14324f",
        },
        danger: {
          DEFAULT: "#b42318",
          foreground: "#fff5f5",
        },
        dark: "#0f172a",
        light: "#fbf7ef",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(20, 50, 79, 0.10)",
        lift: "0 22px 35px rgba(15, 23, 42, 0.14)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(20,50,79,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(20,50,79,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
