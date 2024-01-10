import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  vite: {
    css: {
      transformer: 'lightningcss'
    },
    build: {
      cssMinify: 'lightningcss'
    }
  },
  output: "server",
  adapter: netlify()
});