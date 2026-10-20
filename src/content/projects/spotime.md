---
name: Spoti-Me
category: app
description: "Personal Spotify stats: your top artists, listening streaks, a musical personality and achievements, built from your real history."
order: 6
url: https://spoti-me.vercel.app/
stack: [Astro, React, Tailwind, Prisma, MySQL]
accent: "#1ed760"
images:
  - ../../assets/projects/spotime/1.webp
  - ../../assets/projects/spotime/2.webp
  - ../../assets/projects/spotime/3.webp
  - ../../assets/projects/spotime/4.webp
  - ../../assets/projects/spotime/5.webp
  - ../../assets/projects/spotime/6.webp
mobile:
  - ../../assets/projects/spotime/mobile-1.webp
  - ../../assets/projects/spotime/mobile-2.webp
  - ../../assets/projects/spotime/mobile-3.webp
---

## The challenge

Spotify only tells you what you listened to once a year, in Wrapped. I wanted
that feeling every day: real numbers from my own history, and something fun
enough that my friends would connect their accounts too.

## What I built

A full-stack app that signs in with Spotify, syncs your listening history in
the background and turns it into stats, a personality and a few games.

- **Your history, kept.** Spotify's API only returns your last 50 plays, so a
  cron job syncs every account and stores the full history in MySQL through
  Prisma. Everything else is calculated from that.
- **Stats that read like a story.** Plays, unique songs and artists, your top
  day and hour, and how many nights of sleep your listening time adds up to,
  for the last 7 days, the month, the year or all time.
- **A musical personality.** An archetype with its own colors, a "musical age"
  and an AI roast of your habits written by Gemini, all shareable as an image
  generated on the server.
- **Reasons to come back.** Daily streaks, ten achievements, a monthly listeners
  ranking with live reactions, a daily "Mystery Track" guessing game and a
  weekly email digest.
- **Security from the start.** OAuth2 with PKCE, Spotify tokens encrypted with
  AES-256-GCM, sessions stored only as hashes, and an option to export or
  delete all your data.
