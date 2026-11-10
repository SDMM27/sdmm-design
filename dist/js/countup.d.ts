/**
 * Compteur animé : chaque élément `[data-count-to]` passe de 0 à sa valeur en 1,6 s (easing out cubic),
 * lancé quand il entre dans la fenêtre. Les décimales suivent celles de `data-count-to`.
 * Sans IntersectionObserver ou avec prefers-reduced-motion, la valeur finale s'affiche immédiatement.
 * Renvoie une fonction de nettoyage.
 */
export declare function initCountUp(selector?: string): () => void;
