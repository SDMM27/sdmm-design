const DURATION = 1600;
const easeOutCubic = (t) => 1 - (1 - t) ** 3;
/**
 * Compteur animé : chaque élément `[data-count-to]` passe de 0 à sa valeur en 1,6 s (easing out cubic),
 * lancé quand il entre dans la fenêtre. Les décimales suivent celles de `data-count-to`.
 * Sans IntersectionObserver ou avec prefers-reduced-motion, la valeur finale s'affiche immédiatement.
 * Renvoie une fonction de nettoyage.
 */
export function initCountUp(selector = '[data-count-to]') {
    if (typeof document === 'undefined')
        return () => { };
    const items = [...document.querySelectorAll(selector)].filter((el) => el.dataset.countTo !== undefined);
    if (!items.length)
        return () => { };
    const fmt = (el) => {
        const raw = el.dataset.countTo ?? '0';
        const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
        const nf = new Intl.NumberFormat(document.documentElement.lang || undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
        return (n) => nf.format(n);
    };
    const finish = (el) => {
        el.textContent = fmt(el)(Number(el.dataset.countTo));
    };
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        items.forEach(finish);
        return () => { };
    }
    const frames = new Set();
    const run = (el) => {
        const to = Number(el.dataset.countTo);
        if (!Number.isFinite(to))
            return;
        const format = fmt(el);
        const start = performance.now();
        el.textContent = format(0);
        const tick = (now) => {
            const t = Math.min(1, (now - start) / DURATION);
            el.textContent = format(to * easeOutCubic(t));
            if (t < 1)
                frames.add(requestAnimationFrame(tick));
            else
                finish(el);
        };
        frames.add(requestAnimationFrame(tick));
    };
    const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (e.isIntersecting) {
                run(e.target);
                io.unobserve(e.target);
            }
        }
    }, { threshold: 0.3 });
    items.forEach((el) => io.observe(el));
    return () => {
        io.disconnect();
        frames.forEach(cancelAnimationFrame);
        items.forEach(finish);
    };
}
