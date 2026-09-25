---
title: "Behind the scenes of this portfolio"
description: "Astro 7, shared element transitions, a native command palette and a few secrets: the decisions behind this site and the gotchas I hit."
pubDate: 2026-09-24
tags: ["Astro", "View Transitions", "Tailwind CSS"]
ai: true
---

A portfolio is the one project where nobody tells you "that's out of scope". That's dangerous. So I set myself one rule for this site: every fancy detail has to be cheap for the visitor. It should be static by default, JavaScript only where it earns its place, and nothing that makes a slow phone suffer.

Here's how that rule shaped the pieces you can see and a few you can't.

## Static first, with one exception

The whole site is built with Astro 7 and prerendered to plain HTML. Pages, project case studies, this blog and even the Open Graph images are generated at build time.

The only thing that runs on a server is the little "now playing" pill in the hero. It needs a secret Spotify token, so it lives in an endpoint that opts out of prerendering:

```ts
// src/pages/api/now-playing.ts
export const prerender = false;
```

Its response is cached at the edge for 30 seconds, so a thousand visitors cost the same as one. If Spotify isn't configured, the pill never shows up at all. No empty states, no spinners.

## Shared element transitions

Open a project and the cover image flies into the carousel while the title slides into the heading. That's the View Transitions API, and in Astro it's mostly one attribute on each side of the navigation:

```astro
<!-- In the list -->
<h2 transition:name={`project-title-${id}`}>{project.name}</h2>

<!-- On the detail page -->
<h1 transition:name={`project-title-${id}`}>{data.name}</h1>
```

Same name, two pages, and the browser morphs one into the other.

### The gotcha: blur disappears

I gave the floating dock a transition name so it would stay put between pages, and its frosted glass effect vanished. An element with a `view-transition-name` becomes a *backdrop root*, so `backdrop-filter` on its children has nothing behind them to blur.

The fix was to move the name from the `<nav>` wrapper to the element that has the blur itself. It's a small thing, but it cost me a good while of staring at CSS that was "obviously correct".

## A command palette with the native dialog

Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>⌘</kbd> + <kbd>K</kbd>) anywhere. It opens a palette to jump to pages, projects and posts, copy my email or download my CV.

It's built on `<dialog>`, which does a lot of the hard work for free:

- `showModal()` traps focus and makes the rest of the page inert.
- <kbd>Esc</kbd> closes it without a single line of code.
- The `::backdrop` pseudo-element is styleable, so Tailwind's `backdrop:` variant handles the dimmed, blurred background.

On top of that sits the combobox pattern: the input keeps focus, and `aria-activedescendant` tells screen readers which option is highlighted as you move with the arrow keys.

## Tailwind for (almost) everything

Styles are Tailwind CSS 4 utilities, with plain CSS only when there's no other way. Modern variants remove a surprising amount of JavaScript:

```html
<!-- Lock page scroll while the palette is open, no JS involved -->
<html class="has-[#cmdk[open]]:overflow-hidden">
```

The reading progress bar at the top of this post works the same way. It's a CSS scroll-driven animation (`animation-timeline: scroll()`), so there are zero scroll listeners.

## Open Graph images that design themselves

Share any page and you get a branded preview card. They're generated at build time with Satori, which turns a JSX-like tree into an SVG. Resvg then converts that to PNG.

One lesson learned: Satori's support for layered radial gradients is limited. The aurora glow behind the text is really a blurred SVG, rasterized once with Sharp and reused for every image.

## The WebGL background, on a diet

The aurora behind every page is a WebGL shader, and shaders can easily burn battery. It renders at half resolution because it's a blur anyway, so nobody notices. It also stops completely when the tab is hidden or when you prefer reduced motion.

## Safety nets

Every pull request runs a type check and a full build in GitHub Actions, and `main` can't be merged into without them passing. That includes the pull requests that add posts to this blog.

## Wrapping up

None of these features is hard on its own. The work is in the details: the blur that disappears, the palette that has to be accessible, the shader that shouldn't drain your battery. That's also the part I enjoy most.

Oh, and there's at least one secret hidden on this site. If you grew up with a game controller, you might already know the code.
