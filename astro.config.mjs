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

  // English lives at the root and Spanish under /es (texts in src/i18n)
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    react(),
    sitemap({
      // hreflang alternates between /about and /es/about
      i18n: { defaultLocale: "en", locales: { en: "en-US", es: "es-CO" } },
      // /es/blog/<post> only translates the interface and points to the English post
      filter: (page) => !/\/es\/blog\/[^/]+\/?$/.test(page),
    }),
  ],

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