# @sdmm/design

Design system partagé des projets de Sacha Don (GitHub SDMM27). Le portfolio en est la référence visuelle.

## Principe

**Une base commune, un accent par produit.**

- Base commune à tous les produits : neutres (clair et sombre), statuts (`live`, `wip`, `danger`), typographies (Bricolage Grotesque, Inter, JetBrains Mono), rayons, ombres et motion.
- Chaque produit n'ajoute que son jeu d'accents : `accent`, `accent-strong`, `accent-ink`, `accent-2`.

Produits disponibles : `portfolio`, `geogame`, `mma`, `dailylingua`.

La source unique est `src/tokens.ts`. `npm run build` en génère tout `dist/` (qui est commité, car il n'y a pas de build à l'installation) et `showcase/index.html`.

Pour voir le résultat : ouvrir `showcase/index.html` (sélecteur de produit, clair/sombre, composants, animations).

## Installation

```bash
npm i github:SDMM27/sdmm-design#v1.0.0
```

Polices (à charger dans le `<head>`, ou via `next/font` / `expo-font`) :

```
https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700..800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap
```

Contenu du paquet :

| Import | Rôle |
| --- | --- |
| `@sdmm/design/css/base.css` | Variables `--sd-*` (neutres, statuts, polices, rayons, ombres, motion), `::selection`, `:focus-visible`, reduced-motion |
| `@sdmm/design/css/themes/<produit>.css` | Les 4 variables d'accent du produit |
| `@sdmm/design/css/motion.css` | Utilitaires `.sd-reveal`, `.sd-tilt`, `.sd-spring`, `.sd-pulse-dot`, `.sd-shimmer`, `.sd-toast` |
| `@sdmm/design/css/all-<produit>.css` | Les trois ci-dessus en un seul import |
| `@sdmm/design/tailwind/v4.css` | Tailwind 4 : `@custom-variant dark` et `@theme inline` |
| `@sdmm/design/tailwind/preset` | Preset Tailwind 3 |
| `@sdmm/design/native` | React Native : `getTheme`, `nativewindPreset` |
| `@sdmm/design/js` | `initReveal`, `initTilt`, `initTheme`, `themeScript`, `mountCanvas`, `alpha`, `readPalette` |

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
- **Toujours un état `prefers-reduced-motion`** : `base.css` et `motion.css` le gèrent pour leurs utilitaires ; `initReveal`, `initTilt` et `mountCanvas` le respectent. Tout code d'animation maison doit faire de même.
- Les statuts (`live`, `wip`, `danger`) sont partagés et ne changent pas d'un produit à l'autre.
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
npm test        # contrastes + dist/ à jour avec src/tokens.ts
npm run check   # tsc --noEmit
```

Ne jamais éditer `dist/` à la main : le test de fraîcheur échoue si `dist/` ne correspond pas à `src/tokens.ts`.
