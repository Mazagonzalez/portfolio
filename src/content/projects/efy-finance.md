---
name: EFY Finance
category: app
description: "Financial platform for personal and corporate accounts, backed by iOS and Android apps."
order: 2
url: https://app.efyfinance.com/
stack: [Laravel, Livewire, Tailwind, AlpineJS]
accent: "#d9b77e"
images:
  - ../../assets/projects/efy-finance/1.webp
  - ../../assets/projects/efy-finance/2.webp
  - ../../assets/projects/efy-finance/3.webp
  - ../../assets/projects/efy-finance/4.webp
mobile:
  - ../../assets/projects/efy-finance/mobile-1.webp
  - ../../assets/projects/efy-finance/mobile-2.webp
  - ../../assets/projects/efy-finance/mobile-3.webp
---

## The challenge

EFY holds dollars as stablecoins and crypto across several networks, moves
money between users, external wallets and bank accounts, and issues a Visa card
on top of it. The web app had to make all of that feel as simple and as safe as
a bank, and match what users already do in the iOS and Android apps.

## What I built

- **One glance at your money.** The dashboard puts the total balance, the three
  main actions (receive, send, convert), recent movements, the card and every
  wallet on a single screen.
- **The same pattern for every transfer.** Sending, converting and withdrawing
  share one layout: the form on the left, your balances on the right and the
  fee and total spelled out before you confirm, so nothing feels new twice.
- **Live forms without a SPA.** Livewire and Alpine keep totals, fees and
  account lists in sync as you type, while Laravel stays the single source of
  truth for anything that touches money.
- **Card controls in one place.** Reload, lock, transfer, change the PIN and
  download statements without leaving the card screen.
- **A phone layout that matches the apps.** On mobile the sidebar becomes a
  menu and every card and action is resized for one hand.
