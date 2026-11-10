/* Généré par scripts/build.ts depuis src/tokens.ts : ne pas éditer à la main. */
'use strict';

// Couleur lue dans une variable CSS, compatible avec les modificateurs d'opacité (bg-accent/50).
const v = (name) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `var(--sd-${name})`
    : `color-mix(in srgb, var(--sd-${name}) calc(${opacityValue} * 100%), transparent)`;

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
    "bg": v("bg"),
    "surface": v("surface"),
    "surface-2": v("surface-2"),
    "ink": v("ink"),
    "muted": v("muted"),
    "line": v("line"),
    "accent": v("accent"),
    "accent-strong": v("accent-strong"),
    "accent-ink": v("accent-ink"),
    "accent-2": v("accent-2"),
    "live": v("live"),
    "wip": v("wip"),
    "danger": v("danger"),
      },
      fontFamily: {
        // largeur (axe wdth) du thème ; poids, casse et interlettrage : classe .sd-display.
        display: ['var(--sd-font-display)', { fontVariationSettings: "'wdth' var(--sd-display-stretch)" }],
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
