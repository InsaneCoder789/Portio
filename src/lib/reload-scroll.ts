// Run before hydration so browser restoration cannot reveal a lower chapter.
// Ordinary links and back/forward navigation retain their normal behavior.
export const reloadScrollScript = `(() => {
  if (performance.getEntriesByType('navigation')[0]?.type !== 'reload') return;
  history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  const reset = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  reset();
  window.addEventListener('pageshow', reset, { once: true });
  window.addEventListener('pagehide', () => { history.scrollRestoration = 'auto'; }, { once: true });
})();`;
