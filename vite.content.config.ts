import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": {}
  },
  build: {
    outDir: "build",
    minify: false,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/content/index.tsx"),
      formats: ["iife"],
      name: "ContentBundle"
    },
    rollupOptions: {
      output: {
        entryFileNames: "content.js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
});
