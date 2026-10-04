# Mobile readiness and scroll repair

This is a targeted repair of v2, not a redesign. The debugging skill guided reproduction and ownership-layer fixes; the frontend builder skill guided responsive comparison against the existing composition. No new mockup or generated asset was needed.

## Changes

- GitHub profile, repositories and contributions resolve independently, validate HTTP status/schema, support cancellation and retry, and show unknown readings as an em dash. Contribution years and calendar dates are no longer hardcoded or shifted by UTC conversion.
- Chapter headings are always visible in native document flow. ScrollTrigger's heading-only fades and global resize/refresh registration were removed: its refresh implementation resets/restores scroller position, which is unnecessary for this unpinned page. GSAP's initial Hero/nav motion and 3D weapon timelines remain.
- Hero/About glow timelines stay attached and pause/resume without restarting when the boundary enters/leaves the viewport. Mobile glow stays static. Other off-screen lighting/marquee work remains bounded. The Hero canvas permits native vertical touch scrolling (`pan-y`) instead of capturing the entire vertical gesture.
- Shared passive scroll activity suspends idle WebGL draws during scrolling and resumes 140ms after settling. Dragging/firing retains priority. Invisible laser cylinders are excluded from rendering. Mobile systems-core DPR is capped at 1.
- Removed the carousel's whole-page ScrollTrigger refresh on every dossier resize. Native scrolling remains; no extra smooth-scroll library.
- Removed the double navbar anchor offset. Narrow headings do not split words. Menus have bounded height, scrolling, 44px controls, theme-matched surfaces and Escape/outside dismissal.
- Contact retains its portrait, contour texture, marquee and both themes. Narrow layouts reserve room for social links and two 48px action links; tablets use a shorter composition.

## Boot contract

The terminal's staged log is decorative. The progress bar represents actual readiness. Opening requires the minimum log time, successful responsive image/font preloading, and completion (or a static WebGL fallback) of the About systems-core setup. Scene shader compilation/first draw happens behind the boot screen.

The original decoded-image retention was a memory regression and has been removed. The preload pool now warms compressed HTTP resources through a streaming reader (one mobile worker, two desktop workers), without constructing off-screen Image clones or holding their decoded pixel buffers. It includes all rendered project/skill/company images, both responsive Contact themes, and desktop masks only on appropriate devices. Only existing first-viewport images are decoded sequentially; browser-managed off-screen image memory remains evictable. Fonts are awaited. Background scrolling and controls are inert during boot. Requests, timers and listeners clean up on unmount/retry. Slow/failed loading never silently claims success: retry or explicitly continue with available visuals.

About GPU warm-up starts after this preload stage, uses `compileAsync` (parallel shader compilation when supported), then performs one first draw. Mobile uses compact tessellation with geometry buffers below 70% of the full model in tests, and a 64px PMREM environment instead of the previous 256px map. Desktop environment size is 128px. `high-performance` is a GPU selection hint, not a guarantee of a dedicated GPU; image/network work cannot universally be moved to GPU shaders.

This is active-visit preloading, not a service-worker offline application. A network failure before assets arrive cannot be solved by preloading. Browser memory pressure, viewport changes requiring new image sizes, external links, résumé navigation and live APIs remain outside a full-offline guarantee.

## Fidelity / copy ledger

| Comparison to existing v2 | Result |
| --- | --- |
| RCB red/gold/navy identity and silver-suit identity | Preserved; both Contact themes visually reviewed |
| Portrait, name, social links, contour lines and marquee | Preserved; portrait no longer competes with mobile action row |
| Main headings and project content | Copy unchanged; mid-word heading breaks removed |
| Navbar identity and logo-only theme control | Preserved; pale mobile button replaced with dark outlined control |
| Rounded chapter/card hierarchy | Preserved; chapter scroll-reveal/refresh removed |
| Telemetry labels and graph | Preserved; factual loading/error/status/retry copy added |
| Boot terminal visual identity | Preserved; real loading progress and explicit recovery actions added |

## Verification

Checked 320px, 390px, 768px and desktop viewports without document horizontal overflow. Checked menu open/close, Escape, navigation to Contact and both themes. At 390px, Contact starts at approximately y=88 below the navbar and ends at y=753; action targets measure at least 48px high. Live GitHub values resolved in the browser. Boot's background inert state and real progress were observed, followed by release to working navigation.

27 tests pass, including HTTP/schema failures, scroll suspend/resume cleanup, preload manifests/cancellation, compressed streaming without image clones, responsive URL selection, the compact geometry budget, and boot gates that cannot release on the timer alone. Build passes; lint has no errors and one pre-existing layout export warning. `git diff --check` passes.

No physical-device GPU/FPS trace or browser-throttled network experiment was performed. Network failure/recovery gates were tested with controlled unit states. Do not interpret the changes as a measured FPS or battery guarantee. Existing reduced-motion rules remain in place.

## Hero → About follow-up

The remaining ScrollTrigger dependency was only driving chapter heading fades. Inspection of the installed library showed `_refreshAll` temporarily setting scroller position to zero and then restoring it, while auto-refresh listens to viewport resize. This is an unnecessary scroll owner for an unpinned native-scrolling page, so the dependency/registration and heading triggers have been removed. This avoids that mechanism rather than adding another smooth-scroll layer.

At a 390px viewport, resizing height from 844px to 760px at the About anchor preserved scrollY=1182.5, Hero height=1168.34375 and About document top=1270.734375. About heading opacity stayed 1 and transform stayed none. A reverse scroll across the seam also preserved the document geometry. These are layout/position checks, not a guarantee of physical-device FPS. A full reload is necessary to clear old plugin listeners if the development session previously loaded ScrollTrigger through hot reload.
