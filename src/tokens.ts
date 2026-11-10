// SOURCE UNIQUE du design system. Tout le contenu de dist/ et du showcase est généré depuis ce fichier
// (`npm run build`). Ne jamais éditer dist/ à la main.

import { fontsUrls } from './js/fonts';

export type Scheme = 'light' | 'dark';
export type ThemeName = 'portfolio' | 'geogame' | 'mma' | 'dailylingua';

export interface Pair<T = string> {
  light: T;
  dark: T;
}

export const schemes: readonly Scheme[] = ['light', 'dark'];

// ---------------------------------------------------------------------------
// Base commune (neutres + statuts) : identique pour tous les produits.
// ---------------------------------------------------------------------------

export interface Neutrals {
  bg: Pair;
  surface: Pair;
  'surface-2': Pair;
  ink: Pair;
  muted: Pair;
  line: Pair;
}

/** Surcharge de neutres par thème : clés et schemes optionnels, le reste vient de la base. */
export type NeutralOverrides = { [K in keyof Neutrals]?: Partial<Pair> };

export const neutrals: Neutrals = {
  bg: { light: '#f6f3ec', dark: '#0f0e0c' },
  surface: { light: '#fffdf8', dark: '#181614' },
  'surface-2': { light: '#ece7dc', dark: '#23201c' },
  ink: { light: '#16130f', dark: '#f3efe6' },
  muted: { light: '#6b655c', dark: '#a39b8e' },
  line: { light: '#d9d2c4', dark: '#34302a' },
};

export interface Status {
  live: Pair;
  wip: Pair;
  danger: Pair;
}

export const status: Status = {
  live: { light: '#1a9d55', dark: '#3ccf7f' },
  // light ajusté (#c98a00 -> #c58700 -> #c48700) : #c98a00 donnait 2.90:1 sur surface, sous le seuil de 3:1 ;
  // #c58700 donnait 2.998:1 sur la surface #fffcf6 de DailyLingua (neutres surchargés).
  wip: { light: '#c48700', dark: '#f0b429' },
  danger: { light: '#c62828', dark: '#ff6b6b' },
};

// ---------------------------------------------------------------------------
// Accents : seul élément propre à chaque produit.
// ---------------------------------------------------------------------------

export interface DisplayType {
  /** Pile CSS complète, ex. `"Newsreader", ui-serif, Georgia, serif`. */
  family: string;
  weight: number;
  /** Largeur en % (axe wdth, 100 = normal) : 75 = condensé. */
  stretch?: number;
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** letter-spacing, en em. */
  tracking?: string;
}

export interface ThemeTokens {
  label: string;
  accent: Pair;
  /** Accent pour du TEXTE posé sur bg (contraste AA >= 4.5:1). */
  'accent-strong': Pair;
  /** Texte posé SUR l'accent (boutons pleins, ::selection). */
  'accent-ink': Pair;
  'accent-2': Pair;
  /** Neutres redéfinis par ce thème (tout ce qui est absent reste celui de la base). */
  neutrals?: NeutralOverrides;
  /** Typographie de titre propre au produit (le reste vient de la base : `baseDisplay`). */
  display?: DisplayType;
  /**
   * Taille de texte autorisée sur un fond accent : 'normal' impose accent-ink/accent >= 4.5,
   * 'large' (texte >= 18.66px gras ou >= 24px, icônes) se contente de >= 3.
   */
  accentInkText: Pair<'normal' | 'large'>;
}

export const themes: Record<ThemeName, ThemeTokens> = {
  portfolio: {
    label: 'Portfolio',
    accent: { light: '#ff4f1a', dark: '#ff6a3d' },
    'accent-strong': { light: '#c2380c', dark: '#ff8a63' },
    'accent-ink': { light: '#ffffff', dark: '#120a06' },
    'accent-2': { light: '#2f5bff', dark: '#7d97ff' },
    // blanc sur #ff4f1a = 3.29:1 : réservé au grand texte en clair (voir README).
    accentInkText: { light: 'large', dark: 'normal' },
  },
  geogame: {
    label: 'GeoGame',
    accent: { light: '#14a86b', dark: '#3ddc97' },
    'accent-strong': { light: '#0b7a4c', dark: '#5fe6ab' },
    'accent-ink': { light: '#04261a', dark: '#04261a' },
    'accent-2': { light: '#7c4dff', dark: '#c792ff' },
    // bleu nuit
    neutrals: {
      bg: { light: '#f3f5fa', dark: '#0b1020' },
      surface: { light: '#ffffff', dark: '#141b30' },
      'surface-2': { light: '#e6eaf3', dark: '#1b2440' },
      ink: { light: '#0b1020', dark: '#eef1f8' },
      muted: { light: '#5a6380', dark: '#8a93b0' },
      line: { light: '#d5dbe8', dark: '#26304d' },
    },
    accentInkText: { light: 'normal', dark: 'normal' },
  },
  mma: {
    label: 'MMA Universe',
    accent: { light: '#e0262f', dark: '#ff4d55' },
    'accent-strong': { light: '#b3141c', dark: '#ff7a80' },
    'accent-ink': { light: '#ffffff', dark: '#1a0406' },
    'accent-2': { light: '#c07a00', dark: '#f5b83d' },
    neutrals: {
      bg: { dark: '#0b0a09' },
      surface: { dark: '#171513' },
      'surface-2': { light: '#e6e0d3', dark: '#26221e' },
    },
    // Bricolage Grotesque condensé (axe wdth 75), capitales.
    display: {
      family: '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif',
      weight: 800,
      stretch: 75,
      transform: 'uppercase',
      tracking: '-0.01em',
    },
    accentInkText: { light: 'normal', dark: 'normal' },
  },
  dailylingua: {
    label: 'DailyLingua',
    accent: { light: '#33478c', dark: '#8fa2ff' },
    'accent-strong': { light: '#33478c', dark: '#b3c0ff' },
    'accent-ink': { light: '#ffffff', dark: '#0d1330' },
    'accent-2': { light: '#b0502b', dark: '#e2825c' },
    // papier journal
    neutrals: {
      bg: { light: '#f5f1e8', dark: '#0f0e0c' },
      surface: { light: '#fffcf6', dark: '#181614' },
      'surface-2': { light: '#ede7da', dark: '#1d1a17' },
      ink: { light: '#1d1b17', dark: '#f3efe6' },
      muted: { light: '#6b655c', dark: '#a39b8e' },
      line: { light: '#d9d2c4', dark: '#34302a' },
    },
    // Serif éditorial.
    display: { family: '"Newsreader", ui-serif, Georgia, serif', weight: 700, transform: 'none', tracking: '-0.02em' },
    accentInkText: { light: 'normal', dark: 'normal' },
  },
};

export const themeNames = Object.keys(themes) as ThemeName[];

/** Neutres EFFECTIFS d'un thème : base + surcharges du thème. */
export function themeNeutrals(name: ThemeName): Neutrals {
  const over = themes[name].neutrals ?? {};
  return Object.fromEntries(
    (Object.keys(neutrals) as (keyof Neutrals)[]).map((k) => [k, { ...neutrals[k], ...over[k] }]),
  ) as unknown as Neutrals;
}

// ---------------------------------------------------------------------------
// Typographie, rayons, ombres, motion
// ---------------------------------------------------------------------------

export const font = {
  family: {
    display: '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif',
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  /** Noms de familles à utiliser avec expo-font / @expo-google-fonts (React Native). */
  native: {
    display: 'BricolageGrotesque_700Bold',
    displayHeavy: 'BricolageGrotesque_800ExtraBold',
    sans: 'Inter_400Regular',
    sansMedium: 'Inter_500Medium',
    sansSemibold: 'Inter_600SemiBold',
    mono: 'JetBrainsMono_500Medium',
  },
  /** URL Google Fonts de la base (portfolio, geogame) ; pour chaque produit : `fontsUrl(theme)`. */
  googleFontsUrl: fontsUrls.portfolio,
  display: { weights: [700, 800], letterSpacing: '-0.02em' },
  /** Échelle de tailles en rem (1rem = 16px) avec interligne. */
  scale: {
    xs: { size: 0.75, line: 1.1 },
    sm: { size: 0.875, line: 1.25 },
    base: { size: 1, line: 1.6 },
    lg: { size: 1.125, line: 1.6 },
    xl: { size: 1.25, line: 1.4 },
    '2xl': { size: 1.5, line: 1.25 },
    '3xl': { size: 1.875, line: 1.2 },
    '4xl': { size: 2.25, line: 1.1 },
    '5xl': { size: 3, line: 1.05 },
    '6xl': { size: 3.75, line: 1 },
  },
} as const;

/** Typographie de titre de la base (portfolio, geogame) ; un thème peut la redéfinir via `display`. */
export const baseDisplay: Required<DisplayType> = {
  family: font.family.display,
  weight: 800,
  stretch: 100,
  transform: 'none',
  tracking: font.display.letterSpacing,
};

/** Typographie de titre EFFECTIVE d'un thème : base + surcharges du thème. */
export function themeDisplay(name: ThemeName): Required<DisplayType> {
  return { ...baseDisplay, ...themes[name].display };
}

export const radius = {
  sm: '0.5rem',
  md: '0.875rem',
  card: '1.25rem',
  pill: '999px',
} as const;

export const shadow: { sm: Pair; md: Pair; lg: Pair } = {
  sm: {
    light: '0 1px 2px rgb(60 40 20 / 0.07), 0 1px 1px rgb(60 40 20 / 0.04)',
    dark: '0 1px 2px rgb(0 0 0 / 0.45), 0 1px 1px rgb(0 0 0 / 0.3)',
  },
  md: {
    light: '0 8px 18px -6px rgb(60 40 20 / 0.14), 0 2px 5px rgb(60 40 20 / 0.06)',
    dark: '0 10px 22px -6px rgb(0 0 0 / 0.55), 0 2px 6px rgb(0 0 0 / 0.35)',
  },
  lg: {
    light: '0 28px 56px -18px rgb(60 40 20 / 0.26), 0 10px 20px -10px rgb(60 40 20 / 0.12)',
    dark: '0 30px 60px -16px rgb(0 0 0 / 0.7), 0 10px 22px -10px rgb(0 0 0 / 0.5)',
  },
};

export const motion = {
  duration: { fast: 150, base: 250, slow: 600 },
  easing: {
    out: [0.2, 0.7, 0.2, 1],
    spring: [0.34, 1.56, 0.64, 1],
    inOut: [0.65, 0, 0.35, 1],
  },
  /** Décalage entre éléments successifs d'un reveal, en ms. */
  stagger: 70,
} as const;

export const bezier = (b: readonly number[]): string => `cubic-bezier(${b.join(', ')})`;
