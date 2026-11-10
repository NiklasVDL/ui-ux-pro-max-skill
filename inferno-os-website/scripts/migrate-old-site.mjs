#!/usr/bin/env node
/**
 * Übernimmt die Spieltagsbilder der alten Website www.inferno-os.de.
 *
 * - liest die Saisonseiten (Fotos/<saison>.html) der alten Seite
 * - legt pro Spieltag eine JSON-Datei in src/content/spieltage/ an
 *   (Titel wortgetreu, Bildliste, Reihenfolge wie auf der alten Seite)
 * - lädt jedes Originalbild, verkleinert es auf max. 1600 px und speichert es
 *   als WebP unter public/media/spieltage/<saison>/<galerie>/
 *
 * Das Skript ist wiederholbar: bereits vorhandene Bilder werden übersprungen.
 *
 *   node scripts/migrate-old-site.mjs                 # alle Saisons
 *   node scripts/migrate-old-site.mjs --seasons=2526  # nur 2025/26
 *   node scripts/migrate-old-site.mjs --no-images     # nur Texte/JSON
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BASE = 'https://www.inferno-os.de/Fotos/';
const ALL_SEASONS = ['1617', '1718', '1819', '1920', '2122', '2223', '2324', '2425', '2526'];
const MAX_EDGE = 1600;
const QUALITY = 72;

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);
const seasons = args.seasons ? String(args.seasons).split(',') : ALL_SEASONS;
const concurrency = Number(args.concurrency ?? 6);
const withImages = !args['no-images'];

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const contentDir = path.join(root, 'src/content/spieltage');
const mediaDir = path.join(root, 'public/media/spieltage');

const seasonLabel = (code) => `20${code.slice(0, 2)}/${code.slice(2)}`;

const decodeEntities = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&uuml;/g, 'ü').replace(/&Uuml;/g, 'Ü')
    .replace(/&ouml;/g, 'ö').replace(/&Ouml;/g, 'Ö')
    .replace(/&auml;/g, 'ä').replace(/&Auml;/g, 'Ä')
    .replace(/&szlig;/g, 'ß')
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));

const clean = (s) => decodeEntities(s.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'inferno-os-migration/1.0' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const utf8 = buf.toString('utf8');
  return utf8.includes('�') ? buf.toString('latin1') : utf8;
}

function parseSeason(html) {
  const re =
    /<td[^>]*rgb\(96,\s*38,\s*89\)[^>]*>([\s\S]*?)<\/td>|<a[^>]*class="example-image-link"[^>]*href="([^"]+)"[^>]*data-lightbox="([^"]*)"/g;
  const galleries = [];
  let current = null;
  for (const m of html.matchAll(re)) {
    if (m[1] !== undefined) {
      const title = clean(m[1]);
      if (!title || title === 'Fotos') continue;
      current = { title, key: null, images: [] };
      galleries.push(current);
    } else if (current) {
      current.images.push(m[2]);
      current.key ??= m[3];
    }
  }
  return galleries.filter((g) => g.images.length > 0);
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const exists = (p) => access(p).then(() => true, () => false);

// Die alte Seite verlinkt einige Dateien mit falscher Groß-/Kleinschreibung der Endung.
const urlVariants = (url) => {
  const m = url.match(/^(.*)\.(jpe?g|png)$/i);
  if (!m) return [url];
  return [...new Set([url, `${m[1]}.${m[2].toLowerCase()}`, `${m[1]}.${m[2].toUpperCase()}`, `${m[1]}.jpeg`])];
};

async function fetchFirst(urls) {
  let last;
  for (const u of urls) {
    const res = await fetch(u, { headers: { 'User-Agent': 'inferno-os-migration/1.0' } });
    if (res.ok) return res;
    last = res;
    if (res.status !== 404) break;
  }
  throw new Error(`${last.status}`);
}

async function convertImage(srcUrl, dest) {
  if (await exists(dest)) return 'skip';
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetchFirst(urlVariants(srcUrl));
      const input = Buffer.from(await res.arrayBuffer());
      await mkdir(path.dirname(dest), { recursive: true });
      await sharp(input, { failOn: 'none' })
        .rotate()
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(dest);
      return 'ok';
    } catch (err) {
      if (attempt === 3) return `fail ${err.message}`;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

async function pool(items, n, fn) {
  let i = 0;
  const workers = Array.from({ length: n }, async () => {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx], idx);
    }
  });
  await Promise.all(workers);
}

const jobs = [];
const written = [];
let entries = 0;
await mkdir(contentDir, { recursive: true });

for (const code of seasons) {
  const html = await fetchText(`${BASE}${code}.html`);
  const galleries = parseSeason(html);
  const usedSlugs = new Set();
  for (const [position, g] of galleries.entries()) {
    let slug = slugify(g.key || g.title) || `galerie-${position}`;
    while (usedSlugs.has(slug)) slug += '-2';
    usedSlugs.add(slug);
    const bilder = g.images.map((href) => {
      const file = path.basename(href).replace(/\.(jpe?g|png)$/i, '').toLowerCase() + '.webp';
      const rel = `/media/spieltage/${code}/${slug}/${file}`;
      jobs.push({ src: new URL(encodeURI(href), BASE).href, dest: path.join(root, 'public', rel), rel });
      return rel;
    });
    const entry = {
      titel: g.title,
      saison: seasonLabel(code),
      position,
      bilder,
      quelle: `https://www.inferno-os.de/Fotos/${code}.html`,
    };
    entries++;
    const file = path.join(contentDir, `${code}-${slug}.json`);
    written.push({ file, entry });
    await writeFile(file, JSON.stringify(entry, null, 2) + '\n');
  }
  console.log(`Saison ${seasonLabel(code)}: ${galleries.length} Galerien`);
}
console.log(`${entries} Einträge geschrieben, ${jobs.length} Bilder in der Liste.`);

if (withImages) {
  let done = 0;
  const failures = [];
  await pool(jobs, concurrency, async (job) => {
    const r = await convertImage(job.src, job.dest);
    if (r.startsWith('fail')) failures.push({ job, msg: `${job.src} -> ${r}` });
    if (++done % 50 === 0 || done === jobs.length) console.log(`Bilder: ${done}/${jobs.length}`);
  });
  if (failures.length) {
    // Bilder, die auch auf der alten Seite fehlen, fliegen aus der Galerie,
    // damit keine kaputten Kacheln entstehen.
    const missing = new Set(failures.map((f) => f.job.rel));
    for (const { file, entry } of written) {
      const before = entry.bilder.length;
      entry.bilder = entry.bilder.filter((b) => !missing.has(b));
      if (entry.bilder.length !== before) await writeFile(file, JSON.stringify(entry, null, 2) + '\n');
    }
    console.log(`\n${failures.length} Bilder sind auf der alten Seite nicht abrufbar und wurden aus den Galerien entfernt:`);
    for (const f of failures) console.log('  ' + f.msg);
  }
}
