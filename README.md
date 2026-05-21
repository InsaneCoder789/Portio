# Rohan Chatterjee Portfolio

An immersive portfolio site built with Next.js, React, TypeScript, GSAP, and Three.js.

The experience includes:
- a cinematic desktop hero with an interactive Death Star scene
- a boot screen that appears on reload while the app settles behind it
- editorial sections for experience, selected works, skills, GitHub telemetry, and contact
- a mobile-optimized layout with lighter visuals

## Tech Stack

- Next.js 16
- React 18
- TypeScript
- GSAP
- Three.js
- Framer Motion
- Tailwind CSS utilities

## Project Structure

```text
.
├── public/
│   ├── favicon.ico
│   ├── favicon.png
│   ├── og-preview.png
│   ├── profile.jpg
│   ├── Rohan_Chatterjee_Resume.pdf
│   └── logos/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
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
│   └── index.css
├── next-env.d.ts
├── package.json
└── tsconfig.json
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

### Start the production server

```bash
npm run start
```

## Notes

- Metadata, Open Graph tags, Twitter cards, and favicon links live in `src/app/layout.tsx`.
- The main landing page is rendered through the App Router in `src/app/page.tsx`.
- Content for experience, projects, skills, GitHub display, and contact is centralized in `src/features/portfolio/content.ts`.
- `src/components/ParticleBackground.tsx` is kept in the repo, but not mounted in the current app.
