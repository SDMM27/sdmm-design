export interface Palette {
    bg: string;
    surface: string;
    surface2: string;
    ink: string;
    muted: string;
    line: string;
    accent: string;
    accentStrong: string;
    accentInk: string;
    accent2: string;
    live: string;
    wip: string;
    danger: string;
}
export interface Pointer {
    x: number;
    y: number;
    inside: boolean;
    down: boolean;
}
export interface CanvasState {
    el: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    dpr: number;
    pointer: Pointer;
    colors: Palette;
    reduced: boolean;
    /** Secondes écoulées depuis le montage (n'avance pas en reduced motion). */
    time: number;
}
export interface CanvasHooks {
    frame(s: CanvasState, dt: number): void;
    resize?(s: CanvasState): void;
    theme?(s: CanvasState): void;
    pointerdown?(s: CanvasState, e: PointerEvent): void;
    pointermove?(s: CanvasState, e: PointerEvent): void;
    pointerup?(s: CanvasState, e: PointerEvent): void;
    destroy?(): void;
}
/** Lit les couleurs courantes (thème + scheme) depuis les variables --sd-* de <html>. */
export declare function readPalette(): Palette;
/** Applique une opacité à une couleur #rgb / #rrggbb ; les autres formats sont renvoyés tels quels. */
export declare function alpha(color: string, a: number): string;
export declare const prefersReducedMotion: () => boolean;
export declare const mono: (size: number, weight?: number) => string;
export declare const display: (size: number, weight?: number) => string;
export declare function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void;
/**
 * Monte un canvas dans `el` et pilote la boucle de dessin via les hooks de `setup`.
 * Renvoie une fonction de nettoyage.
 */
export declare function mountCanvas(el: HTMLElement, setup: (s: CanvasState) => CanvasHooks): () => void;
