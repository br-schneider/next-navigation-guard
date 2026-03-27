/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "SF Mono", "Menlo", "Consolas", "Liberation Mono", "monospace"],
      },
      colors: {
        surface: "#0c0c0c",
      },
    },
  },
};
