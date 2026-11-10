// Génère showcase/index.html : page autonome (CSS et JS inlinés, seule la police vient de Google Fonts).
import { baseCss, motionCss, themeBlocks, typeCss, BANNER } from './css';
import { fontsUrl } from '../src/js/fonts';
import { themeScript } from '../src/js/theme';
import { font, neutrals, radius, shadow, status, themeDisplay, themeNames, themes } from '../src/tokens';

// Toutes les polices de titre à la fois (le showcase bascule d'un produit à l'autre) : Bricolage avec l'axe wdth + Newsreader.
const showcaseFontsUrl = fontsUrl('mma').replace(
  '&family=Inter',
  '&family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..600&family=Inter',
);

// Mêmes déclarations que .sd-display (type.css), pour les titres et exemples du showcase.
const displayProps =
  "font-family: var(--sd-font-display); font-weight: var(--sd-display-weight); font-stretch: calc(var(--sd-display-stretch) * 1%); font-variation-settings: 'wdth' var(--sd-display-stretch); text-transform: var(--sd-display-transform); letter-spacing: var(--sd-display-tracking);";

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const swatch = (v: string, label = v.replace('--sd-', '')) =>
  `<div class="swatch"><div class="chip-color" style="background:var(${v})"></div><b>${label}</b><code data-var="${v}"></code></div>`;

const showcaseCss = `
*, *::before, *::after { box-sizing: border-box; }
html { background: var(--sd-bg); color: var(--sd-ink); font-family: var(--sd-font-sans); -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
body { margin: 0; background: var(--sd-bg); overflow-x: hidden; line-height: 1.6; }
h1, h2, h3 { ${displayProps} line-height: 1.1; margin: 0; }
p { margin: 0; }
code { font-family: var(--sd-font-mono); font-size: 0.75rem; color: var(--sd-muted); overflow-wrap: anywhere; }
.wrap { max-width: 64rem; margin: 0 auto; padding: 0 1rem; }
.bar { position: sticky; top: 0; z-index: 40; background: color-mix(in srgb, var(--sd-bg) 88%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--sd-line); }
.bar .wrap { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between; padding-top: 0.75rem; padding-bottom: 0.75rem; }
.seg { display: flex; flex-wrap: wrap; gap: 0.375rem; }
.seg button, .tog { font: 600 0.8125rem var(--sd-font-sans); color: var(--sd-ink); background: var(--sd-surface); border: 1px solid var(--sd-line); border-radius: var(--sd-radius-pill); padding: 0.4rem 0.85rem; cursor: pointer; }
.seg button[aria-pressed="true"] { background: var(--sd-accent); border-color: var(--sd-accent); color: var(--sd-accent-ink); }
@media (max-width: 640px) { .bar { position: static; } }
header.hero { padding: 3rem 0 2rem; }
header.hero h1 { font-size: clamp(2.25rem, 9vw, 3.75rem); }
header.hero h1 em { font-style: normal; color: var(--sd-accent-strong); }
header.hero p { color: var(--sd-muted); max-width: 40rem; margin-top: 1rem; }
section { padding: 2rem 0; border-top: 1px solid var(--sd-line); }
section > .wrap > h2 { font-size: 1.875rem; margin-bottom: 0.4rem; }
section > .wrap > .lead { color: var(--sd-muted); margin-bottom: 1.25rem; }
h3 { font-size: 1.125rem; margin: 1.5rem 0 0.75rem; }
.grid { display: grid; gap: 0.875rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 9.5rem), 1fr)); }
.swatch { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
.swatch b { font-size: 0.8125rem; }
.chip-color { height: 3.5rem; border-radius: var(--sd-radius-md); border: 1px solid var(--sd-line); }
.type-row { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.25rem 1rem; padding: 0.6rem 0; border-bottom: 1px solid var(--sd-line); }
.type-row code { min-width: 6.5rem; }
.type-row .s { ${displayProps} }
.fonts { display: grid; gap: 0.75rem; }
.fonts div { background: var(--sd-surface); border: 1px solid var(--sd-line); border-radius: var(--sd-radius-md); padding: 0.75rem 1rem; }
.box { background: var(--sd-surface); border: 1px solid var(--sd-line); height: 5rem; display: grid; place-items: center; font: 500 0.75rem var(--sd-font-mono); color: var(--sd-muted); }
.shadow-box { height: 6rem; border-radius: var(--sd-radius-card); background: var(--sd-surface); display: grid; place-items: center; font: 500 0.75rem var(--sd-font-mono); color: var(--sd-muted); }
.comp { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr)); align-items: start; }
.panel { background: var(--sd-surface); border: 1px solid var(--sd-line); border-radius: var(--sd-radius-card); padding: 1.25rem; box-shadow: var(--sd-shadow-md); }
.panel h3 { margin-top: 0; }
.row { display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center; }
.btn { font: 600 1rem var(--sd-font-sans); border-radius: var(--sd-radius-pill); padding: 0.7rem 1.3rem; border: 1px solid transparent; cursor: pointer; transition: transform var(--sd-dur-base) var(--sd-ease-spring), background var(--sd-dur-fast); }
.btn:hover { transform: translateY(-2px); }
.btn:active { transform: scale(0.97); }
.btn-primary { background: var(--sd-accent); color: var(--sd-accent-ink); }
.btn-secondary { background: transparent; color: var(--sd-ink); border-color: var(--sd-line); }
.btn-secondary:hover { background: var(--sd-surface-2); }
.link { color: var(--sd-accent-strong); font-weight: 600; text-underline-offset: 3px; }
.badge { display: inline-flex; align-items: center; gap: 0.4rem; font: 500 0.75rem var(--sd-font-mono); color: var(--sd-ink); background: var(--sd-surface-2); border: 1px solid var(--sd-line); border-radius: var(--sd-radius-pill); padding: 0.2rem 0.65rem; }
.badge i { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--c); --sd-pulse: var(--c); }
.chip { font: 500 0.8125rem var(--sd-font-sans); color: var(--sd-ink); background: var(--sd-surface-2); border: 1px solid var(--sd-line); border-radius: var(--sd-radius-pill); padding: 0.35rem 0.8rem; cursor: pointer; }
.chip[aria-pressed="true"] { background: var(--sd-accent); border-color: var(--sd-accent); color: var(--sd-accent-ink); }
label { display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.35rem; }
input[type="text"] { width: 100%; font: 400 1rem var(--sd-font-sans); color: var(--sd-ink); background: var(--sd-surface); border: 1px solid var(--sd-line); border-radius: var(--sd-radius-md); padding: 0.65rem 0.85rem; }
input[type="text"]::placeholder { color: var(--sd-muted); }
input[type="text"]:focus { border-color: var(--sd-accent); }
.hint { font-size: 0.8125rem; color: var(--sd-muted); margin-top: 0.35rem; }
.toast-body { display: flex; align-items: center; gap: 0.6rem; background: var(--sd-ink); color: var(--sd-bg); border-radius: var(--sd-radius-pill); padding: 0.7rem 1.1rem; box-shadow: var(--sd-shadow-lg); font-size: 0.875rem; font-weight: 500; }
.toast-body i { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--sd-live); flex: none; }
.demo-items { display: grid; gap: 0.6rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 8rem), 1fr)); margin-bottom: 0.9rem; }
.demo-items > div { background: var(--sd-surface-2); border-radius: var(--sd-radius-md); padding: 0.9rem; font: 500 0.75rem var(--sd-font-mono); color: var(--sd-muted); }
.spring-ball { width: 3rem; height: 3rem; border-radius: 50%; background: var(--sd-accent-2); transition: transform var(--sd-dur-slow) var(--sd-ease-spring); }
.spring-ball.on { transform: translateX(var(--dx, 8rem)); }
.skel { height: 0.9rem; border-radius: var(--sd-radius-sm); margin-bottom: 0.5rem; }
.canvas-box { height: 8.5rem; border-radius: var(--sd-radius-md); overflow: hidden; background: var(--sd-surface-2); }
header.hero h1 { overflow-wrap: anywhere; }
.titles { display: grid; gap: 0.875rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); }
.titles .panel { min-width: 0; overflow-wrap: anywhere; }
.titles .panel > code { display: block; margin-bottom: 0.6rem; }
.titles .t1 { font-size: 2.25rem; line-height: 1.05; margin: 0 0 0.5rem; }
.titles .t2 { font-size: 1.5rem; line-height: 1.15; margin: 0 0 0.4rem; }
.titles .t3 { font-size: 1.125rem; line-height: 1.25; margin: 0; }
.marquee-wrap { overflow: hidden; border-block: 1px solid var(--sd-line); padding: 0.6rem 0; margin-bottom: 0.9rem; }
.marquee-wrap .sd-marquee > div { display: flex; gap: 1.5rem; padding-right: 1.5rem; flex: none; white-space: nowrap; font: 600 0.9375rem var(--sd-font-mono); }
.sig-demo { min-height: 4rem; display: flex; flex-wrap: wrap; align-items: center; margin-bottom: 0.9rem; }
.stamp { font: 800 1.25rem var(--sd-font-display); text-transform: uppercase; color: var(--sd-danger); border: 3px solid var(--sd-danger); border-radius: var(--sd-radius-sm); padding: 0.15rem 0.7rem; --sd-stamp-rotate: -7deg; }
.punch-chip { background: var(--sd-accent); color: var(--sd-accent-ink); border-radius: var(--sd-radius-pill); padding: 0.4rem 1rem; font: 700 1rem var(--sd-font-sans); }
.ink-text { display: inline-block; font-size: 1.5rem; ${displayProps} }
.route-svg { width: 100%; height: 4rem; margin-bottom: 0.9rem; }
.route-svg path { fill: none; stroke: var(--sd-accent); stroke-width: 3; stroke-linecap: round; }
.route-svg circle { fill: var(--sd-accent-2); }
.count { font: 800 2.25rem var(--sd-font-display); color: var(--sd-accent-strong); font-variant-numeric: tabular-nums; }
footer { padding: 2rem 0 4rem; color: var(--sd-muted); font-size: 0.875rem; }
`;

const showcaseScript = `
(function () {
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function paintValues() {
    var cs = getComputedStyle(root);
    $$('[data-var]').forEach(function (el) { el.textContent = cs.getPropertyValue(el.dataset.var).trim(); });
  }
  function setProduct(p) {
    root.dataset.product = p;
    $$('[data-product-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.productBtn === p)); });
    try { localStorage.setItem('sd-showcase-product', p); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('sd-showcase-product'); } catch (e) {}
  var qs = new URLSearchParams(location.search).get('product');
  setProduct(qs || saved || 'portfolio');
  $$('[data-product-btn]').forEach(function (b) { b.addEventListener('click', function () { setProduct(b.dataset.productBtn); }); });

  SdDesign.initTheme();
  new MutationObserver(paintValues).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-product'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintValues);
  paintValues();
  SdDesign.initReveal();
  SdDesign.initTilt();
  SdDesign.initCountUp();

  // Rejouer une animation d'entrée : remplace le nœud par un clone pour relancer l'animation CSS.
  $$('[data-replay]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.dataset.replay);
      el.parentNode.replaceChild(el.cloneNode(true), el);
    });
  });
  $('#count-btn').addEventListener('click', function () { SdDesign.initCountUp('#count-demo [data-count-to]'); });

  $$('.chip').forEach(function (c) { c.addEventListener('click', function () { c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true')); }); });

  var toast = $('#toast'), tt;
  $('#toast-btn').addEventListener('click', function () {
    toast.classList.add('is-visible');
    clearTimeout(tt);
    tt = setTimeout(function () { toast.classList.remove('is-visible'); }, 2600);
  });

  $('#reveal-btn').addEventListener('click', function () {
    var items = $$('#reveal-demo > div');
    items.forEach(function (i) { i.classList.remove('is-visible'); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { items.forEach(function (i) { i.classList.add('is-visible'); }); }); });
  });

  var ball = $('#spring-ball');
  $('#spring-btn').addEventListener('click', function () {
    var track = ball.parentElement;
    ball.style.setProperty('--dx', Math.max(0, track.clientWidth - ball.offsetWidth) + 'px');
    ball.classList.toggle('on');
  });

  SdDesign.mountCanvas($('#canvas-demo'), function () {
    var a = SdDesign;
    return {
      frame: function (s) {
        var c = s.ctx, p = s.colors;
        c.clearRect(0, 0, s.w, s.h);
        c.strokeStyle = a.alpha(p.line, 1);
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(0, s.h / 2); c.lineTo(s.w, s.h / 2); c.stroke();
        var cols = [p.accent, p.accent2, p.accentStrong, p.live, p.wip];
        for (var i = 0; i < cols.length; i++) {
          var t = s.time * (0.6 + i * 0.25) + i * 1.3;
          var x = s.w * (0.12 + 0.76 * (i / (cols.length - 1)));
          var y = s.h / 2 + Math.sin(t) * (s.h * 0.3);
          var near = s.pointer.inside ? Math.max(0, 1 - Math.hypot(s.pointer.x - x, s.pointer.y - y) / 80) : 0;
          c.fillStyle = a.alpha(cols[i], 0.25); c.beginPath(); c.arc(x, y, 18 + near * 10, 0, 7); c.fill();
          c.fillStyle = cols[i]; c.beginPath(); c.arc(x, y, 9 + near * 4, 0, 7); c.fill();
        }
        c.fillStyle = p.muted; c.font = a.mono(11); c.fillText(s.reduced ? 'reduced motion : image fixe' : 'canvas : couleurs lues via --sd-*', 10, s.h - 10);
      }
    };
  });
})();
`;

export function showcaseHtml(libJs: string): string {
  const productButtons = themeNames
    .map((n) => `<button type="button" data-product-btn="${n}" aria-pressed="false">${themes[n].label}</button>`)
    .join('');
  const themeCssAll = themeNames.map((n) => themeBlocks(n, `:root[data-product="${n}"]`)).join('\n\n');
  const strip = (css: string) => css.replace(BANNER, '').trim();

  // Aperçu des titres : chaque carte force la police de titre de SON produit, quel que soit le produit courant.
  const previewCss = themeNames
    .map((n) => {
      const d = themeDisplay(n);
      return `.pv-${n} { --sd-font-display: ${d.family}; --sd-display-weight: ${d.weight}; --sd-display-stretch: ${d.stretch}; --sd-display-transform: ${d.transform}; --sd-display-tracking: ${d.tracking}; }`;
    })
    .join('\n');
  const titlePanels = themeNames
    .map((n) => {
      const d = themeDisplay(n);
      const name = d.family.split(',')[0]!.replace(/"/g, '');
      const spec = [name, d.weight, d.stretch !== 100 && `wdth ${d.stretch}`, d.transform !== 'none' && d.transform, d.tracking].filter(Boolean).join(' · ');
      return `<div class="panel pv-${n}"><code>${themes[n].label} : ${esc(spec)}</code><p class="sd-display t1">Géographie du monde</p><p class="sd-display t2">Le combat de la nuit</p><p class="sd-display t3">Un titre de section, Aa 0123</p></div>`;
    })
    .join('');

  const neutralSwatches = Object.keys(neutrals).map((k) => swatch(`--sd-${k}`)).join('');
  const statusSwatches = Object.keys(status).map((k) => swatch(`--sd-${k}`)).join('');
  const accentSwatches = ['accent', 'accent-strong', 'accent-ink', 'accent-2'].map((k) => swatch(`--sd-${k}`)).join('');
  const typeRows = Object.entries(font.scale)
    .map(
      ([k, v]) =>
        `<div class="type-row"><code>${k} · ${v.size * 16}px</code><span class="s" style="font-size:var(--sd-text-${k});line-height:${v.line}">Aa Sacha</span></div>`,
    )
    .join('');
  const radii = Object.keys(radius)
    .map((k) => `<div class="box" style="border-radius:var(--sd-radius-${k})">${k}</div>`)
    .join('');
  const shadows = (Object.keys(shadow) as (keyof typeof shadow)[])
    .map((k) => `<div class="shadow-box" style="box-shadow:var(--sd-shadow-${k})">shadow-${k}</div>`)
    .join('');

  return `<!doctype html>
<html lang="fr" data-product="portfolio">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>sdmm-design · showcase</title>
<meta name="description" content="Showcase du design system partagé de Sacha Don.">
<script>${themeScript}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${esc(showcaseFontsUrl)}">
<style>
${strip(baseCss())}

${strip(typeCss())}

${strip(motionCss())}

/* Un thème par produit, sélectionné par data-product sur <html> (dans un vrai projet : un seul fichier themes/<nom>.css). */
${themeCssAll}

${previewCss}
${showcaseCss}</style>
</head>
<body>
<div class="bar"><div class="wrap">
  <div class="seg" role="group" aria-label="Produit">${productButtons}</div>
  <button type="button" class="tog" data-theme-toggle aria-pressed="false">Clair / sombre</button>
</div></div>

<header class="hero"><div class="wrap">
  <h1 class="sd-reveal">sdmm-design : une base, <em>un accent</em> par produit.</h1>
  <p class="sd-reveal" style="--i:1">Neutres, typographies, rayons, ombres et motion communs ; chaque produit n'apporte que ses accents. Changez de produit et de mode en haut de page.</p>
</div></header>

<section><div class="wrap">
  <h2>Couleurs</h2>
  <p class="lead">Les valeurs affichées sont lues en direct sur les variables --sd-*.</p>
  <h3>Neutres</h3><div class="grid">${neutralSwatches}</div>
  <h3>Statuts</h3><div class="grid">${statusSwatches}</div>
  <h3>Accents du produit</h3><div class="grid">${accentSwatches}</div>
</div></section>

<section><div class="wrap">
  <h2>Typographie</h2>
  <p class="lead">Bricolage Grotesque par défaut pour les titres (800, -0.02em), Inter pour le texte, JetBrains Mono pour le code.</p>
  <div class="fonts">
    <div><code>--sd-font-display</code><div class="sd-display" style="font-size:1.875rem">Titre du produit courant</div></div>
    <div><code>--sd-font-sans</code><div style="font:400 1.125rem var(--sd-font-sans)">Inter : le corps du texte, lisible et neutre.</div></div>
    <div><code>--sd-font-mono</code><div style="font:500 1rem var(--sd-font-mono)">JetBrains Mono 0123</div></div>
  </div>
  <h3>Titres par produit</h3>
  <p class="lead">Chaque produit peut redéfinir la police de titre (classe .sd-display) ; les autres gardent Bricolage Grotesque.</p>
  <div class="titles">${titlePanels}</div>
  <h3>Échelle (produit courant)</h3>
  ${typeRows}
</div></section>

<section><div class="wrap">
  <h2>Rayons et ombres</h2>
  <p class="lead">Ombres chaudes et douces en clair, plus marquées en sombre.</p>
  <div class="grid">${radii}</div>
  <h3>Ombres</h3>
  <div class="grid">${shadows}</div>
</div></section>

<section><div class="wrap">
  <h2>Composants</h2>
  <p class="lead">Accent pour les actions et la marque, accent-strong pour le texte coloré.</p>
  <div class="comp">
    <div class="panel sd-tilt">
      <h3>Carte avec tilt</h3>
      <p style="color:var(--sd-muted);margin-bottom:1rem">Survolez à la souris : inclinaison 3D légère, pointeur fin uniquement. Voir <a class="link" href="#">le détail</a>.</p>
      <div class="row">
        <button type="button" class="btn btn-primary">Action principale</button>
        <button type="button" class="btn btn-secondary">Secondaire</button>
      </div>
    </div>
    <div class="panel">
      <h3>Badges et chips</h3>
      <div class="row" style="margin-bottom:1rem">
        <span class="badge"><i style="--c:var(--sd-live)"></i>en ligne</span>
        <span class="badge"><i class="sd-pulse-dot" style="--c:var(--sd-wip)"></i>en développement</span>
        <span class="badge"><i style="--c:var(--sd-danger)"></i>erreur</span>
      </div>
      <div class="row">
        <button type="button" class="chip" aria-pressed="true">Tout</button>
        <button type="button" class="chip" aria-pressed="false">Mobile</button>
        <button type="button" class="chip" aria-pressed="false">Web</button>
      </div>
    </div>
    <div class="panel">
      <h3>Champ et toast</h3>
      <label for="demo-input">Votre prénom</label>
      <input id="demo-input" type="text" placeholder="Sacha">
      <p class="hint">Le focus clavier utilise l'accent du produit.</p>
      <div class="row" style="margin-top:1rem"><button type="button" class="btn btn-secondary" id="toast-btn">Afficher un toast</button></div>
    </div>
  </div>
</div></section>

<section><div class="wrap">
  <h2>Animations</h2>
  <p class="lead">Une seule signature animée forte par écran. Tout est coupé sous prefers-reduced-motion.</p>
  <div class="comp">
    <div class="panel">
      <h3>Reveal décalé</h3>
      <div class="demo-items" id="reveal-demo">
        <div class="sd-reveal is-visible" style="--i:0">--i: 0</div>
        <div class="sd-reveal is-visible" style="--i:1">--i: 1</div>
        <div class="sd-reveal is-visible" style="--i:2">--i: 2</div>
      </div>
      <button type="button" class="btn btn-secondary" id="reveal-btn">Rejouer</button>
    </div>
    <div class="panel">
      <h3>Pulse, spring, shimmer</h3>
      <div class="row" style="margin-bottom:1rem">
        <span class="badge"><i class="sd-pulse-dot" style="--c:var(--sd-accent)"></i>pulse</span>
        <button type="button" class="btn btn-primary sd-spring">spring</button>
      </div>
      <div class="sd-shimmer skel" style="width:90%"></div>
      <div class="sd-shimmer skel" style="width:65%"></div>
      <div style="margin:1rem 0 0.75rem"><div class="spring-ball" id="spring-ball"></div></div>
      <button type="button" class="btn btn-secondary" id="spring-btn">Lancer la bille</button>
    </div>
    <div class="panel">
      <h3>Canvas</h3>
      <div class="canvas-box" id="canvas-demo"></div>
      <p class="hint">mountCanvas : DPR, pause hors écran, couleurs du thème courant.</p>
    </div>
  </div>
  <h3>Signature</h3>
  <p class="lead" style="margin-bottom:1rem">À n'utiliser qu'une fois par écran. Le défilement et les pointillés sont continus, les autres se rejouent.</p>
  <div class="comp">
    <div class="panel" style="grid-column: 1 / -1">
      <h3>.sd-marquee</h3>
      <div class="marquee-wrap">
        <div class="sd-marquee" style="--sd-marquee-duration:18s">
          <div><span>GEOGAME</span><span>·</span><span>MMA UNIVERSE</span><span>·</span><span>DAILYLINGUA</span><span>·</span><span>PORTFOLIO</span><span>·</span></div>
          <div aria-hidden="true"><span>GEOGAME</span><span>·</span><span>MMA UNIVERSE</span><span>·</span><span>DAILYLINGUA</span><span>·</span><span>PORTFOLIO</span><span>·</span></div>
        </div>
      </div>
      <p class="hint">Contenu dupliqué (2e copie en aria-hidden), durée via --sd-marquee-duration.</p>
    </div>
    <div class="panel">
      <h3>.sd-ink</h3>
      <div class="sig-demo"><span class="sd-ink ink-text" id="ink-demo">Révélé de gauche à droite</span></div>
      <button type="button" class="btn btn-secondary" data-replay="ink-demo">Rejouer</button>
    </div>
    <div class="panel">
      <h3>.sd-punch</h3>
      <div class="sig-demo"><span class="sd-punch punch-chip" id="punch-demo">Nouveau</span></div>
      <button type="button" class="btn btn-secondary" data-replay="punch-demo">Rejouer</button>
    </div>
    <div class="panel">
      <h3>.sd-stamp</h3>
      <div class="sig-demo"><span class="sd-stamp stamp" id="stamp-demo">Validé</span></div>
      <button type="button" class="btn btn-secondary" data-replay="stamp-demo">Rejouer</button>
    </div>
    <div class="panel">
      <h3>.sd-mark</h3>
      <div class="sig-demo" style="font-weight:600;font-size:1.125rem"><span>Un mot <span class="sd-mark" id="mark-demo">surligné au marqueur</span> dans la phrase.</span></div>
      <button type="button" class="btn btn-secondary" data-replay="mark-demo">Rejouer</button>
    </div>
    <div class="panel">
      <h3>.sd-route</h3>
      <svg class="route-svg" viewBox="0 0 300 64" role="img" aria-label="Itinéraire en pointillés"><path class="sd-route" d="M14 48 C 70 4, 120 60, 170 30 S 250 10, 286 26"/><circle cx="14" cy="48" r="6"/><circle cx="286" cy="26" r="6"/></svg>
      <p class="hint">Pointillés SVG qui défilent.</p>
    </div>
    <div class="panel" id="count-demo">
      <h3>initCountUp</h3>
      <div class="sig-demo"><span class="count" data-count-to="12840">12 840</span><span class="count" style="margin-left:1.25rem" data-count-to="98.6">98,6</span></div>
      <button type="button" class="btn btn-secondary" id="count-btn">Rejouer</button>
    </div>
  </div>
</div></section>

<footer><div class="wrap">@sdmm/design 1.0.0 · généré depuis src/tokens.ts</div></footer>

<div class="sd-toast" id="toast" role="status" aria-live="polite"><div class="toast-body"><i></i>Enregistré, tout est à jour.</div></div>

<script>
${libJs}
</script>
<script>${showcaseScript}</script>
</body>
</html>
`;
}
