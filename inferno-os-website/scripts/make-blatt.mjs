#!/usr/bin/env node
/**
 * Erzeugt das Kurvenbild für Lese-Blätter: vier weiß getönte Kurvenbilder untereinander,
 * mit weichen Übergängen; das Ende geht nahtlos in den Anfang über (repeat-y ohne Kante).
 *   node scripts/make-blatt.mjs
 */
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const MOTIVE = ['choreo', 'fahnen', 'osnabrueck', 'pyro'];
const B = 1200;
const H = 675;
const UEBERLAPP = 220;

const bilder = await Promise.all(
  MOTIVE.map((m) =>
    sharp(path.join(root, 'public/images/kurve', `${m}-weiss.webp`))
      .resize(B, H, { fit: 'cover' })
      .removeAlpha()
      .raw()
      .toBuffer(),
  ),
);

const schritt = H - UEBERLAPP;
const hoehe = schritt * MOTIVE.length;
const aus = Buffer.alloc(B * hoehe * 3, 255);
const zeile = B * 3;

// Abschnitt i zeigt die Zeilen UEBERLAPP..H von Bild i (die ersten Zeilen wurden schon im
// vorigen Übergang eingeblendet); die letzten UEBERLAPP Zeilen gehen weich in Bild i+1 über.
// Das letzte Bild blendet in das erste: der Streifen lässt sich ohne Kante wiederholen.
for (let y = 0; y < hoehe; y++) {
  const i = Math.floor(y / schritt);
  const l = y - i * schritt;
  const jetzt = bilder[i];
  const naechstes = bilder[(i + 1) % bilder.length];
  const start = schritt - UEBERLAPP;
  const t = l >= start ? (l - start) / UEBERLAPP : 0;
  const w = t * t * (3 - 2 * t);
  for (let x = 0; x < zeile; x++) {
    const a = jetzt[(UEBERLAPP + l) * zeile + x];
    const b = l >= start ? naechstes[(l - start) * zeile + x] : a;
    aus[y * zeile + x] = Math.round(a * (1 - w) + b * w);
  }
}
const gedreht = aus;

await sharp(gedreht, { raw: { width: B, height: hoehe, channels: 3 } })
  .webp({ quality: 55, effort: 6 })
  .toFile(path.join(root, 'public/images/kurve/blatt-weiss.webp'));
console.log(`✓ blatt-weiss.webp ${B}x${hoehe}`);
