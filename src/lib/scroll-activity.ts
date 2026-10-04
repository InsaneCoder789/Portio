/** One passive listener shared by WebGL scenes; no React state or layout reads. */
const listeners = new Set<(scrolling: boolean) => void>();
let timer: ReturnType<typeof setTimeout> | undefined;
let scrolling = false;
const notify = (value: boolean) => {
  scrolling = value;
  listeners.forEach(listener => listener(value));
};
const onScroll = () => {
  if (!scrolling) notify(true);
  clearTimeout(timer);
  timer = setTimeout(() => notify(false), 140);
};
export function subscribeScrollActivity(listener: (scrolling: boolean) => void) {
  if (!listeners.size) window.addEventListener("scroll", onScroll, { passive: true });
  listeners.add(listener);
  listener(scrolling);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
      scrolling = false;
    }
  };
}
