import { useEffect, useState, type RefObject } from "react";

export const CAROUSEL_DELAY = 3200;

/** One cancellable timer, active only while the project section is on screen. */
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
      ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 })
      : null;
    if (stage.current) observer?.observe(stage.current.closest("#projects") ?? stage.current);
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
