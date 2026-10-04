# Systems core artwork

Generated using the built-in image-generation tool. Source: `public/objects/systems-core-source.png`; transparent optimized display asset: `public/objects/systems-core.webp` (640 × 640).

Prompt: isolated machined graphite titanium systems-core cube, brushed-silver beveled panels, recessed copper seams, warm amber front lens and a restrained blue status light; connected solid form, three-quarter product view, studio lighting, transparent background, no text, rings or floating pieces.

The image is now only the loading/WebGL-failure fallback. `SystemsSculpture.tsx` loads `src/lib/systems-core-model.ts`, which builds a real Three.js model locally: rounded graphite hull, curved segmented silver armor, copper seams, recessed sockets, graphite shoulder caps, a blue side indicator and a multi-ring amber lens. Small deterministic canvas textures supply brushed-metal grain and internal lens illumination. Static geometry is batched into at most eight material meshes. It is reference-inspired procedural geometry, not an exact reconstruction or a to3D-generated GLB. The to3D widget's local upload control could not be operated through available automation.

The camera and model position remain fixed; pointer drag rotates only the model around X/Y. Arrow keys rotate and Home restores the initial angle. Idle rotation renders at 30 Hz, dragging at up to 60 Hz; rendering stops off-screen or in hidden tabs. Reduced-motion users receive a stationary model with on-demand interaction. The scene loads only when its reserved container enters view. Geometry, materials, environment target, renderer, event handlers and observers are disposed on unmount. The base uses the earlier soft radial glow rather than a cone or layered projection shapes.
