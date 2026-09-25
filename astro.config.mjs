// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://amg-devel.vercel.app",

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

  // Geist is downloaded at build time and served from this domain (no
  // render-blocking request to Google), with a metric-matched fallback
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Geist",
      cssVariable: "--font-geist",
      weights: ["100 900"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
  ],

  markdown: {
    // Code blocks in blog posts and case studies
    shikiConfig: { theme: "houston" },
  },

  server: {
    host: true,
  },
});