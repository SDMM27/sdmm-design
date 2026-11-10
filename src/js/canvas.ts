// Moteur canvas partagé (porté depuis le portfolio) : taille DPR-aware, couleurs lues dans les
// variables --sd-*, état du pointeur, pause hors écran / onglet masqué, et une seule image
// statique sous prefers-reduced-motion.

export interface Palette {
  bg: string;
  surface: string;
  surface2: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  accentStrong: string;
  accentInk: string;
  accent2: string;
  live: string;
  wip: string;
  danger: string;
}

export interface Pointer {
  x: number;
  y: number;
  inside: boolean;
  down: boolean;
}

export interface CanvasState {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  dpr: number;
  pointer: Pointer;
  colors: Palette;
  reduced: boolean;
  /** Secondes écoulées depuis le montage (n'avance pas en reduced motion). */
  time: number;
}

export interface CanvasHooks {
  frame(s: CanvasState, dt: number): void;
  resize?(s: CanvasState): void;
  theme?(s: CanvasState): void;
  pointerdown?(s: CanvasState, e: PointerEvent): void;
  pointermove?(s: CanvasState, e: PointerEvent): void;
  pointerup?(s: CanvasState, e: PointerEvent): void;
  destroy?(): void;
}

const VARS: Record<keyof Palette, string> = {
  bg: '--sd-bg',
  surface: '--sd-surface',
  surface2: '--sd-surface-2',
  ink: '--sd-ink',
  muted: '--sd-muted',
  line: '--sd-line',
  accent: '--sd-accent',
  accentStrong: '--sd-accent-strong',
  accentInk: '--sd-accent-ink',
  accent2: '--sd-accent-2',
  live: '--sd-live',
  wip: '--sd-wip',
  danger: '--sd-danger',
};

/** Lit les couleurs courantes (thème + scheme) depuis les variables --sd-* de <html>. */
export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const out = {} as Palette;
  for (const key of Object.keys(VARS) as (keyof Palette)[]) {
    out[key] = cs.getPropertyValue(VARS[key]).trim() || '#888888';
  }
  return out;
}

/** Applique une opacité à une couleur #rgb / #rrggbb ; les autres formats sont renvoyés tels quels. */
export function alpha(color: string, a: number): string {
  let hex = color.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(hex)) return color;
  const n = parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const mono = (size: number, weight = 500): string =>
  `${weight} ${size}px "JetBrains Mono", ui-monospace, monospace`;

export const display = (size: number, weight = 800): string =>
  `${weight} ${size}px "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif`;

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/**
 * Monte un canvas dans `el` et pilote la boucle de dessin via les hooks de `setup`.
 * Renvoie une fonction de nettoyage.
 */
export function mountCanvas(
  el: HTMLElement,
  setup: (s: CanvasState) => CanvasHooks,
): () => void {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;';
  el.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const s: CanvasState = {
    el,
    canvas,
    ctx,
    w: 0,
    h: 0,
    dpr: 1,
    pointer: { x: -9999, y: -9999, inside: false, down: false },
    colors: readPalette(),
    reduced: prefersReducedMotion(),
    time: 0,
  };
  const hooks = setup(s);

  let visible = false;
  let raf = 0;
  let last = 0;

  const drawOnce = () => {
    if (s.w > 0 && s.h > 0) hooks.frame(s, 0);
  };

  const tick = (now: number) => {
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    s.time += dt;
    hooks.frame(s, dt);
    raf = requestAnimationFrame(tick);
  };

  const sync = () => {
    const shouldRun = visible && !document.hidden && !s.reduced && s.w > 0;
    if (shouldRun && !raf) {
      last = 0;
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const resize = () => {
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h) return;
    s.w = w;
    s.h = h;
    s.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * s.dpr);
    canvas.height = Math.round(h * s.dpr);
    ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    hooks.resize?.(s);
    if (!raf) drawOnce();
    sync();
  };

  const onTheme = () => {
    s.colors = readPalette();
    hooks.theme?.(s);
    if (!raf) drawOnce();
  };

  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    s.pointer.x = e.clientX - r.left;
    s.pointer.y = e.clientY - r.top;
  };
  const onDown = (e: PointerEvent) => {
    local(e);
    s.pointer.down = true;
    s.pointer.inside = true;
    hooks.pointerdown?.(s, e);
    if (!raf) drawOnce();
  };
  const onMove = (e: PointerEvent) => {
    local(e);
    s.pointer.inside = true;
    hooks.pointermove?.(s, e);
    if (!raf) drawOnce();
  };
  const onUp = (e: PointerEvent) => {
    s.pointer.down = false;
    hooks.pointerup?.(s, e);
  };
  const onLeave = (e: PointerEvent) => {
    s.pointer.inside = false;
    s.pointer.down = false;
    s.pointer.x = s.pointer.y = -9999;
    hooks.pointerup?.(s, e);
    if (!raf) drawOnce();
  };

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointercancel', onLeave);

  const ro = new ResizeObserver(resize);
  ro.observe(el);

  const io = new IntersectionObserver(
    ([entry]) => {
      visible = !!entry?.isIntersecting;
      sync();
    },
    { rootMargin: '100px' },
  );
  io.observe(el);

  // Le thème change via data-theme (bascule) ou via la préférence système.
  const mo = new MutationObserver(onTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-product'] });
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  dark.addEventListener('change', onTheme);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMotion = () => {
    s.reduced = motion.matches;
    sync();
    if (!raf) drawOnce();
  };
  motion.addEventListener('change', onMotion);
  document.addEventListener('visibilitychange', sync);

  // Les polices peuvent arriver après la première image : un redessin une fois prêtes.
  document.fonts?.ready.then(() => {
    hooks.resize?.(s);
    if (!raf) drawOnce();
  });

  resize();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    mo.disconnect();
    dark.removeEventListener('change', onTheme);
    motion.removeEventListener('change', onMotion);
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('pointerup', onUp);
    hooks.destroy?.();
    canvas.remove();
  };
}
