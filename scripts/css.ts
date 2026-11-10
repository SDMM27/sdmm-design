// Génération des feuilles CSS (base, thèmes, motion) à partir de src/tokens.ts.
import {
  bezier,
  font,
  motion as motionTokens,
  neutrals,
  radius,
  shadow,
  status,
  themes,
  themeNeutrals,
  type Pair,
  type ThemeName,
} from '../src/tokens';

export const BANNER = '/* Généré par scripts/build.ts depuis src/tokens.ts : ne pas éditer à la main. */\n';

type Decls = Record<string, string>;

const block = (selector: string, decls: Decls, indent = ''): string =>
  `${indent}${selector} {\n${Object.entries(decls)
    .map(([k, v]) => `${indent}  ${k}: ${v};`)
    .join('\n')}\n${indent}}`;

/**
 * Même mécanique que le portfolio : valeurs claires sur `selector`, valeurs sombres soit par
 * préférence système (sauf si data-theme="light" est posé), soit par data-theme="dark".
 */
export function schemeBlocks(selector: string, light: Decls, dark: Decls): string {
  return [
    block(selector, light),
    `@media (prefers-color-scheme: dark) {\n${block(`${selector}:not([data-theme="light"])`, dark, '  ')}\n}`,
    block(`${selector}[data-theme="dark"]`, dark),
  ].join('\n\n');
}

const pairDecls = (entries: Record<string, Pair>, scheme: 'light' | 'dark', prefix = '--sd-'): Decls =>
  Object.fromEntries(Object.entries(entries).map(([k, v]) => [`${prefix}${k}`, v[scheme]]));

const cssEasing = Object.fromEntries(
  Object.entries(motionTokens.easing).map(([k, v]) => [k === 'inOut' ? 'in-out' : k, bezier(v)]),
);

export function baseVars(): { light: Decls; dark: Decls } {
  const colors = { ...neutrals, ...status } as Record<string, Pair>;
  const fixed: Decls = {
    '--sd-font-display': font.family.display,
    '--sd-font-sans': font.family.sans,
    '--sd-font-mono': font.family.mono,
    '--sd-display-tracking': font.display.letterSpacing,
    ...Object.fromEntries(
      Object.entries(font.scale).map(([k, v]) => [`--sd-text-${k}`, `${v.size}rem`]),
    ),
    ...Object.fromEntries(Object.entries(radius).map(([k, v]) => [`--sd-radius-${k}`, v])),
    ...Object.fromEntries(
      Object.entries(motionTokens.duration).map(([k, v]) => [`--sd-dur-${k}`, `${v}ms`]),
    ),
    ...Object.fromEntries(Object.entries(cssEasing).map(([k, v]) => [`--sd-ease-${k}`, v])),
    '--sd-stagger': `${motionTokens.stagger}ms`,
  };
  return {
    light: {
      ...pairDecls(colors, 'light'),
      ...pairDecls(shadow, 'light', '--sd-shadow-'),
      ...fixed,
      'color-scheme': 'light',
    },
    dark: {
      ...pairDecls(colors, 'dark'),
      ...pairDecls(shadow, 'dark', '--sd-shadow-'),
      'color-scheme': 'dark',
    },
  };
}

export function baseCss(): string {
  const { light, dark } = baseVars();
  return `${BANNER}
${schemeBlocks(':root', light, dark)}

::selection {
  background: var(--sd-accent);
  color: var(--sd-accent-ink);
}

:focus-visible {
  outline: 2px solid var(--sd-accent);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
`;
}

export function themeVars(name: ThemeName, scheme: 'light' | 'dark'): Decls {
  const t = themes[name];
  const over = themes[name].neutrals ?? {};
  return {
    ...Object.fromEntries(
      Object.entries(over).flatMap(([k, v]) => (v?.[scheme] ? [[`--sd-${k}`, v[scheme]]] : [])),
    ),
    '--sd-accent': t.accent[scheme],
    '--sd-accent-strong': t['accent-strong'][scheme],
    '--sd-accent-ink': t['accent-ink'][scheme],
    '--sd-accent-2': t['accent-2'][scheme],
  };
}

/** Bloc de variables d'accent pour un sélecteur donné (`:root` dans les fichiers livrés). */
export function themeBlocks(name: ThemeName, selector = ':root'): string {
  return schemeBlocks(selector, themeVars(name, 'light'), themeVars(name, 'dark'));
}

export function themeCss(name: ThemeName): string {
  return `${BANNER}/* Thème « ${themes[name].label} » : accents${themes[name].neutrals ? ' et neutres' : ''}, à combiner avec base.css (à importer après). */

${themeBlocks(name)}
`;
}

export function motionCss(): string {
  return `${BANNER}/* Utilitaires d'animation. Les .sd-reveal ne s'activent que sous .js (posé par themeScript / votre propre script). */

/* Apparition au scroll (initReveal) ; --i = rang dans la série pour le décalage. */
.js .sd-reveal {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity var(--sd-dur-slow) ease,
    transform var(--sd-dur-slow) var(--sd-ease-out);
  transition-delay: calc(var(--i, 0) * var(--sd-stagger));
}
.js .sd-reveal.is-visible {
  opacity: 1;
  transform: none;
}

/* Tilt 3D des cartes : --rx / --ry posées par initTilt (pointeur fin uniquement). */
.sd-tilt {
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition:
    transform 0.18s ease-out,
    box-shadow var(--sd-dur-base) ease,
    border-color var(--sd-dur-base) ease;
  will-change: transform;
}

/* Rebond « spring » au survol / à l'appui. */
.sd-spring {
  transition: transform var(--sd-dur-base) var(--sd-ease-spring);
}
.sd-spring:hover { transform: scale(1.06); }
.sd-spring:active { transform: scale(0.96); }

/* Point pulsé (couleur par défaut : wip, surchargeable via --sd-pulse). */
@keyframes sd-pulse {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--sd-pulse, var(--sd-wip)) 60%, transparent); }
  70% { box-shadow: 0 0 0 7px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
.sd-pulse-dot { animation: sd-pulse 1.8s ease-out infinite; }

/* Squelette de chargement. */
@keyframes sd-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
.sd-shimmer {
  background: linear-gradient(
    100deg,
    var(--sd-surface-2) 30%,
    color-mix(in srgb, var(--sd-surface) 70%, var(--sd-surface-2)) 50%,
    var(--sd-surface-2) 70%
  );
  background-size: 200% 100%;
  animation: sd-shimmer 1.6s linear infinite;
}

/* Toast : ajouter .is-visible pour l'afficher. */
.sd-toast {
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  z-index: 70;
  max-width: calc(100vw - 2rem);
  transform: translate(-50%, 1rem);
  opacity: 0;
  transition:
    opacity var(--sd-dur-base) ease,
    transform var(--sd-dur-base) var(--sd-ease-spring);
  pointer-events: none;
}
.sd-toast.is-visible {
  opacity: 1;
  transform: translate(-50%, 0);
}

@media (prefers-reduced-motion: reduce) {
  .js .sd-reveal { opacity: 1; transform: none; transition: none; }
  .sd-tilt { transform: none; transition: none; will-change: auto; }
  .sd-spring:hover, .sd-spring:active { transform: none; }
  .sd-pulse-dot, .sd-shimmer { animation: none; }
  .sd-toast { transform: translate(-50%, 0); transition: opacity 0.001ms; }
}
`;
}

export function allCss(name: ThemeName): string {
  const strip = (css: string) => css.replace(BANNER, '').trim();
  return `${BANNER}/* base + thème « ${themes[name].label} » + motion en un seul import. */

${strip(baseCss())}

${strip(themeCss(name)).replace(/^\/\*[^\n]*\*\/\n\n/, '')}

${strip(motionCss()).replace(/^\/\*[^\n]*\*\/\n\n/, '')}
`;
}
