export default {
  content: ["./index.html", "./src/content/*.{ts,tsx,js,jsx}", "./src/ui/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {},
    fontSize: {
      xs: ["14px", "16px"],
      sm: ["16px", "18px"],
      base: ["20px", "22px"],
      lg: ["21px", "24px"],
      xl: ["22px", "26px"],
    }
  },
  plugins: []
};
