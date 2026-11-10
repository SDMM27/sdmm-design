export const DEFAULT_STORAGE_KEY = 'sd-theme';
/**
 * Snippet anti-flash à inliner dans <head> AVANT le CSS : applique le thème enregistré
 * (data-theme sur <html>) et pose la classe `.js` qui active les utilitaires de reveal.
 * Clé de stockage par défaut : « sd-theme ».
 */
export const themeScript = '(function(){try{var t=localStorage.getItem("sd-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}document.documentElement.classList.add("js")})();';
/** Thème effectif : data-theme s'il est posé, sinon préférence système. */
export function currentTheme() {
    const set = document.documentElement.dataset.theme;
    if (set === 'light' || set === 'dark')
        return set;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
/** Branche les boutons de bascule clair/sombre et mémorise le choix (try/catch : stockage facultatif). */
export function initTheme(options = {}) {
    const key = options.storageKey ?? DEFAULT_STORAGE_KEY;
    const buttons = document.querySelectorAll(options.toggleSelector ?? '[data-theme-toggle]');
    const sync = () => buttons.forEach((b) => b.setAttribute('aria-pressed', String(currentTheme() === 'dark')));
    const set = (scheme) => {
        document.documentElement.dataset.theme = scheme;
        try {
            localStorage.setItem(key, scheme);
        }
        catch {
            // stockage indisponible : le thème vaut pour la page courante seulement
        }
        sync();
    };
    const toggle = () => set(currentTheme() === 'dark' ? 'light' : 'dark');
    buttons.forEach((b) => b.addEventListener('click', toggle));
    sync();
    return {
        current: currentTheme,
        set,
        toggle,
        destroy: () => buttons.forEach((b) => b.removeEventListener('click', toggle)),
    };
}
