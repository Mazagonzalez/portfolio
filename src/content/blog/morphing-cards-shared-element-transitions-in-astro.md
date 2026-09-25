---
title: "Morphing cards: shared element transitions in Astro"
description: "Turn a card into its detail page with Astro's View Transitions: two attributes, no animation library, and the gotchas worth knowing."
pubDate: 2026-09-25
tags: ["Astro","View Transitions","CSS"]
ai: true
---

You click a card, and instead of a hard page load, the image grows into the hero of the next page while the title slides into place. That's a shared element transition, and it makes a site feel like one connected thing instead of a stack of separate pages.

This used to mean an animation library, a single-page app and a fair amount of state juggling. With Astro and the browser's View Transitions API, it's two attributes and a bit of care.

## How it works

When you navigate, the browser captures a snapshot of the current page, renders the new one, and then animates between them. Elements that share the same `view-transition-name` on both pages are treated as the same element. The browser animates their position and size and crossfades their content.

In Astro you need two things:

1. The `<ClientRouter />` component in your layout.
2. The same `transition:name` on the matching elements of both pages.

## Step 1: Enable the client router

Add `<ClientRouter />` to the `<head>` of your layout. It intercepts link clicks and swaps pages on the client, so the browser can animate between them instead of doing a full reload.

```astro
---
// src/layouts/Layout.astro
import { ClientRouter } from 'astro:transitions';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My Portfolio</title>
    <ClientRouter />
  </head>
  <body class="bg-zinc-950 text-zinc-100">
    <slot />
  </body>
</html>
```

## Step 2: Build the card

In a list, every card needs its own transition name. If all of them used a static `transition:name="card-image"`, there would be several elements with the same name on the page, and the browser would skip the transition.

So the name includes the item's ID:

```astro
---
// src/components/Card.astro
interface Props {
  id: string;
  title: string;
  image: string;
}

const { id, title, image } = Astro.props;
---
<a href={`/items/${id}`} class="group block overflow-hidden rounded-2xl bg-zinc-900 p-4 transition-transform hover:scale-[1.02]">
  <div class="overflow-hidden rounded-xl">
    <img
      src={image}
      alt={title}
      class="aspect-video w-full object-cover"
      transition:name={`image-${id}`}
    />
  </div>
  <h3
    class="mt-4 text-xl font-bold text-white"
    transition:name={`title-${id}`}
  >
    {title}
  </h3>
  <p class="mt-2 text-sm text-zinc-400">Click to learn more about this project.</p>
</a>
```

Each card gets its own pair of names, like `image-project-a` and `title-project-a`. Astro turns `transition:name` into a CSS `view-transition-name` on that element, so you never have to write it by hand.

## Step 3: Create the detail page

On the destination page, use exactly the same names on the image and the title:

```astro
---
// src/pages/items/[id].astro
import Layout from '../../layouts/Layout.astro';

export function getStaticPaths() {
  return [
    { params: { id: 'project-a' }, props: { title: 'Project Alpha', image: '/images/alpha.jpg' } },
    { params: { id: 'project-b' }, props: { title: 'Project Beta', image: '/images/beta.jpg' } },
  ];
}

const { id } = Astro.params;
const { title, image } = Astro.props;
---
<Layout title={title}>
  <main class="mx-auto max-w-3xl px-4 py-12">
    <a href="/" class="mb-8 inline-block text-sm text-zinc-400 hover:text-white">&larr; Back to list</a>

    <img
      src={image}
      alt={title}
      class="aspect-video w-full rounded-3xl object-cover shadow-2xl"
      transition:name={`image-${id}`}
    />

    <h1
      class="mt-8 text-4xl font-bold tracking-tight text-white md:text-5xl"
      transition:name={`title-${id}`}
    >
      {title}
    </h1>

    <p class="mt-6 text-lg leading-relaxed text-zinc-300">
      This is the detail page. The image and the title above morphed from the card on the list.
    </p>
  </main>
</Layout>
```

That's all it takes. The browser handles the positions and sizes, and pressing back plays the transition in reverse.

## Four gotchas worth knowing

### 1. Keep aspect ratios consistent

If the card image is a 16:9 crop and the detail image is a 4:5 portrait, the content gets stretched during the morph. Use the same aspect ratio on both sides, or at least `object-fit: cover` on both images so the content is cropped instead of distorted.

### 2. Big jumps in text size can look blurry

During the transition, the browser scales a snapshot of the element. A title that goes from `text-xl` to `text-5xl` can look soft for a few frames. Keeping the same font weight on both pages (both examples above use `font-bold`) helps the morph read as one element.

### 3. Respect reduced motion

Some people get dizzy from large on-screen motion, and others just prefer a calmer interface. Turn the animations off for them:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

### 4. A transition name can break backdrop blur

I ran into this one on this very site. I gave the floating dock a transition name so it would stay put between pages, and its frosted glass effect disappeared. An element with a `view-transition-name` becomes a *backdrop root*, so `backdrop-filter` on its children no longer sees the page behind it.

The fix was to put the name on the element that has the blur itself, not on its wrapper.

## Wrapping up

Shared element transitions are a small detail with a big effect. With `<ClientRouter />` and a matching `transition:name` on each side, you get an app-like navigation without shipping an animation library. Just keep the four gotchas in mind so the morph looks smooth.
