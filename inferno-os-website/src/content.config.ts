import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Leere Felder aus dem CMS ("" oder null) als „nicht gesetzt“ behandeln. */
const leer = (v: unknown) => (v === '' || v === null ? undefined : v);

/**
 * Zeitangaben ohne Zeitzone (so speichert das CMS „19:00“) gelten als Osnabrücker Zeit,
 * nicht als Zeit des Build-Servers.
 */
const berlin = (v: unknown) => {
  v = leer(v);
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(v)) return v;
  const alsUtc = new Date(`${v}Z`);
  const teile = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', timeZoneName: 'longOffset' })
    .formatToParts(alsUtc)
    .find((t) => t.type === 'timeZoneName')?.value;
  const versatz = teile?.replace('GMT', '') || '+01:00';
  return `${v}${versatz === '' ? '+00:00' : versatz}`;
};

const optDatum = z.preprocess(leer, z.coerce.date().optional());
const optZahl = z.preprocess(leer, z.coerce.number().optional());
const optText = z.preprocess(leer, z.string().optional());

/** Eine Galerie pro Spieltag (oder Aktion). Gepflegt im CMS unter „Spieltagsbilder“. */
const spieltage = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/spieltage' }),
  schema: z.object({
    titel: z.string(),
    saison: z.string().regex(/^\d{4}\/\d{2}$/, 'Format: 2026/27'),
    datum: optDatum,
    position: optZahl,
    bilder: z.array(z.string()).default([]),
    quelle: optText,
  }),
});

/** Feste Seiten und Texte (Wer wir sind, Geschichte, Kontakt, Impressum …). */
const seiten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/seiten' }),
  schema: z.object({
    titel: z.string(),
    untertitel: optText,
    reihenfolge: z.number().default(99),
    bereich: z.enum(['inferno', 'geschichte', 'trailer', 'kontakt', 'rechtliches']),
    jahr: optZahl,
    bild: optText,
    bildAlt: optText,
    video: optText,
    teaser: z.string().default(''),
    entwurf: z.boolean().default(false),
  }),
});

/** Statements und Events. */
const aktuelles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/aktuelles' }),
  schema: z.object({
    titel: z.string(),
    typ: z.enum(['Statement', 'Event']),
    datum: z.coerce.date(),
    termin: z.preprocess(berlin, z.coerce.date().optional()),
    ort: optText,
    bild: optText,
    bildAlt: optText,
    beispiel: z.boolean().default(false),
  }),
});

/** Trailer und Videorückblicke. */
const trailer = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/trailer' }),
  schema: z.object({
    titel: z.string(),
    anbieter: z.enum(['vimeo', 'youtube']),
    videoId: z.string(),
    poster: z.string(),
    dauer: optText,
    beschreibung: optText,
    reihenfolge: z.number().default(99),
  }),
});

export const collections = { spieltage, seiten, aktuelles, trailer };
