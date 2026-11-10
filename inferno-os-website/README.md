# INFERNO Osnabrück – neue Website

Neuaufbau von www.inferno-os.de. Die Texte der alten Seite sind wortgetreu übernommen, die Gestaltung ist neu:
Lila, Weiß, Schwarz, überall Kurvenbilder im Hintergrund, Trailer auf der Startseite.

| Datei | Inhalt |
|---|---|
| [docs/PFLEGE.md](docs/PFLEGE.md) | Anleitung für die Redaktion: Spieltagsbilder, Statements, Events |
| [docs/LIVEGANG.md](docs/LIVEGANG.md) | Vorschau mit Passwort für den Kunden, danach Umstellung der Domain |
| [docs/SICHERHEIT.md](docs/SICHERHEIT.md) | Sicherheitskonzept: statische Seite, Cloudflare-Firewall, Header, CMS-Zugang |
| [docs/UEBERNAHME.md](docs/UEBERNAHME.md) | Was von der alten Seite übernommen wurde und was noch fehlt |

## Technik

- **Astro** erzeugt eine rein statische Seite (kein Server, keine Datenbank).
- **Sveltia CMS** unter `/admin/` speichert Inhalte direkt im Git-Repository.
- **Cloudflare Pages** liefert aus; Cloudflare-Firewall, DDoS-Schutz und Access davor.
- Kontaktformular als kleine Cloudflare-Function (`functions/api/kontakt.js`).

## Lokal starten

Node.js 22 oder neuer.

```bash
npm install
npm run migrate   # einmalig: Spieltagsbilder der alten Seite holen (ca. 180 MB, ~10 Min.)
npm run dev       # http://localhost:4321
```

`npm run build` erzeugt die fertige Seite in `dist/` (inklusive Vorschaubilder). `npm run preview` zeigt sie an.
Das CMS lässt sich lokal ohne Login testen: http://localhost:4321/admin/ → „Work with Local Repository“
(Chrome oder Edge) → diesen Ordner auswählen.

## Aufbau

```
src/content/spieltage/   eine JSON-Datei pro Galerie (Titel, Saison, Datum, Bilder)
src/content/aktuelles/   Statements und Events (Markdown)
src/content/seiten/      feste Texte (Wer wir sind, Logos, 5/10/15/20 Jahre, Kontakt, Impressum, Datenschutz)
src/content/trailer/     Videos
src/data/                Einstellungen (Saisons, Hintergrund-Trailer) und Links
src/pages/               Seitenvorlagen
src/components/          Bausteine (Kopfzeile, Laufband, Lightbox, Video, …)
src/styles/global.css    Farben, Schriften, Kurvenflächen
public/images/kurve/     eingefärbte Kurvenbilder (erzeugt mit scripts/make-curves.mjs)
public/media/            Fotos (Archiv und Uploads aus dem CMS)
public/admin/            Redaktionssystem und seine Konfiguration (config.yml)
public/_headers          Sicherheits-Header und Content-Security-Policy
public/_redirects        Weiterleitungen der alten Adressen
functions/api/           Kontaktformular
scripts/                 Fotoimport, Vorschaubilder, Kurvenbilder
```

## Schrift

Überschriften und Menü sind für **Damaged Goods** vorbereitet. Fontmeme sperrt automatische Downloads,
deshalb steht bis zur Lieferung der Datei der freie Platzhalter **Rubik Distressed** (SIL Open Font License).
Datei als `public/fonts/damaged-goods.woff2` ablegen, der Rest passiert beim Build (Details in `docs/LIVEGANG.md`, Schritt 7).
Fließtext: Arial.
