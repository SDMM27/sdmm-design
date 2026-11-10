const DURATION = 1600;

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/**
 * Compteur animé : chaque élément `[data-count-to]` passe de 0 à sa valeur en 1,6 s (easing out cubic),
 * lancé quand il entre dans la fenêtre. Les décimales suivent celles de `data-count-to`.
 * Sans IntersectionObserver ou avec prefers-reduced-motion, la valeur finale s'affiche immédiatement.
 * Renvoie une fonction de nettoyage.
 */
export function initCountUp(selector = '[data-count-to]'): () => void {
  if (typeof document === 'undefined') return () => {};
  const items = [...document.querySelectorAll<HTMLElement>(selector)].filter((el) => el.dataset.countTo !== undefined);
  if (!items.length) return () => {};

  const fmt = (el: HTMLElement) => {
    const raw = el.dataset.countTo ?? '0';
    const decimals = raw.includes('.') ? raw.split('.')[1]!.length : 0;
    const nf = new Intl.NumberFormat(document.documentElement.lang || undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return (n: number) => nf.format(n);
  };
  const finish = (el: HTMLElement) => {
    el.textContent = fmt(el)(Number(el.dataset.countTo));
  };

  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(finish);
    return () => {};
  }

  const frames = new Set<number>();
  const run = (el: HTMLElement) => {
    const to = Number(el.dataset.countTo);
    if (!Number.isFinite(to)) return;
    const format = fmt(el);
    const start = performance.now();
    el.textContent = format(0);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      el.textContent = format(to * easeOutCubic(t));
      if (t < 1) frames.add(requestAnimationFrame(tick));
      else finish(el);
    };
    frames.add(requestAnimationFrame(tick));
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          run(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.3 },
  );
  items.forEach((el) => io.observe(el));
  return () => {
    io.disconnect();
    frames.forEach(cancelAnimationFrame);
    items.forEach(finish);
  };
}
