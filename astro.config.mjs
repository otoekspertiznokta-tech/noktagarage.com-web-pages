import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://noktagarage.com",
  output: "static",
  build: {
    format: "directory"
  },
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true
    }
  }
});
