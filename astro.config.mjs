// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://amg-devel.vercel.app",

  // Pages stay static; only routes with `prerender = false` (the Spotify
  // endpoint and the 404, which picks its language from the URL) run as
  // Vercel functions
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

  // Pages are downloaded when a link is hovered or focused, so the click
  // navigates right away (the dock uses "viewport" to also help on phones)
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },

  // English lives at the root and Spanish under /es (texts in src/i18n)
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    sitemap({
      // hreflang alternates between /about and /es/about
      i18n: { defaultLocale: "en", locales: { en: "en-US", es: "es-CO" } },
      // /es/blog/<post> only translates the interface and points to the English post
      filter: (page) => !/\/es\/blog\/[^/]+\/?$/.test(page),
    }),
  ],

  // Fonts are downloaded at build time and served from this domain (no
  // render-blocking request to Google), with a metric-matched fallback
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Libre Franklin",
      cssVariable: "--font-franklin",
      weights: [300, 400, 500, 700, 900],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      weights: [400, 500],
      subsets: ["latin"],
      fallbacks: ["monospace"],
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