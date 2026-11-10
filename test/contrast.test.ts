import { describe, expect, it } from 'vitest';
import { neutrals, schemes, status, themeNames, themes } from '../src/tokens';

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe.each(themeNames)('contraste du thème %s', (name) => {
  const t = themes[name];
  describe.each(schemes)('%s', (s) => {
    const bg = neutrals.bg[s];

    it('accent-strong / bg >= 4.5 (texte coloré)', () => {
      expect(ratio(t['accent-strong'][s], bg)).toBeGreaterThanOrEqual(4.5);
    });

    it('ink / bg >= 7 (AAA)', () => {
      expect(ratio(neutrals.ink[s], bg)).toBeGreaterThanOrEqual(7);
    });

    it('muted / bg >= 4.5', () => {
      expect(ratio(neutrals.muted[s], bg)).toBeGreaterThanOrEqual(4.5);
    });

    it('accent-ink / accent : >= 4.5 en texte normal, >= 3 si documenté « large »', () => {
      const min = t.accentInkText[s] === 'normal' ? 4.5 : 3;
      expect(ratio(t['accent-ink'][s], t.accent[s])).toBeGreaterThanOrEqual(min);
    });

    it.each(['live', 'wip', 'danger'] as const)('%s / surface >= 3', (k) => {
      expect(ratio(status[k][s], neutrals.surface[s])).toBeGreaterThanOrEqual(3);
    });
  });
});
