import { useEffect, useState, type RefObject } from "react";

export const CAROUSEL_DELAY = 3200;

/** One cancellable timer, never a frame loop. Observe the deck, not the long dossier. */
export function useCarouselAutoplay(
  stage: RefObject<HTMLDivElement>,
  enabled: boolean,
  activity: number,
  advance: () => void,
) {
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    const syncVisibility = () => setVisible(document.visibilityState === "visible");
    syncMotion();
    syncVisibility();
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= .25), { threshold: [0, .25] })
      : null;
    if (stage.current) observer?.observe(stage.current);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [stage]);

  const running = enabled && inView && visible && !reducedMotion;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(advance, CAROUSEL_DELAY);
    return () => window.clearTimeout(timer);
  }, [running, activity, advance]);

  return { running, reducedMotion };
}
