/**
 * Erzeugt /fonts/display.css beim Build.
 * Liegt "Damaged Goods" unter public/fonts/ (damaged-goods.woff2/.woff/.ttf/.otf),
 * wird sie automatisch eingebunden. Bis dahin greift der Platzhalter Rubik Distressed.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';

const FORMATE: [string, string][] = [
  ['woff2', 'woff2'],
  ['woff', 'woff'],
  ['ttf', 'truetype'],
  ['otf', 'opentype'],
];

export function GET() {
  const ordner = path.resolve('public/fonts');
  const quellen = FORMATE.filter(([ext]) => existsSync(path.join(ordner, `damaged-goods.${ext}`))).map(
    ([ext, format]) => `url('/fonts/damaged-goods.${ext}') format('${format}')`,
  );
  const css = quellen.length
    ? `@font-face {\n  font-family: 'Damaged Goods';\n  src: ${quellen.join(',\n       ')};\n  font-display: swap;\n}\n`
    : `/* Damaged Goods noch nicht hinterlegt: Datei als public/fonts/damaged-goods.woff2 (oder .ttf/.otf) ablegen. */\n`;
  return new Response(css, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
}
