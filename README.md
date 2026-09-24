# AMG - devel

Personal portfolio of **Carlos Maza**, frontend developer from Barranquilla, Colombia.

Live: [amg-devel.vercel.app](https://amg-devel.vercel.app)

## Stack

- [Astro 5](https://astro.build) with view transitions
- [Tailwind CSS 4](https://tailwindcss.com)
- React islands for the animated backgrounds (`Aurora`, `Hyperspace`, built on [OGL](https://github.com/oframe/ogl))

## Getting started

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # output in ./dist
npm run preview   # serve the production build
```

## Project structure

```text
public/
├── images/
│   ├── companies/  logos for the experience list
│   └── music/      album covers
└── music/          audio tracks
src/
├── assets/
│   └── projects/   project screenshots (optimized by Astro)
├── components/
│   ├── backgrounds/  Aurora and Hyperspace (React + OGL)
│   ├── icons/        SVG icons (skills/ for tech logos)
│   ├── layout/       navbar and footer
│   ├── music/        music player and its spinning disk
│   ├── sections/     page sections (home/)
│   └── ui/           reusable pieces: card, carousel
├── content/
│   └── projects/   one Markdown file per project (case studies)
├── data/           content: experience, skills, social links, tracks
├── layouts/        base layout with SEO / Open Graph metadata
├── pages/          home, about, projects, projects/[slug], skills, 404
└── styles/         global Tailwind entry and custom CSS
```

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
