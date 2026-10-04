# Project carousel research

Reviewed 2026-10-04. The four existing case studies are preserved; the five additions are based on their public repositories, not invented deployment outcomes or user metrics.

## Reference composition

Read the Ignithon2.0 hall lobby (`src/app/hall/[hall]/hall-display.js`) and its five-slot card styles in `src/app/globals.css`: raised center, angled neighbors, looping selection. Portfolio adaptation uses CSS transform/opacity transitions, pointer swipes, keyboard controls, and a single selected dossier. Existing portfolio typography and themes are preserved.

### Autoplay and performance

The deck loops every 3.2 seconds with a 900ms transform transition and a 104% card pitch (previously 110%). No hover pause, per-frame JavaScript loop, animated blur, or permanent `will-change` layers. One cancellable timeout is active only while at least 25% of the deck is visible, the document is visible, and reduced motion is off. Keyboard focus and the local pause icon suspend autoplay; manual selection restarts its countdown. Reading the dossier after scrolling past the deck does not keep switching projects. Visibility/motion listeners, the intersection observer, timer, and existing resize observer are cleaned up on unmount. Image sizes follow the actual responsive card width. Device-specific CPU/FPS guarantees require hardware profiling; the carousel does not control the existing Three.js scene.

## Cover updates and brief analysis

The supplied MGHSIS artwork is retained as `mghsis-user-card.png`; the active export is `mghsis-cover.webp`. IncidentLens and StayPilot use new generated `incidentlens-cover.webp` and `staypilot-cover.webp`; their previous SVGs remain available. All three new exports are 1600×900 WebP, with the complete artwork preserved. `scripts/export-project-card.mjs` normalizes export dimensions and compression. The generated covers are conceptual product illustrations, not screenshots of the running apps. Prompts are recorded in [project-card-prompts.md](project-card-prompts.md).

Every project now includes an editorial engineering analysis linked to its README. Additional primary references: [Rail](https://github.com/InsaneCoder789/Rail#readme), [Lakshman-Rekha](https://github.com/InsaneCoder789/Lakshman-Rekha#readme), [K1000](https://github.com/InsaneCoder789/K1000#readme), [KYLR](https://github.com/InsaneCoder789/KYLR#readme). K1000's program interface, simulated telemetry, and KYLR's unverified compliance claims are distinguished from deployed or independently certified results.

## New systems

- [IncidentLens](https://github.com/InsaneCoder789/IncidentLens): README and `docs/architecture.md`; evidence ingestion, citation-aware retrieval, investigation agents, durable jobs, approval boundaries, evaluation. Existing `docs/assets/incidentlens-banner.svg` reused from the local checkout.
- [StayPilot](https://github.com/InsaneCoder789/StayPilot): README and `package.json`; multi-property operations, PostgreSQL/Prisma authority, connected room/guest workflows, transactional checkout and payments. Existing `public/readme-banner.svg` reused.
- [ClassSync](https://github.com/InsaneCoder789/ClassSync): README and `HybridEventClassifier.kt`; local Room/DataStore state, Compose views, Google Classroom and optional Gmail, confidence-policy-driven TFLite classification with rule fallback. Existing local `classSyncbanner.png` reused. Android closed testing is documented, not broad adoption.
- [MGHSIS](https://github.com/InsaneCoder789/SIH2026-MGHSIS): README and `docs/Architecture.md`; sensor ingestion, risk engines, Digital Twin, intervention simulation. README reflects a newer runtime than the architecture document's older 300-band demo description; avoid asserting field deployment or real-world safety accuracy. Existing `docs/assets/mghsis-readme-banner.png` reused. Hardware and field calibration remain boundaries.
- [OfflineQR Attendance](https://github.com/InsaneCoder789/offlineqr-attendance): README and `backend/app/main.py`; signed rotating challenges, device enrollment, Ed25519 proofs, offline outbox, central verification, faculty and ICT controls. Existing `assets/offlineqr-readme-banner.png` reused. Institutional identity, device integrity, and physical-device validation remain rollout requirements.

The new “Design takeaway” copy is editorial interpretation of these engineering decisions, not a claim that the author reported measured learning or deployed results. Upstream applications were reviewed, not independently executed or certified.

## Maintenance

Project content and ordering live in `src/features/portfolio/content.ts`. Add a preview under `public/projects/` and a complete content entry. GitHub metadata only enriches that curated set; missing repositories or API failures must not remove cards. SVG previews use local, trusted assets without remote SVG optimization. All nine projects share one deck and selected-detail component.
