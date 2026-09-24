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
public/             static assets (CV, images, music, OG image)
src/
├── components/     navbar, footer, icons, sections and UI pieces
├── constants/      content: jobs, projects, skills, music tracks
├── layouts/        base layout with SEO / Open Graph metadata
├── pages/          home, about, projects, projects/[slug], skills
└── styles/         global Tailwind entry and custom CSS
```

## Adding a project

Add an entry to `projects` in `src/constants/home.ts`. Screenshots go in
`public/images/projects/` (WebP, ~1920px wide) and are listed in the `images`
array; a detail page is generated automatically at `/projects/<slug>`.
