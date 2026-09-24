// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://amg-devel.vercel.app",

  output: 'server',

  // Pages stay static; only routes with `prerender = false` (the Spotify
  // endpoint) run as Vercel functions
  adapter: vercel(),

  env: {
    schema: {
      // Optional: without them the "now playing" widget simply stays hidden
      SPOTIFY_CLIENT_ID: envField.string({ context: "server", access: "secret", optional: true }),
      SPOTIFY_CLIENT_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
      SPOTIFY_REFRESH_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap()],

  server: {
    host: true,
  },
});