// Calcule en mémoire tous les fichiers générés (dist/ + showcase/index.html).
// Utilisé par build.ts (écriture) et par le test de fraîcheur (comparaison).
import { buildSync } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { nativeDts, nativeJs, tailwindPreset, tailwindPresetDts, tailwindV4 } from './adapters';
import { allCss, baseCss, motionCss, themeCss, typeCss } from './css';
import { showcaseHtml } from './showcase';
import { themeNames } from '../src/tokens';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JS_SRC = path.join(ROOT, 'src', 'js');

const slash = (p: string) => p.split(path.sep).join('/');

/** Compile src/js en ESM + .d.ts, sans rien écrire sur le disque. */
function compileJs(): Map<string, string> {
  const options: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
    types: [],
    strict: true,
    declaration: true,
    skipLibCheck: true,
    newLine: ts.NewLineKind.LineFeed,
    rootDir: JS_SRC,
    outDir: path.join(ROOT, 'dist', 'js'),
  };
  const host = ts.createCompilerHost(options);
  const out = new Map<string, string>();
  host.writeFile = (file, text) => {
    out.set(slash(path.relative(ROOT, file)), text);
  };
  const files = ['index', 'reveal', 'tilt', 'theme', 'canvas', 'fonts', 'countup'].map((n) => path.join(JS_SRC, `${n}.ts`));
  const program = ts.createProgram(files, options, host);
  const result = program.emit();
  const errors = [...ts.getPreEmitDiagnostics(program), ...result.diagnostics].filter(
    (d) => d.category === ts.DiagnosticCategory.Error,
  );
  if (errors.length) {
    throw new Error(ts.formatDiagnostics(errors, { getCanonicalFileName: (f) => f, getCurrentDirectory: () => ROOT, getNewLine: () => '\n' }));
  }
  return out;
}

/** Bundle IIFE de src/js pour le showcase autonome. */
function bundleForShowcase(): string {
  const res = buildSync({
    entryPoints: [path.join(JS_SRC, 'index.ts')],
    bundle: true,
    format: 'iife',
    globalName: 'SdDesign',
    target: 'es2020',
    write: false,
    legalComments: 'none',
  });
  return (res.outputFiles[0]?.text ?? '').trim();
}

export function generate(): Map<string, string> {
  const files = new Map<string, string>();
  files.set('dist/css/base.css', baseCss());
  files.set('dist/css/type.css', typeCss());
  files.set('dist/css/motion.css', motionCss());
  for (const name of themeNames) {
    files.set(`dist/css/themes/${name}.css`, themeCss(name));
    files.set(`dist/css/all-${name}.css`, allCss(name));
  }
  files.set('dist/tailwind/v4.css', tailwindV4());
  files.set('dist/tailwind/preset.cjs', tailwindPreset());
  files.set('dist/tailwind/preset.d.cts', tailwindPresetDts());
  files.set('dist/native/index.js', nativeJs());
  files.set('dist/native/index.d.ts', nativeDts());
  // dist/native est en CommonJS (require() depuis tailwind.config.js) alors que le paquet est en ESM.
  files.set('dist/native/package.json', '{\n  "type": "commonjs"\n}\n');
  for (const [file, text] of compileJs()) files.set(file, text);
  files.set('showcase/index.html', showcaseHtml(bundleForShowcase()));
  return files;
}
