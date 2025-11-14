import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env": {}
  },
  build: {
    outDir: "build",
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/content/inpage.ts"),
      formats: ["iife"],
      name: "InpageBundle"
    },
    rollupOptions: {
      output: {
        entryFileNames: "inpage.js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
});
