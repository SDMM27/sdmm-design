import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { motionCss, themeCss, typeCss } from '../scripts/css';
import { fontsUrl } from '../src/js/fonts';
import { neutrals, themeDisplay, themeNames, themeNeutrals } from '../src/tokens';

const native = createRequire(import.meta.url)('../dist/native/index.js') as {
  getTheme: (n: string, s: string) => { colors: Record<string, string>; font: Record<string, string>; display: Record<string, unknown> };
  nativewindPreset: (n: string) => { theme: { extend: { colors: Record<string, unknown> } } };
  fontsUrl: (n: string) => string;
};

describe('surcharges de neutres', () => {
  it('geogame / dailylingua / mma redéfinissent leurs neutres dans themes/<theme>.css', () => {
    expect(themeCss('geogame')).toContain('--sd-bg: #0b1020;');
    expect(themeCss('dailylingua')).toContain('--sd-surface: #fffcf6;');
    expect(themeCss('mma')).toContain('--sd-surface-2: #e6e0d3;');
  });

  it('portfolio n\'émet aucun neutre', () => {
    expect(themeCss('portfolio')).not.toMatch(/--sd-(bg|surface|ink|muted|line)/);
  });

  it('mma : le reste vient de la base', () => {
    const n = themeNeutrals('mma');
    expect(n.bg.light).toBe(neutrals.bg.light);
    expect(n.bg.dark).toBe('#0b0a09');
    expect(n.ink).toEqual(neutrals.ink);
  });

  it('getTheme() et nativewindPreset() résolvent les neutres du thème', () => {
    expect(native.getTheme('geogame', 'dark').colors.bg).toBe('#0b1020');
    expect(native.getTheme('mma', 'light').colors.surface2).toBe('#e6e0d3');
    expect(native.getTheme('mma', 'light').colors.bg).toBe(neutrals.bg.light);
    expect(native.nativewindPreset('dailylingua').theme.extend.colors.bg).toBe('#f5f1e8');
  });
});

describe('typographie de titre', () => {
  it('mma : condensé, capitales ; dailylingua : serif ; base inchangée', () => {
    expect(themeDisplay('mma')).toMatchObject({ weight: 800, stretch: 75, transform: 'uppercase', tracking: '-0.01em' });
    expect(themeDisplay('dailylingua')).toMatchObject({ weight: 700, transform: 'none', tracking: '-0.02em' });
    expect(themeDisplay('dailylingua').family).toContain('Newsreader');
    expect(themeDisplay('geogame')).toEqual(themeDisplay('portfolio'));
    expect(themeCss('mma')).toContain('--sd-display-stretch: 75;');
    expect(themeCss('geogame')).not.toContain('--sd-display');
  });

  it('.sd-display applique les variables', () => {
    expect(typeCss()).toContain("font-variation-settings: 'wdth' var(--sd-display-stretch)");
  });

  it('fontsUrl(theme) : une URL par thème, identique en JS et en natif', () => {
    for (const n of themeNames) expect(native.fontsUrl(n)).toBe(fontsUrl(n));
    expect(fontsUrl('mma')).toContain('family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800');
    expect(fontsUrl('dailylingua')).toContain('family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..600');
    expect(fontsUrl('geogame')).toBe(fontsUrl('portfolio'));
  });

  it('natif : la police de titre suit le thème', () => {
    expect(native.getTheme('dailylingua', 'light').font.display).toBe('Newsreader_700Bold');
    expect(native.getTheme('mma', 'light').font.display).toBe('BricolageGrotesque_800ExtraBold');
    expect(native.getTheme('geogame', 'light').font.display).toBe('BricolageGrotesque_700Bold');
  });
});

describe('motion signature', () => {
  const css = motionCss();
  const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));

  it.each(['sd-marquee', 'sd-ink', 'sd-punch', 'sd-stamp', 'sd-mark', 'sd-route'])('.%s existe et est coupée sous reduced-motion', (c) => {
    expect(css).toContain(`.${c} {`);
    expect(reduced).toContain(`.${c}`);
  });

  it('variables de personnalisation', () => {
    expect(css).toContain('--sd-marquee-duration');
    expect(css).toContain('--sd-stamp-rotate');
    expect(css).toContain('--sd-mark');
  });
});
