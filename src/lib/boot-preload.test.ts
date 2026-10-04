// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { collectBootImages, preloadBootAssets, cacheBootResource, resolveBootImageUrl } from "./boot-preload";

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); document.body.innerHTML = ""; });
describe("boot visual readiness", () => {
  it("includes every rendered card and both responsive Contact themes", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    document.body.innerHTML = '<img src="/projects/test.webp"><img src="/projects/test.webp">';
    const images = collectBootImages();
    expect(images.filter(image => image.src.endsWith("/projects/test.webp"))).toHaveLength(1);
    expect(images.filter(image => image.src.includes("transparent"))).toHaveLength(2);
    expect(images.filter(image => image.src.includes("transparent")).every(image => !!image.srcSet)).toBe(true);
    expect(images.some(image => image.src.includes("mib-mark"))).toBe(true);
  });
  it("preloads full-resolution masks only for desktop hover interactions", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("min-width") }));
    const images = collectBootImages();
    expect(images.filter(image => image.src.includes("fill-mask"))).toHaveLength(2);
    expect(images.filter(image => image.src.includes("transparent")).every(image => !image.srcSet)).toBe(true);
  });
  it("omits hidden desktop Contact portraits and masks on phones", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("max-width") }));
    document.body.innerHTML = '<div class="contact-desktop-portrait"><img src="/transparent1.png"></div><img src="/projects/test.webp">';
    const images = collectBootImages();
    expect(images.some(image => image.src.includes("transparent"))).toBe(false);
    expect(images.some(image => image.src.includes("/projects/test.webp"))).toBe(true);
    expect(images.some(image => image.src.includes("mib-mark"))).toBe(true);
  });
  it("does not publish progress after cancellation", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    Object.defineProperty(document, "fonts", { configurable: true, value: { ready: Promise.resolve(), load: vi.fn().mockResolvedValue([]) } });
    const controller = new AbortController();
    controller.abort();
    const update = vi.fn();
    await preloadBootAssets(controller.signal, update);
    expect(update).not.toHaveBeenCalled();
  });
  it("selects the responsive resource instead of fetching the largest image", () => {
    const source = { src: "/large.webp", srcSet: "/small.webp 384w, /medium.webp 640w, /large.webp 1536w", sizes: "(max-width: 720px) 70vw, 24vw" };
    expect(resolveBootImageUrl(source, 390, 1)).toBe("/small.webp");
    expect(resolveBootImageUrl(source, 390, 2)).toBe("/medium.webp");
  });
  it("drains compressed bytes without Image clones or retained pixel buffers", async () => {
    const image = vi.spyOn(window, "Image");
    const read = vi.fn().mockResolvedValueOnce({ done: false, value: new Uint8Array(16) }).mockResolvedValueOnce({ done: true });
    const releaseLock = vi.fn();
    const arrayBuffer = vi.fn();
    const fetcher = vi.fn().mockResolvedValue({ ok: true, body: { getReader: () => ({ read, releaseLock }) }, arrayBuffer });
    vi.stubGlobal("fetch", fetcher);
    await cacheBootResource("/card.webp", new AbortController().signal);
    expect(fetcher.mock.calls[0][1].cache).toBe("force-cache");
    expect(read).toHaveBeenCalledTimes(2);
    expect(releaseLock).toHaveBeenCalledTimes(1);
    expect(arrayBuffer).not.toHaveBeenCalled();
    expect(image).not.toHaveBeenCalled();
  });
});
