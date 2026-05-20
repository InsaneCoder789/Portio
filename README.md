# Rohan Chatterjee Portfolio

An immersive portfolio site built with React, TypeScript, Vite, GSAP, and Three.js.

The current experience is centered around:
- a cinematic desktop hero with an interactive Death Star scene
- a boot screen that plays on reload while the app settles behind it
- editorial full-screen sections for experience, selected works, skills, GitHub telemetry, and contact
- a separate mobile-optimized layout

## Tech Stack

- React 18
- TypeScript
- Vite
- GSAP
- Three.js
- Tailwind CSS utilities
- Framer Motion

## Project Structure

```text
.
├── public/
│   ├── profile.jpg
│   ├── Rohan_Chatterjee_Resume.pdf
│   └── logos/
├── src/
│   ├── components/
│   │   ├── DeathStarScene.tsx
│   │   ├── KaliBootScreen.tsx
│   │   └── ParticleBackground.tsx
│   ├── data/
│   │   └── linkedin.ts
│   ├── features/
│   │   └── portfolio/
│   │       └── content.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Current App Notes

- The app opens with a custom boot screen before revealing the main portfolio.
- The About section uses a custom Three.js hero scene on desktop.
- Mobile keeps a lighter, more constrained presentation for readability.
- Content for experience, projects, skills, and GitHub display is centralized in `src/features/portfolio/content.ts`.

## Scripts

- `npm run dev` — start local development
- `npm run build` — create a production build
- `npm run preview` — preview the built app
- `npm run lint` — run ESLint
- `npm run test` — run tests

## Status

This repository has been cleaned so that the live portfolio path is much smaller than the original prototype tree. Legacy unused components, old pages, stale hooks, test stubs, and unused public assets have been removed.
