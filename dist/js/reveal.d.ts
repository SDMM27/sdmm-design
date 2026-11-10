export interface RevealOptions {
    /** Éléments à révéler. Défaut : `.sd-reveal`. */
    selector?: string;
}
/**
 * Apparition au scroll : pose `.is-visible` quand l'élément entre dans la fenêtre.
 * Sans IntersectionObserver ou avec prefers-reduced-motion, tout est visible immédiatement.
 * Renvoie une fonction de nettoyage.
 */
export declare function initReveal(options?: RevealOptions): () => void;
