export interface TiltOptions {
    /** Éléments à incliner. Défaut : `.sd-tilt`. */
    selector?: string;
    /** Inclinaison maximale en degrés. Défaut : 4. */
    max?: number;
}
/**
 * Léger tilt 3D au survol (variables --rx / --ry lues par `.sd-tilt`).
 * Pointeur fin uniquement, désactivé avec prefers-reduced-motion. Renvoie une fonction de nettoyage.
 */
export declare function initTilt(options?: TiltOptions): () => void;
