# Changelog

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). La version 1.0.0 n'est pas encore publiée : ces changements en font partie.

## [1.0.0] - non publiée

### Ajouté

- Surcharges de neutres par thème (`neutrals`) : geogame (bleu nuit), dailylingua (papier journal), mma (fonds sombres plus profonds, `surface-2` chaud). Émises dans `css/themes/<produit>.css`, résolues dans `getTheme()` et le preset NativeWind.
- Typographie de titre par thème (`display`) : variables `--sd-font-display`, `--sd-display-weight`, `--sd-display-stretch`, `--sd-display-transform`, `--sd-display-tracking` ; classe `.sd-display` (`css/type.css`, inclus dans `all-<produit>.css`) ; `font-display` Tailwind 3 et 4 avec l'axe `wdth`. mma : Bricolage Grotesque condensé en capitales ; dailylingua : Newsreader.
- `fontsUrl(theme)` dans `@sdmm/design/js` et `@sdmm/design/native` : URL Google Fonts recommandée par produit.
- Animations signature dans `motion.css` : `.sd-marquee`, `.sd-ink`, `.sd-punch`, `.sd-stamp`, `.sd-mark`, `.sd-route`, coupées sous reduced-motion.
- `initCountUp(selector?)` : compteurs animés (`data-count-to`).
- Showcase : aperçu des titres par produit et démos des animations signature.
- Tests de contraste sur les neutres effectifs de chaque thème ; tests des surcharges, de `fontsUrl` et des animations signature.

### Modifié

- Couleur `wip` claire `#c58700` -> `#c48700` : 3.0:1 sur la surface `#fffcf6` de DailyLingua (2.998:1 avant).
- Native : `getTheme().font.display` suit la police de titre du thème ; `getTheme().display` expose la typographie de titre.
