// Génère dist/ et showcase/index.html à partir de src/tokens.ts : `npm run build`.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { generate, ROOT } from './generate';

rmSync(path.join(ROOT, 'dist'), { recursive: true, force: true });
const files = generate();
for (const [rel, text] of files) {
  const abs = path.join(ROOT, rel);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, text);
}
console.log(`${files.size} fichiers générés (dist/ + showcase/index.html).`);
