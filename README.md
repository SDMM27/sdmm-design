# @sdmm/design

Design system partagé des projets de Sacha Don (GitHub SDMM27). Le portfolio en est la référence visuelle.

## Principe

**Une base commune, un accent par produit.**

- Base commune à tous les produits : neutres (clair et sombre), statuts (`live`, `wip`, `danger`), typographies (Bricolage Grotesque, Inter, JetBrains Mono), rayons, ombres et motion.
- Chaque produit ajoute son jeu d'accents (`accent`, `accent-strong`, `accent-ink`, `accent-2`) et peut **redéfinir** certains neutres et la typographie de titre. Tout ce qu'un thème ne redéfinit pas (rayons, ombres, motion, polices sans et mono, statuts) vient de la base.

Produits disponibles : `portfolio`, `geogame`, `mma`, `dailylingua`.

La source unique est `src/tokens.ts`. `npm run build` en génère tout `dist/` (qui est commité, car il n'y a pas de build à l'installation) et `showcase/index.html`.

Pour voir le résultat : ouvrir `showcase/index.html` (sélecteur de produit, clair/sombre, composants, animations).

## Installation

```bash
npm i github:SDMM27/sdmm-design#v1.0.0
```

Polices : l'URL Google Fonts dépend du produit (police de titre différente). À charger dans le `<head>` (ou via `next/font` / `expo-font`) ; `fontsUrl(theme)` la renvoie (`@sdmm/design/js` et `@sdmm/design/native`).

| Produit | Titres | URL |
| --- | --- | --- |
| `portfolio`, `geogame` | Bricolage Grotesque 800 | `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700..800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap` |
| `mma` | Bricolage Grotesque condensé (wdth 75) | `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap` |
| `dailylingua` | Newsreader 700 | `https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap` |

```js
import { fontsUrl } from '@sdmm/design/js';
fontsUrl('mma'); // <link rel="stylesheet" href={fontsUrl('mma')} />
```

Contenu du paquet :

| Import | Rôle |
| --- | --- |
| `@sdmm/design/css/base.css` | Variables `--sd-*` (neutres, statuts, polices, rayons, ombres, motion), `::selection`, `:focus-visible`, reduced-motion |
| `@sdmm/design/css/themes/<produit>.css` | Les 4 variables d'accent du produit, plus ses surcharges de neutres et de typo de titre le cas échéant (à importer **après** `base.css`) |
| `@sdmm/design/css/type.css` | Classe `.sd-display` (typo de titre du thème) |
| `@sdmm/design/css/motion.css` | Utilitaires `.sd-reveal`, `.sd-tilt`, `.sd-spring`, `.sd-pulse-dot`, `.sd-shimmer`, `.sd-toast`, et les animations signature (`.sd-marquee`, `.sd-ink`, `.sd-punch`, `.sd-stamp`, `.sd-mark`, `.sd-route`) |
| `@sdmm/design/css/all-<produit>.css` | base + thème + type + motion en un seul import |
| `@sdmm/design/tailwind/v4.css` | Tailwind 4 : `@custom-variant dark` et `@theme inline` |
| `@sdmm/design/tailwind/preset` | Preset Tailwind 3 |
| `@sdmm/design/native` | React Native : `getTheme`, `nativewindPreset`, `fontsUrl` |
| `@sdmm/design/js` | `initReveal`, `initTilt`, `initTheme`, `initCountUp`, `themeScript`, `fontsUrl`, `mountCanvas`, `alpha`, `readPalette` |

## Surcharges par thème

Un thème peut redéfinir des neutres (`neutrals`, mêmes clés que la base : `bg`, `surface`, `surface-2`, `ink`, `muted`, `line`, en `light` / `dark`, tout est optionnel) et la typographie de titre (`display`). Elles sont émises en variables `--sd-*` dans `themes/<produit>.css` avec la même mécanique clair/sombre que la base : elles l'emportent sur `base.css` **à condition d'importer le thème après la base** (c'est le cas de `all-<produit>.css`). Elles sont aussi résolues dans `getTheme()` et dans `nativewindPreset()`.

| Produit | Neutres redéfinis | Titres |
| --- | --- | --- |
| `portfolio` | aucun (la base) | Bricolage Grotesque 800, -0.02em |
| `geogame` | tous : bleu nuit (`bg` sombre `#0b1020`, clair `#f3f5fa`...) | idem base |
| `mma` | sombre : `bg`, `surface`, `surface-2` ; clair : `surface-2` | Bricolage Grotesque condensé (wdth 75), 800, capitales, -0.01em |
| `dailylingua` | tous : papier journal (`bg` clair `#f5f1e8`...) | Newsreader 700, -0.02em, sans transformation |

Les tests de contraste (`npm test`) s'appliquent aux neutres **effectifs** de chaque thème (surcharges incluses).

## Typographie de titre

`display` = `{ family, weight, stretch?, transform?, tracking? }`, émis en `--sd-font-display`, `--sd-display-weight`, `--sd-display-stretch` (nombre, 100 = normal, 75 = condensé), `--sd-display-transform` et `--sd-display-tracking`. La base les définit (Bricolage Grotesque 800, `none`, 100) ; un thème n'émet que ce qu'il change.

```html
<h1 class="sd-display">Titre</h1>
```

`.sd-display` (dans `type.css`, inclus dans `all-<produit>.css`) applique ces variables, dont `font-stretch` et `font-variation-settings: 'wdth' <stretch>`. Tailwind : `font-display` prend la police et l'axe `wdth` du thème (v3 et v4) ; poids, casse et interlettrage passent par `.sd-display`. En React Native, `getTheme().font.display` suit la police du thème et `getTheme().display` donne les autres valeurs (largeur et casse à appliquer à la main).

## Animations signature

Dans `motion.css`, toutes coupées sous `prefers-reduced-motion`. Une seule signature forte par écran.

| Classe | Effet | Réglage |
| --- | --- | --- |
| `.sd-marquee` | Défilement horizontal infini. Parent `overflow: hidden`, piste = contenu **dupliqué deux fois** (2e copie en `aria-hidden`) | `--sd-marquee-duration` (défaut 30s) |
| `.sd-ink` | Révélation gauche -> droite (clip-path) à la création de l'élément | `--i` (décalage) |
| `.sd-punch` | Entrée avec rebond « spring » | `--i` |
| `.sd-stamp` | Tampon : scale 1.8 -> 1 avec rotation | `--sd-stamp-rotate` (défaut -8deg) |
| `.sd-mark` | Surlignage marqueur animé (background-size) | `--sd-mark` (couleur) |
| `.sd-route` | Pointillés SVG qui défilent (à poser sur un `<path>` ou `<line>`) | `stroke` à définir ; dash fixé par la classe |

`initCountUp(selector = '[data-count-to]')` anime des compteurs : chaque élément passe de 0 à `data-count-to` en 1,6 s (easing out cubic) quand il entre dans la fenêtre ; les décimales suivent celles de l'attribut. Sous reduced-motion, la valeur finale est affichée immédiatement. Renvoie une fonction de nettoyage.

```html
<span data-count-to="12840">12 840</span> <span data-count-to="98.6">98,6</span>
```

```js
import { initCountUp } from '@sdmm/design/js';
initCountUp();
```

Le mode sombre suit la même mécanique partout : `prefers-color-scheme` tant qu'aucun `data-theme="light"` n'est posé sur `<html>`, ou `data-theme="dark"` pour le forcer.

## Intégration par stack

### Tailwind 4 (Next 16, portfolio)

```css
/* globals.css */
@import "tailwindcss";
@import "@sdmm/design/css/all-dailylingua.css";
@import "@sdmm/design/tailwind/v4.css";
```

Classes disponibles : `bg-bg`, `bg-surface`, `bg-surface-2`, `text-ink`, `text-muted`, `border-line`, `bg-accent`, `text-accent-strong`, `text-accent-ink`, `text-accent-2`, `text-live`, `text-wip`, `text-danger`, `font-display`, `rounded-card`, `ease-spring`, `duration-fast|base|slow`. Le variant `dark:` suit `data-theme` et la préférence système.

### Tailwind 3 (Next 14)

```js
// tailwind.config.js
module.exports = {
  presets: [require('@sdmm/design/tailwind/preset')],
  content: ['./app/**/*.{ts,tsx}'],
};
```

```css
/* app/globals.css */
@import '@sdmm/design/css/all-mma.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Mêmes noms de classes que Tailwind 4. Les couleurs passent par `var(--sd-*)` avec `color-mix`, donc les modificateurs d'opacité (`bg-accent/50`) fonctionnent dans les navigateurs récents.

### CSS pur (Vite/React, GeoGame web)

```css
@import '@sdmm/design/css/all-geogame.css';

.btn {
  background: var(--sd-accent);
  color: var(--sd-accent-ink);
  border-radius: var(--sd-radius-pill);
  transition: transform var(--sd-dur-base) var(--sd-ease-spring);
}
.link { color: var(--sd-accent-strong); }
```

Dans le `<head>`, avant le CSS, pour éviter le flash de thème (et poser la classe `.js` qui active `.sd-reveal`) :

```js
import { themeScript } from '@sdmm/design/js';
// SSR : <script dangerouslySetInnerHTML={{ __html: themeScript }} />
```

Puis, côté client :

```js
import { initReveal, initTilt, initTheme } from '@sdmm/design/js';
initTheme();   // boutons [data-theme-toggle], choix mémorisé dans localStorage ("sd-theme")
initReveal();  // éléments .sd-reveal (décalage via style="--i: 2")
initTilt();    // éléments .sd-tilt, pointeur fin uniquement
```

Les trois renvoient (ou exposent) une fonction de nettoyage : à appeler dans le cleanup d'un `useEffect`.

### Expo / Reanimated (GeoGame mobile)

```ts
import { Easing, withTiming } from 'react-native-reanimated';
import { getTheme } from '@sdmm/design/native';

const t = getTheme('geogame', useColorScheme() === 'dark' ? 'dark' : 'light');

t.colors.accent;         // '#14a86b'
t.colors.accentStrong;   // texte coloré
t.radius.card;           // 20 (nombre)
t.font.display;          // 'BricolageGrotesque_700Bold' (famille expo-font)

const [x1, y1, x2, y2] = t.motion.easing.spring;
value.value = withTiming(1, {
  duration: t.motion.duration.base,          // 250
  easing: Easing.bezier(x1, y1, x2, y2),
});
```

Penser à désactiver les animations avec `useReducedMotion()` de Reanimated (ou `AccessibilityInfo.isReduceMotionEnabled`).

Polices : charger les familles via `@expo-google-fonts/bricolage-grotesque`, `@expo-google-fonts/inter` et `@expo-google-fonts/jetbrains-mono` (les noms de `t.font.*` correspondent à leurs exports).

### NativeWind 4 (MMA Universe mobile, Tailwind 3.4)

```js
// tailwind.config.js (CommonJS)
const { nativewindPreset } = require('@sdmm/design/native');

module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset'), nativewindPreset('mma')],
};
```

```tsx
<View className="bg-bg dark:bg-dark-bg">
  <Text className="font-display text-ink dark:text-dark-ink">Titre</Text>
  <Pressable className="bg-accent dark:bg-dark-accent rounded-card" />
</View>
```

Le preset expose les couleurs **claires** sous leur nom (`bg-bg`, `text-ink`, `bg-accent`...) et les couleurs sombres préfixées `dark-` (`dark:bg-dark-bg`). Pas de variables CSS : ce sont des valeurs brutes.

## Règles d'usage

- **`accent` pour les actions et la marque** : boutons pleins, liens d'action, éléments sélectionnés, focus. Le texte posé dessus utilise `accent-ink`.
- **`accent-strong` pour le texte coloré** posé sur `bg` ou `surface` (contraste AA >= 4.5:1). Ne jamais écrire du texte en `accent`.
- **`accent-2` est secondaire** : une touche, pas un second bouton principal.
- **Une seule signature animée forte par écran** (hero animé, canvas, tilt...). Le reste reste discret : reveal, transitions courtes.
- **Toujours un état `prefers-reduced-motion`** : `base.css` et `motion.css` le gèrent pour leurs utilitaires ; `initReveal`, `initTilt`, `initCountUp` et `mountCanvas` le respectent. Tout code d'animation maison doit faire de même.
- Les statuts (`live`, `wip`, `danger`) sont partagés et ne changent pas d'un produit à l'autre.
- Un thème qui surcharge des neutres doit garder les seuils de contraste (ink/bg, muted/bg, accent-strong/bg, accent-ink/accent, statuts/surface) : c'est vérifié sur les neutres effectifs.
- `wip` clair vaut `#c48700` (et non `#c58700`) pour tenir 3:1 sur la surface `#fffcf6` de DailyLingua.
- Contraste de `accent-ink` sur `accent` : >= 4.5:1 partout, sauf **portfolio en clair** (blanc sur `#ff4f1a` = 3.29:1), où `accent-ink` est réservé au grand texte (>= 24px, ou >= 18.66px en gras) ou aux icônes. Les tests (`npm test`) vérifient ces seuils pour chaque produit et chaque scheme.

## Versionnement

Versionnement sémantique, une release = un tag git `vX.Y.Z` avec `dist/` commité.

Publier une version (le paquet n'est jamais poussé automatiquement) :

```bash
# modifier src/tokens.ts ou le code, puis
npm run build && npm test && npm run check
npm version minor --no-git-tag-version   # ou patch / major
git add -A && git commit -m "release: vX.Y.Z"
git tag vX.Y.Z
git push && git push --tags
```

Mettre à jour un projet consommateur :

```bash
npm i github:SDMM27/sdmm-design#vX.Y.Z
```

- `patch` : correction (valeur de contraste, bug JS).
- `minor` : ajout (nouveau thème, nouvel utilitaire).
- `major` : renommage ou suppression d'une variable `--sd-*`, d'un export ou d'une classe.

## Développement

```bash
npm install
npm run build   # régénère dist/ et showcase/index.html
npm test        # contrastes (neutres effectifs) + thèmes + dist/ à jour avec src/tokens.ts
npm run check   # tsc --noEmit
```

Ne jamais éditer `dist/` à la main : le test de fraîcheur échoue si `dist/` ne correspond pas à `src/tokens.ts`.
