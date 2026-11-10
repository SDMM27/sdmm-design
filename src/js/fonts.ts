export type FontsThemeName = 'portfolio' | 'geogame' | 'mma' | 'dailylingua';

const BRICOLAGE = 'Bricolage+Grotesque:opsz,wght@12..96,700..800';
const BRICOLAGE_CONDENSED = 'Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800';
const NEWSREADER = 'Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..600';

const url = (display: string): string =>
  `https://fonts.googleapis.com/css2?family=${display}&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`;

/** URL Google Fonts recommandée par produit (police de titre du thème + Inter + JetBrains Mono). */
export const fontsUrls: Record<FontsThemeName, string> = {
  portfolio: url(BRICOLAGE),
  geogame: url(BRICOLAGE),
  mma: url(BRICOLAGE_CONDENSED),
  dailylingua: url(NEWSREADER),
};

/** URL Google Fonts à mettre dans le `<head>` (ou à passer à `next/font`) pour un produit. */
export function fontsUrl(theme: FontsThemeName): string {
  const u = fontsUrls[theme];
  if (!u) throw new Error(`@sdmm/design: thème inconnu « ${String(theme)} » (attendu : ${Object.keys(fontsUrls).join(', ')})`);
  return u;
}
