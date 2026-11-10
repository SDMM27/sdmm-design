// Généré par scripts/build.ts depuis src/tokens.ts : ne pas éditer à la main.
export type ThemeName = 'portfolio' | 'geogame' | 'mma' | 'dailylingua';
export type Scheme = 'light' | 'dark';

export interface ThemeColors {
  bg: string;
  surface: string;
  surface2: string;
  ink: string;
  muted: string;
  line: string;
  live: string;
  wip: string;
  danger: string;
  accent: string;
  accentStrong: string;
  accentInk: string;
  accent2: string;
}

export interface NativeTheme {
  name: ThemeName;
  scheme: Scheme;
  colors: ThemeColors;
  /** Noms de familles expo-font / @expo-google-fonts. */
  font: { display: string; displayHeavy: string; sans: string; sansMedium: string; sansSemibold: string; mono: string };
  /** Tailles en px. */
  fontSize: { "xs": number; "sm": number; "base": number; "lg": number; "xl": number; "2xl": number; "3xl": number; "4xl": number; "5xl": number; "6xl": number };
  /** Rayons en px. */
  radius: { sm: number; md: number; card: number; pill: number };
  motion: {
    /** Durées en ms. */
    duration: { fast: number; base: number; slow: number };
    /** Courbes de Bézier, à passer à Easing.bezier(...) de Reanimated. */
    easing: { out: [number, number, number, number]; spring: [number, number, number, number]; inOut: [number, number, number, number] };
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
