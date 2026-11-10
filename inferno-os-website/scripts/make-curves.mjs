#!/usr/bin/env node
/**
 * Erzeugt die eingefärbten Kurvenbilder für die Hintergründe.
 *
 * Jedes Motiv wird in Graustufen umgerechnet und auf zwei Farben abgebildet
 * (Duotone): Schatten = dunklere Farbe, Lichter = Hintergrundfarbe der Fläche.
 * So liegt auf Lila immer ein Kurvenbild in etwas dunklerem Lila.
 *
 *   node scripts/make-curves.mjs
 *
 * Neue Motive: unten in MOTIVE eintragen (Pfad relativ zu public/).
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'public/images/kurve');

// Ausschnitt ohne das Wasserzeichen oben rechts (Anteile der Bildfläche)
const CROP = { left: 0, top: 0.12, width: 0.9, height: 0.88 };

const MOTIVE = {
  pyro: 'media/spieltage/2324/hsva/04.webp',
  glut: 'media/spieltage/2223/rwea/03.webp',
  block: 'media/spieltage/2324/svea/04.webp',
  choreo: 'media/spieltage/2324/hsva/02.webp',
  fahnen: 'media/spieltage/2223/auea/01.webp',
  rauch: 'media/spieltage/2425/fceh/04.webp',
  osnabrueck: 'media/spieltage/2223/rwea/07.webp',
  zaun: 'media/spieltage/2223/sgdh/02.webp',
};

// [Schatten, Lichter] – Lichter = Farbe der Fläche, auf der das Bild liegt
const TOENE = {
  lila: ['#2a0a35', '#5c1d68'],
  schwarz: ['#040305', '#2a1630'],
  weiss: ['#e4d9ea', '#ffffff'],
  hero: ['#14051c', '#c99bdb'],
};

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

await mkdir(out, { recursive: true });

for (const [name, src] of Object.entries(MOTIVE)) {
  const input = path.join(root, 'public', src);
  const meta = await sharp(input).metadata();
  const crop = {
    left: Math.round(meta.width * CROP.left),
    top: Math.round(meta.height * CROP.top),
    width: Math.round(meta.width * CROP.width),
    height: Math.round(meta.height * CROP.height),
  };
  for (const [ton, [lo, hi]] of Object.entries(TOENE)) {
    const a = hex(lo);
    const b = hex(hi);
    const { data, info } = await sharp(input)
      .extract(crop)
      .resize({ width: 1920, height: 1080, fit: 'cover', position: 'attention' })
      .greyscale()
      .normalise({ lower: 2, upper: 98 })
      .blur(ton === 'hero' ? 0.3 : 0.8)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const rgb = Buffer.alloc(info.width * info.height * 3);
    for (let i = 0; i < data.length; i += info.channels) {
      const g = data[i] / 255;
      const o = (i / info.channels) * 3;
      rgb[o] = a[0] + (b[0] - a[0]) * g;
      rgb[o + 1] = a[1] + (b[1] - a[1]) * g;
      rgb[o + 2] = a[2] + (b[2] - a[2]) * g;
    }
    await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } })
      .webp({ quality: ton === 'hero' ? 70 : 58, effort: 6 })
      .toFile(path.join(out, `${name}-${ton}.webp`));
  }
  console.log(`✓ ${name}`);
}
