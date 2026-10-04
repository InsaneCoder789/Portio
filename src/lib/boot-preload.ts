import { getImageProps } from "next/image";

type ImageSource = { src: string; srcSet?: string; sizes?: string; currentSrc?: string };
export type BootProgress = { completed: number; total: number; failed: number; finished: boolean };
// Warm the browser's compressed HTTP cache, not a permanent decoded-image heap.
export function resolveBootImageUrl(source: ImageSource, viewport = window.innerWidth, dpr = window.devicePixelRatio || 1) {
  if (source.currentSrc) return source.currentSrc;
  if (!source.srcSet) return source.src;
  const choices = source.srcSet.split(",").map(choice => {
    const [url, descriptor] = choice.trim().split(/\s+/);
    return { url, width: Number.parseInt(descriptor, 10) };
  }).filter(choice => Number.isFinite(choice.width)).sort((a, b) => a.width - b.width);
  let displayWidth = viewport;
  for (const size of (source.sizes ?? "100vw").split(",")) {
    const media = size.match(/\((max|min)-width:\s*(\d+)px\)/);
    if (media && (media[1] === "max" ? viewport > Number(media[2]) : viewport < Number(media[2]))) continue;
    const length = size.match(/([\d.]+)(vw|px)\s*$/);
    if (length) { displayWidth = Number(length[1]) * (length[2] === "vw" ? viewport / 100 : 1); break; }
  }
  return (choices.find(choice => choice.width >= displayWidth * dpr) ?? choices.at(-1))?.url ?? source.src;
}

export function collectBootImages() {
  const images: ImageSource[] = Array.from(document.images).map(image => ({ src: image.src, currentSrc: image.currentSrc || undefined, srcSet: image.srcset || undefined, sizes: image.sizes || undefined }));
  const desktopMask = matchMedia("(min-width: 769px) and (hover: hover) and (pointer: fine)").matches;
  for (const src of ["/transparent1.png", "/transparent2.png"]) {
    const { props } = getImageProps({ src, alt: "", width: 1536, height: 1536, sizes: "(max-width: 768px) 100vw, 65vw", unoptimized: desktopMask });
    images.push({ src: props.src, srcSet: props.srcSet, sizes: props.sizes });
    if (desktopMask) images.push({ src: src.replace(".png", "-fill-mask.png") });
  }
  images.push({ src: "/logos/theme/rcb-mark.png" }, { src: "/logos/theme/mib-mark.png" });
  return [...new Map(images.map(image => {
    const source = { ...image, src: new URL(image.src, location.href).href };
    return [`${source.src}|${source.srcSet ?? ""}|${source.sizes ?? ""}`, source];
  })).values()];
}

export async function cacheBootResource(url: string, signal: AbortSignal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  if (signal.aborted) abort();
  const timeout = setTimeout(abort, 12000);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "force-cache" });
    if (!response.ok) throw new Error(`Resource unavailable: ${response.status}`);
    // Drain the stream without accumulating a full Blob/ArrayBuffer or decoded pixels.
    if (response.body) {
      const reader = response.body.getReader();
      try { while (!(await reader.read()).done) { /* Let each network chunk become collectible. */ } }
      finally { reader.releaseLock(); }
    }
  } finally { clearTimeout(timeout); signal.removeEventListener("abort", abort); }
}

/** A small pool avoids saturating slow mobile connections or decoding all images at once. */
export async function preloadBootAssets(signal: AbortSignal, update: (progress: BootProgress) => void) {
  if (signal.aborted) return;
  const images = [...new Set(collectBootImages().map(image => new URL(resolveBootImageUrl(image), location.href).href))];
  const progress: BootProgress = { completed: 0, total: images.length + 1, failed: 0, finished: false };
  const report = () => { if (!signal.aborted) update({ ...progress }); };
  report();
  let index = 0;
  const worker = async () => {
    while (index < images.length && !signal.aborted) {
      const source = images[index++];
      try { await cacheBootResource(source, signal); } catch { progress.failed++; }
      progress.completed++; report();
    }
  };
  const fonts = async () => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let abort = () => {};
    try {
      await Promise.race([
        Promise.all([
          ...[400,600,700,800].map(weight => document.fonts.load(`${weight} 16px "Outfit"`)),
          ...[400,700].map(weight => document.fonts.load(`${weight} 16px "JetBrains Mono"`)),
          ...[400,500,700].map(weight => document.fonts.load(`${weight} 16px "Space Grotesk"`)),
          document.fonts.ready,
        ]),
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Font preload timed out")), 12000); }),
        new Promise((_, reject) => {
          abort = () => reject(new Error("Font preload cancelled"));
          signal.addEventListener("abort", abort, { once: true });
          if (signal.aborted) abort();
        }),
      ]);
    } catch { progress.failed++; }
    finally { clearTimeout(timer); signal.removeEventListener("abort", abort); progress.completed++; report(); }
  };
  await Promise.all([fonts(), ...Array.from({ length: window.innerWidth <= 720 ? 1 : 2 }, worker)]);
  // Decode only existing first-viewport images, sequentially; leave off-screen pixels evictable.
  for (const image of Array.from(document.images)) {
    if (signal.aborted) return;
    const bounds = image.getBoundingClientRect();
    if (bounds.width && bounds.height && bounds.bottom > 0 && bounds.top < window.innerHeight) {
      try { await image.decode(); } catch { /* Existing image fallback remains usable. */ }
    }
  }
  progress.finished = true; report();
}
