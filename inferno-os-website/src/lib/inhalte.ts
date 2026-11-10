import { getCollection, type CollectionEntry } from 'astro:content';
import einstellungen from '../data/einstellungen.json';

export type Spieltag = CollectionEntry<'spieltage'>;

/** "2025/26" -> "2025-26" (URL) */
export const saisonSlug = (saison: string) => saison.replace('/', '-');

/** "2025/26" -> "2025/2026" */
export const saisonLang = (saison: string) => {
  const [a, b] = saison.split('/');
  return `${a}/${a.slice(0, 2)}${b}`;
};

/** Vorschaubild-Pfad (erzeugt von scripts/thumbs.mjs) */
export const thumb = (src: string) =>
  src.startsWith('/media/') ? `/_thumbs${src.replace(/\.(jpe?g|png|webp|avif|gif|tiff?)$/i, '.webp')}` : src;

/** Kurzname einer Galerie für URLs, z. B. "2526-vfbh" -> "vfbh" */
export const galerieSlug = (entry: Spieltag) => entry.id.replace(/^\d{4}-/, '');

export const galerieUrl = (entry: Spieltag) =>
  `/spieltagsbilder/${saisonSlug(entry.data.saison)}/${galerieSlug(entry)}/`;

/** Neueste zuerst: mit Datum nach Datum, übernommene Galerien in Reihenfolge der alten Seite. */
function sortiere(a: Spieltag, b: Spieltag) {
  if (a.data.saison !== b.data.saison) return b.data.saison.localeCompare(a.data.saison);
  const da = a.data.datum?.getTime();
  const db = b.data.datum?.getTime();
  if (da !== undefined && db !== undefined) return db - da;
  if (da !== undefined) return -1;
  if (db !== undefined) return 1;
  return (a.data.position ?? 0) - (b.data.position ?? 0);
}

export async function alleSpieltage() {
  const alle = await getCollection('spieltage', (e) => e.data.bilder.length > 0);
  return alle.sort(sortiere);
}

export async function saisons() {
  const spieltage = await alleSpieltage();
  return einstellungen.saisons.map((s) => {
    const galerien = spieltage.filter((g) => g.data.saison === s.saison);
    const bilder = galerien.reduce((n, g) => n + g.data.bilder.length, 0);
    return {
      saison: s.saison,
      slug: saisonSlug(s.saison),
      lang: saisonLang(s.saison),
      hinweis: 'hinweis' in s ? (s.hinweis as string) : undefined,
      galerien,
      bilder,
      titelbild: galerien[0]?.data.bilder[0],
    };
  });
}

/** Saisonwechsel nach Kalender: ab Juli zählt die neue Saison. */
export const laufendeSaison = (heute = new Date()) => {
  const j = heute.getMonth() >= 6 ? heute.getFullYear() : heute.getFullYear() - 1;
  return `${j}/${String(j + 1).slice(2)}`;
};

export async function letzterSpieltag() {
  return (await alleSpieltage())[0];
}

export async function seiten(bereich?: string) {
  const alle = await getCollection('seiten');
  return alle
    .filter((s) => !bereich || s.data.bereich === bereich)
    .sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
}

export async function aktuelles() {
  const alle = await getCollection('aktuelles');
  return alle.sort((a, b) => b.data.datum.getTime() - a.data.datum.getTime());
}

export async function trailer() {
  const alle = await getCollection('trailer');
  return alle.sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
}

const datumFormat = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Berlin' });
const terminTag = new Intl.DateTimeFormat('de-DE', { day: '2-digit', timeZone: 'Europe/Berlin' });
const terminMonat = new Intl.DateTimeFormat('de-DE', { month: 'short', timeZone: 'Europe/Berlin' });
const terminZeit = new Intl.DateTimeFormat('de-DE', { weekday: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });

export const datum = (d: Date) => datumFormat.format(d);
export const termin = (d: Date) => ({
  tag: terminTag.format(d),
  monat: terminMonat.format(d).replace('.', ''),
  zeit: `${terminZeit.format(d)} Uhr`,
});

export { einstellungen };
