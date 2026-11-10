// Adaptateurs par stack : Tailwind 4, Tailwind 3 (preset) et React Native / NativeWind.
import { BANNER } from './css';
import {
  bezier,
  font,
  motion,
  neutrals,
  radius,
  status,
  themeNames,
  themeNeutrals,
  themes,
  type Pair,
  type Scheme,
  type ThemeName,
} from '../src/tokens';

/** Couleurs partagées par les adaptateurs Tailwind (nom Tailwind -> variable --sd-*). */
const COLOR_NAMES = [
  'bg',
  'surface',
  'surface-2',
  'ink',
  'muted',
  'line',
  'accent',
  'accent-strong',
  'accent-ink',
  'accent-2',
  'live',
  'wip',
  'danger',
] as const;

// ---------------------------------------------------------------------------
// Tailwind 4
// ---------------------------------------------------------------------------

export function tailwindV4(): string {
  const colors = COLOR_NAMES.map((n) => `  --color-${n}: var(--sd-${n});`).join('\n');
  return `${BANNER}/* Tailwind 4 : @import "@sdmm/design/tailwind/v4.css"; (après "tailwindcss" et le CSS @sdmm/design). */

/* dark: suit data-theme, et la préférence système tant qu'aucun data-theme="light" n'est posé. */
@custom-variant dark {
  &:where([data-theme="dark"], [data-theme="dark"] *) {
    @slot;
  }
  @media (prefers-color-scheme: dark) {
    &:where(:root:not([data-theme="light"]), :root:not([data-theme="light"]) *) {
      @slot;
    }
  }
}

@theme inline {
${colors}
  --font-display: var(--sd-font-display);
  --font-sans: var(--sd-font-sans);
  --font-mono: var(--sd-font-mono);
  --radius-card: var(--sd-radius-card);
  --ease-out: var(--sd-ease-out);
  --ease-spring: var(--sd-ease-spring);
  --ease-in-out: var(--sd-ease-in-out);
}

/* Durées : duration-fast / duration-base / duration-slow. */
@utility duration-fast {
  transition-duration: var(--sd-dur-fast);
}
@utility duration-base {
  transition-duration: var(--sd-dur-base);
}
@utility duration-slow {
  transition-duration: var(--sd-dur-slow);
}
`;
}

// ---------------------------------------------------------------------------
// Tailwind 3 (preset CJS)
// ---------------------------------------------------------------------------

export function tailwindPreset(): string {
  const colorEntries = COLOR_NAMES.map((n) => `    ${JSON.stringify(n)}: v(${JSON.stringify(n)}),`).join('\n');
  return `${BANNER}'use strict';

// Couleur lue dans une variable CSS, compatible avec les modificateurs d'opacité (bg-accent/50).
const v = (name) => ({ opacityValue }) =>
  opacityValue === undefined
    ? \`var(--sd-\${name})\`
    : \`color-mix(in srgb, var(--sd-\${name}) calc(\${opacityValue} * 100%), transparent)\`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  // dark: suit data-theme, et la préférence système tant qu'aucun data-theme="light" n'est posé.
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:where(:root:not([data-theme="light"]), :root:not([data-theme="light"]) *) }',
      '&:where([data-theme="dark"], [data-theme="dark"] *)',
    ],
  ],
  theme: {
    extend: {
      colors: {
${colorEntries}
      },
      fontFamily: {
        display: ['var(--sd-font-display)'],
        sans: ['var(--sd-font-sans)'],
        mono: ['var(--sd-font-mono)'],
      },
      borderRadius: {
        card: 'var(--sd-radius-card)',
      },
      transitionDuration: {
        fast: 'var(--sd-dur-fast)',
        base: 'var(--sd-dur-base)',
        slow: 'var(--sd-dur-slow)',
      },
      transitionTimingFunction: {
        out: 'var(--sd-ease-out)',
        spring: 'var(--sd-ease-spring)',
        'in-out': 'var(--sd-ease-in-out)',
      },
    },
  },
};
`;
}

export function tailwindPresetDts(): string {
  return `// Généré par scripts/build.ts depuis src/tokens.ts : ne pas éditer à la main.
declare const preset: {
  darkMode: ['variant', string[]];
  theme: { extend: Record<string, Record<string, unknown>> };
};
export = preset;
`;
}

// ---------------------------------------------------------------------------
// React Native / NativeWind (valeurs brutes, CommonJS pour tailwind.config.js et Metro)
// ---------------------------------------------------------------------------

const camel = (s: string) => s.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());

function resolvedColors(name: ThemeName, scheme: Scheme, key: (k: string) => string = camel): Record<string, string> {
  const t = themes[name];
  const all: Record<string, Pair> = { ...themeNeutrals(name), ...status };
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(all)) out[key(k)] = v[scheme];
  for (const k of ['accent', 'accent-strong', 'accent-ink', 'accent-2'] as const) out[key(k)] = t[k][scheme];
  return out;
}

export function nativeJs(): string {
  const colors = Object.fromEntries(
    themeNames.map((n) => [n, { light: resolvedColors(n, 'light'), dark: resolvedColors(n, 'dark') }]),
  );
  const px = (rem: string) => (rem.endsWith('rem') ? parseFloat(rem) * 16 : 999);
  const tw = Object.fromEntries(
    themeNames.map((n) => [n, { light: resolvedColors(n, 'light', (k) => k), dark: resolvedColors(n, 'dark', (k) => k) }]),
  );
  const data = {
    colors,
    tw,
    font: font.native,
    fontSize: Object.fromEntries(Object.entries(font.scale).map(([k, v]) => [k, v.size * 16])),
    radius: Object.fromEntries(Object.entries(radius).map(([k, v]) => [k, px(v)])),
    motion: {
      duration: motion.duration,
      easing: motion.easing,
      stagger: motion.stagger,
    },
  };
  const cssEasing = Object.fromEntries(
    Object.entries(motion.easing).map(([k, v]) => [k === 'inOut' ? 'in-out' : k, bezier(v)]),
  );
  return `${BANNER}'use strict';

const data = ${JSON.stringify(data, null, 2)};

const themeNames = ${JSON.stringify(themeNames)};

function assertTheme(name) {
  if (!data.colors[name]) {
    throw new Error('@sdmm/design: thème inconnu « ' + name + ' » (attendu : ' + themeNames.join(', ') + ')');
  }
}

/** Valeurs résolues (hex, nombres) d'un thème pour un scheme : sans variable CSS, utilisables en React Native. */
function getTheme(name, scheme) {
  assertTheme(name);
  const s = scheme === 'dark' ? 'dark' : 'light';
  return {
    name,
    scheme: s,
    colors: data.colors[name][s],
    font: data.font,
    fontSize: data.fontSize,
    radius: data.radius,
    motion: data.motion,
  };
}

/**
 * Preset Tailwind 3.4 pour NativeWind 4 : couleurs claires (bg-bg, text-ink, bg-accent...) et leurs
 * équivalents sombres préfixés « dark- » (dark:bg-dark-bg), à utiliser avec le variant dark:.
 */
function nativewindPreset(name) {
  assertTheme(name);
  return {
    theme: {
      extend: {
        colors: {
          ...data.tw[name].light,
          dark: data.tw[name].dark,
        },
        fontFamily: {
          display: [data.font.display],
          sans: [data.font.sans],
          mono: [data.font.mono],
        },
        borderRadius: { card: data.radius.card + 'px' },
        transitionDuration: {
          fast: data.motion.duration.fast + 'ms',
          base: data.motion.duration.base + 'ms',
          slow: data.motion.duration.slow + 'ms',
        },
        transitionTimingFunction: ${JSON.stringify(cssEasing)},
      },
    },
  };
}

module.exports = { getTheme, nativewindPreset, themeNames };
`;
}

export function nativeDts(): string {
  const names = themeNames.map((n) => `'${n}'`).join(' | ');
  const colorKeys = Object.keys(resolvedColors('portfolio', 'light'));
  const fontKeys = Object.keys(font.native);
  const scaleKeys = Object.keys(font.scale);
  const radiusKeys = Object.keys(radius);
  const bez = '[number, number, number, number]';
  return `// Généré par scripts/build.ts depuis src/tokens.ts : ne pas éditer à la main.
export type ThemeName = ${names};
export type Scheme = 'light' | 'dark';

export interface ThemeColors {
${colorKeys.map((k) => `  ${k}: string;`).join('\n')}
}

export interface NativeTheme {
  name: ThemeName;
  scheme: Scheme;
  colors: ThemeColors;
  /** Noms de familles expo-font / @expo-google-fonts. */
  font: { ${fontKeys.map((k) => `${k}: string`).join('; ')} };
  /** Tailles en px. */
  fontSize: { ${scaleKeys.map((k) => `${JSON.stringify(k)}: number`).join('; ')} };
  /** Rayons en px. */
  radius: { ${radiusKeys.map((k) => `${k}: number`).join('; ')} };
  motion: {
    /** Durées en ms. */
    duration: { fast: number; base: number; slow: number };
    /** Courbes de Bézier, à passer à Easing.bezier(...) de Reanimated. */
    easing: { out: ${bez}; spring: ${bez}; inOut: ${bez} };
    /** Décalage entre éléments d'une série, en ms. */
    stagger: number;
  };
}

export const themeNames: ThemeName[];

export function getTheme(name: ThemeName, scheme?: Scheme): NativeTheme;

/** Preset Tailwind 3.4 pour NativeWind 4 (couleurs claires ; sombres via dark: et le préfixe dark-). */
export function nativewindPreset(name: ThemeName): {
  theme: { extend: Record<string, Record<string, unknown>> };
};
`;
}
