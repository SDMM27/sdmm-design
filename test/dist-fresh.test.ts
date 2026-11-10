import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { generate, ROOT } from '../scripts/generate';

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const abs = path.join(dir, entry);
    return statSync(abs).isDirectory() ? listFiles(abs) : [path.relative(ROOT, abs).split(path.sep).join('/')];
  });
}

describe('dist/ et showcase/ à jour avec src/tokens.ts', () => {
  const expected = generate();

  it.each([...expected.keys()])('%s est identique au build en mémoire', (rel) => {
    const abs = path.join(ROOT, rel);
    expect(existsSync(abs), `${rel} manquant : lancer npm run build`).toBe(true);
    // Normalise les fins de ligne (checkout Windows avec autocrlf).
    const actual = readFileSync(abs, 'utf8').replace(/\r\n/g, '\n');
    expect(actual === expected.get(rel), `${rel} périmé : lancer npm run build`).toBe(true);
  });

  it('dist/ ne contient aucun fichier orphelin', () => {
    const onDisk = listFiles(path.join(ROOT, 'dist'));
    const orphans = onDisk.filter((f) => !expected.has(f));
    expect(orphans).toEqual([]);
  });
});
