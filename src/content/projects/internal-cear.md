---
name: CEAR Internal
category: app
description: "Internal tool where a small team tracks ideas, projects and tasks in list, board and calendar views."
order: 5
url: https://internal-cear.vercel.app/
stack: [Astro, React, Tailwind, shadcn/ui, Prisma, PostgreSQL]
accent: "#6d7cff"
images:
  - ../../assets/projects/internal-cear/1.webp
  - ../../assets/projects/internal-cear/2.webp
  - ../../assets/projects/internal-cear/3.webp
  - ../../assets/projects/internal-cear/4.webp
  - ../../assets/projects/internal-cear/5.webp
  - ../../assets/projects/internal-cear/6.webp
mobile:
  - ../../assets/projects/internal-cear/mobile-1.webp
  - ../../assets/projects/internal-cear/mobile-2.webp
  - ../../assets/projects/internal-cear/mobile-3.webp
---

## The challenge

A team of two to five people was juggling ideas, client projects and tasks
across chats and spreadsheets. They needed one place for all of it, fast
enough to use every day, and cheap enough to run entirely on free plans.

## What I built

A full-stack app with Astro on the server, React for the interactive views and
a Postgres database on Neon, deployed on Vercel.

- **From idea to delivered project.** Ideas are written down, evaluated and,
  once approved, turned into a project with client, folder, due date and
  progress.
- **Three ways to see the work.** Tasks show as a grouped list, a Kanban board
  where dragging saves status and order, or a calendar where dragging a task to
  another day changes its due date.
- **Details without leaving the page.** Each task opens in a side panel with
  subtasks, comments and `@` mentions, and its link can be shared.
- **A home page that says what's next.** Your open tasks, the week in numbers,
  active projects, recent ideas and the latest comments.
- **Built for the keyboard.** Search everything with Ctrl/⌘ K, `N` for a new
  task, `⇧N` for a new idea and `⇧T` to switch between light and dark.
- **The boring parts done right.** Email and GitHub sign-in with roles,
  invitations, notifications, a daily email digest and an optional "Improve
  with AI" button that rewrites descriptions with Claude, ChatGPT or Gemini.
