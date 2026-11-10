export type FontsThemeName = 'portfolio' | 'geogame' | 'mma' | 'dailylingua';
/** URL Google Fonts recommandée par produit (police de titre du thème + Inter + JetBrains Mono). */
export declare const fontsUrls: Record<FontsThemeName, string>;
/** URL Google Fonts à mettre dans le `<head>` (ou à passer à `next/font`) pour un produit. */
export declare function fontsUrl(theme: FontsThemeName): string;
