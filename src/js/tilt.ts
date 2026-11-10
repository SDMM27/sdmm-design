export interface TiltOptions {
  /** Éléments à incliner. Défaut : `.sd-tilt`. */
  selector?: string;
  /** Inclinaison maximale en degrés. Défaut : 4. */
  max?: number;
}

/**
 * Léger tilt 3D au survol (variables --rx / --ry lues par `.sd-tilt`).
 * Pointeur fin uniquement, désactivé avec prefers-reduced-motion. Renvoie une fonction de nettoyage.
 */
export function initTilt(options: TiltOptions = {}): () => void {
  if (typeof document === 'undefined') return () => {};
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const max = options.max ?? 4;
  const cleanups: Array<() => void> = [];
  document.querySelectorAll<HTMLElement>(options.selector ?? '.sd-tilt').forEach((card) => {
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', `${(px * max * 2).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-py * max * 2).toFixed(2)}deg`);
    };
    const leave = () => {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    };
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', leave);
      leave();
    });
  });
  return () => cleanups.forEach((fn) => fn());
}
