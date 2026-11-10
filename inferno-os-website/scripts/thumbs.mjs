#!/usr/bin/env node
/**
 * Erzeugt Vorschaubilder (max. 720 px) für alle Bilder unter public/media/.
 * Ergebnis: public/_thumbs/<gleicher Pfad>.webp – wird nicht eingecheckt,
 * sondern bei jedem Build neu erzeugt (bereits vorhandene werden übersprungen).
 */
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const quelle = path.join(root, 'public/media');
const ziel = path.join(root, 'public/_thumbs/media');
const RASTER = /\.(jpe?g|png|webp|avif|gif|tiff?)$/i;

async function* dateien(dir) {
  for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* dateien(p);
    else if (RASTER.test(e.name)) yield p;
  }
}

const auftraege = [];
for await (const datei of dateien(quelle)) {
  const rel = path.relative(quelle, datei).replace(RASTER, '.webp');
  const aus = path.join(ziel, rel);
  const [a, b] = await Promise.all([stat(datei), stat(aus).catch(() => null)]);
  if (b && b.mtimeMs >= a.mtimeMs) continue;
  auftraege.push([datei, aus]);
}

let fertig = 0;
const parallel = Math.max(2, os.availableParallelism?.() ?? 4);
sharp.concurrency(1);
async function arbeiter() {
  while (auftraege.length) {
    const [ein, aus] = auftraege.shift();
    await mkdir(path.dirname(aus), { recursive: true });
    await sharp(ein, { failOn: 'none' })
      .rotate()
      .resize({ width: 720, height: 720, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 62, effort: 4 })
      .toFile(aus)
      .catch((err) => console.warn(`Vorschaubild fehlgeschlagen: ${ein} (${err.message})`));
    fertig++;
  }
}
const start = Date.now();
await Promise.all(Array.from({ length: parallel }, arbeiter));
if (fertig) console.log(`Vorschaubilder: ${fertig} erzeugt in ${((Date.now() - start) / 1000).toFixed(1)} s`);
