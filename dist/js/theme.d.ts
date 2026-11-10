export type ColorScheme = 'light' | 'dark';
export declare const DEFAULT_STORAGE_KEY = "sd-theme";
/**
 * Snippet anti-flash à inliner dans <head> AVANT le CSS : applique le thème enregistré
 * (data-theme sur <html>) et pose la classe `.js` qui active les utilitaires de reveal.
 * Clé de stockage par défaut : « sd-theme ».
 */
export declare const themeScript = "(function(){try{var t=localStorage.getItem(\"sd-theme\");if(t===\"light\"||t===\"dark\")document.documentElement.setAttribute(\"data-theme\",t)}catch(e){}document.documentElement.classList.add(\"js\")})();";
export interface ThemeOptions {
    /** Clé localStorage. Défaut : « sd-theme ». */
    storageKey?: string;
    /** Sélecteur des boutons de bascule. Défaut : `[data-theme-toggle]`. */
    toggleSelector?: string;
}
export interface ThemeController {
    current(): ColorScheme;
    set(scheme: ColorScheme): void;
    toggle(): void;
    destroy(): void;
}
/** Thème effectif : data-theme s'il est posé, sinon préférence système. */
export declare function currentTheme(): ColorScheme;
/** Branche les boutons de bascule clair/sombre et mémorise le choix (try/catch : stockage facultatif). */
export declare function initTheme(options?: ThemeOptions): ThemeController;
