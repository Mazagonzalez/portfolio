# AMG - devel

Personal portfolio of **Carlos Maza**, frontend developer from Barranquilla, Colombia.

Live: [amg-devel.vercel.app](https://amg-devel.vercel.app)

## Stack

- [Astro 7](https://astro.build) with view transitions and content collections
- [Tailwind CSS 4](https://tailwindcss.com)
- React islands for the animated backgrounds (`Aurora`, `Hyperspace`, built on [OGL](https://github.com/oframe/ogl))
- Vercel Web Analytics and Speed Insights (production deployments only)

## Getting started

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # output in ./.vercel/output
npm run check     # type-check .astro and .ts files
npm run preview   # serve the production build
```

## Project structure

```text
public/
└── images/
    └── companies/  logos for the experience list
src/
├── assets/
│   └── projects/   project screenshots (optimized by Astro)
├── components/
│   ├── backgrounds/  Aurora and Hyperspace (React + OGL)
│   ├── blog/         post metadata (date, reading time, AI label)
│   ├── icons/        SVG icons (skills/ for tech logos)
│   ├── layout/       navbar and footer
│   ├── music/        music player and its spinning disk
│   ├── sections/     page sections (home/)
│   └── ui/           reusable pieces: card, carousel
├── content/
│   ├── blog/       one Markdown file per post
│   └── projects/   one Markdown file per project (case studies)
├── data/           content: experience, skills, social links, tracks
├── layouts/        base layout with SEO / Open Graph metadata
├── pages/          home, about, projects, blog, skills, 404, rss.xml
└── styles/         global Tailwind entry and custom CSS
```

## Spotify "now playing"

The hero shows what I'm listening to on Spotify (or the last track played),
served by `src/pages/api/now-playing.ts`, the only route that runs as a
Vercel function. Without credentials the widget just stays hidden.

1. Create an app at the [Spotify dashboard](https://developer.spotify.com/dashboard)
   with the Redirect URI `http://127.0.0.1:8888/callback`.
2. Copy `.env.example` to `.env` and fill in `SPOTIFY_CLIENT_ID` and
   `SPOTIFY_CLIENT_SECRET`.
3. Run `npm run spotify:auth`, open the URL it prints and accept. Paste the
   refresh token it gives you into `.env`.
4. Add the three variables in Vercel → Settings → Environment Variables.

## Blog

Posts live in `src/content/blog/` as Markdown (the filename is the URL:
`/blog/<slug>`). Each one gets its Open Graph image, an entry in `/rss.xml`
and the sitemap, and shows up in the command palette. `draft: true` keeps a
post out of the build.

### Drafts by Gemini

Every Monday `.github/workflows/blog.yml` asks Gemini (free tier) for a new
post and opens a pull request with it. **Nothing is published until you merge
that PR**, so read it on the Vercel preview and edit it if needed. Posts made
this way have `ai: true` and a small "AI-assisted" label.

- **What to write about:** the first unchecked idea in `scripts/blog/topics.md`.
  When the list runs out, Gemini picks a topic that isn't already covered.
- **Voice and audience:** `scripts/blog/persona.md`. Edit it to steer the blog.
- **Run it now:** Actions → Blog post → Run workflow (you can type a topic).
- **Locally:** put `GEMINI_API_KEY` in `.env` and run `npm run blog:generate`,
  or `npm run blog:generate -- "Your topic"`.

One-time setup in GitHub (Settings → Secrets and variables → Actions):

1. Create a key in [Google AI Studio](https://aistudio.google.com/apikey) and
   save it as the secret `GEMINI_API_KEY`.
2. Let the workflow open PRs: Settings → Actions → General → Workflow
   permissions → *Allow GitHub Actions to create and approve pull requests*.
3. Optional but recommended: a
   [fine-grained token](https://github.com/settings/personal-access-tokens)
   for this repo with *Contents* and *Pull requests* read/write, saved as the
   secret `BLOG_BOT_TOKEN`. Without it, GitHub doesn't run the `Check`
   workflow on the bot's PRs, and they can only be merged by bypassing the rules.
4. Optional: the variable `GEMINI_MODEL` to use a specific model. By default
   it tries `gemini-3.8-flash` and falls back to older Flash models.

Note: on the free tier, Google may use prompts and responses to improve its
products. The script only sends public info (the persona and post titles).

## Continuous integration

Every pull request runs `.github/workflows/check.yml`: a clean `npm ci`, a
type check (`npm run check`) and a full build. If either step fails, the PR
shows a red check before anything reaches `main`.

## Adding a project

1. Copy `src/content/projects/_template.md` to `src/content/projects/<slug>.md`.
   The filename becomes the URL: `/projects/<slug>`.
2. Put the screenshots in `src/assets/projects/<slug>/` (PNG, JPG or WebP, any
   size) and list them in `images`. Astro generates responsive WebP versions,
   and the first image is used as the cover and the social preview.
3. Write the case study below the frontmatter (challenge, what you built,
   results). It is optional; projects without it only show the gallery.

The frontmatter is validated in `src/content.config.ts`, so a missing field or
a wrong image path fails the build with a clear error.
