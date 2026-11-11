---
name: INFERNO Osnabrück
description: Die Ostkurve bei Flutlicht unter lila Rauch, als Website.
colors:
  lila: "#5c1d68"
  lila-tief: "#2a0a35"
  lila-logo: "#883893"
  lila-licht: "#d7b4e3"
  nacht: "#0a080b"
  weiss: "#ffffff"
  nebel: "#f6f1f8"
  tinte: "#170d1a"
  tinte-2: "#4a3a50"
typography:
  display-hero:
    fontFamily: "'Damaged Goods', 'Rubik Distressed', 'Arial Black', sans-serif"
    fontSize: "clamp(4.4rem, 17.5vw, 15.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  display:
    fontFamily: "'Damaged Goods', 'Rubik Distressed', 'Arial Black', sans-serif"
    fontSize: "clamp(2.6rem, 1.4rem + 5vw, 5.75rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.01em"
  headline:
    fontFamily: "'Damaged Goods', 'Rubik Distressed', 'Arial Black', sans-serif"
    fontSize: "clamp(2.1rem, 1.3rem + 3.4vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.01em"
  title:
    fontFamily: "'Damaged Goods', 'Rubik Distressed', 'Arial Black', sans-serif"
    fontSize: "clamp(1.35rem, 1.1rem + 1vw, 1.9rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.01em"
  label:
    fontFamily: "'Damaged Goods', 'Rubik Distressed', 'Arial Black', sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.2vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.65
  body-lesetext:
    fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif"
    fontSize: "clamp(1.02rem, 0.98rem + 0.2vw, 1.12rem)"
    fontWeight: 400
    lineHeight: 1.75
rounded:
  none: "0"
  rund: "50%"
spacing:
  rand: "clamp(1rem, 4vw, 3.5rem)"
  flaeche: "clamp(4rem, 9vw, 8rem)"
  kopf: "clamp(2rem, 4vw, 3.5rem)"
  breite: "78rem"
  mass: "68ch"
  header-h: "4.25rem"
components:
  aktion:
    backgroundColor: "{colors.weiss}"
    textColor: "{colors.lila}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.25rem 0.6rem"
    height: "3rem"
  aktion-hover:
    backgroundColor: "transparent"
    textColor: "{colors.weiss}"
  aktion-hohl:
    backgroundColor: "transparent"
    textColor: "{colors.weiss}"
    rounded: "{rounded.none}"
  aktion-auf-weiss:
    backgroundColor: "{colors.lila}"
    textColor: "{colors.weiss}"
  spruchband:
    backgroundColor: "{colors.weiss}"
    textColor: "{colors.lila}"
    rounded: "{rounded.none}"
    padding: "0.18em 0.55em 0.12em"
  spruchband-lila:
    backgroundColor: "{colors.lila}"
    textColor: "{colors.weiss}"
  spruchband-nacht:
    backgroundColor: "{colors.nacht}"
    textColor: "{colors.weiss}"
  kopfleiste:
    backgroundColor: "rgb(10 8 11 / 0.82)"
    textColor: "{colors.weiss}"
    height: "{spacing.header-h}"
  feld:
    backgroundColor: "{colors.nebel}"
    textColor: "{colors.tinte}"
    rounded: "{rounded.none}"
    padding: "0.75rem 0.85rem"
---

# Design System: INFERNO Osnabrück

## Overview

**Creative North Star: "Die Ostkurve bei Flutlicht"**

Die Seite ist der Block unter lila Rauch. Jede Fläche ist ein Kurvenfoto, in die Farbe der Fläche getont (Duotone); darüber liegt feines Korn wie Flutlicht auf Rauch. Schrift ist gemalt wie auf Zaunfahne und Spruchband: eine zerkratzte Display-Schrift in Versalien, die laut und groß steht, und darunter ruhiges Arial für alles, was gelesen werden will.

Die Dichte ist die einer Kurve am Spieltag: große Bilder, große Wörter, wenig Kleinkram. Flächen wechseln in harten Bahnen zwischen Lila, Nacht und Weiß; zwischen ihnen laufen schräg gehängte Bänder durch. Nichts ist abgerundet, außer was wirklich rund ist (Logos, das Osnabrücker Rad, runde Bedienknöpfe). Verweigert wird das Vereinsseiten-Template: weiße Seite, Logo links, News-Kacheln im Raster.

Bewegung ist Einlauf, nicht Dekoration: der Titel tritt aus dem Rauch (Unschärfe zu scharf), das Spruchband schwingt ein, die Menüleiste fährt beim Verlassen des Trailers herein, das Laufband zieht langsam durch. Alle Bewegung verwendet eine einzige weiche Ausklang-Kurve und entfällt bei `prefers-reduced-motion`.

**Key Characteristics:**
- Drei Grundflächen (Lila, Nacht, Weiß), jede immer mit eigenem Duotone-Kurvenbild und Korn.
- Display-Schrift „Damaged Goods“ in Versalien für Überschriften, Menü, Aktionen; Arial für Fließtext.
- Schräg gehängte Spruchbänder und Laufbänder als Signatur.
- Das Osnabrücker Rad als Trenner und Marke.
- Eckig überall; rund nur, was rund ist.
- Weiche, tief fallende Schatten; keine harten Versatzschatten.

## Colors

Drei vom Auftraggeber festgelegte Farben, Lila, Weiß, Schwarz, jede als Fläche mit getöntem Kurvenbild; ein helleres Logolila als einziger Akzent.

### Primary
- **Kurvenlila** (lila): Grundfläche `kurve--lila`, Seitenköpfe, Spruchband-Schrift auf Weiß, Aktionen auf weißen Flächen, Zeitleistenlinie. Das Bild darauf ist dunkler: Duotone von #2a0a35 (Schatten) nach #5c1d68 (Lichter).
- **Rauchlila** (lila-tief): Schattenton der lila Kurvenbilder, Grund der Saisonkacheln und Verlaufsziel ihrer Tönung.

### Secondary
- **Logolila** (lila-logo): Akzent aus dem Gründungslogo. Fußleisten-Kante (6px), Textauswahl, Scrollbar, Hover-Rand der Formularfelder, Unterkante der Kopfleiste (55 % Deckkraft).
- **Flutlichtlila** (lila-licht): Akzent auf Nacht. Fokusring (3px), Hover und aktive Seite im Menü, Statement-Stempel, Bildzähler, Rad in der Fußzeile.

### Neutral
- **Nacht** (nacht): Grundfläche `kurve--nacht`, Seitenhintergrund, Laufband-Standard. Bild darauf: Duotone von #040305 nach #2a1630.
- **Tuchweiß** (weiss): Grundfläche `kurve--weiss`, Spruchband-Tuch, Standard-Aktion, Blatt für Lesetext. Bild darauf: Duotone von #e4d9ea nach #ffffff.
- **Nebel** (nebel): Grund der Formularfelder.
- **Tinte** (tinte): Text auf weißen Flächen.
- **Tinte leise** (tinte-2): Nebentext auf weißen Flächen.

Jede Fläche setzt vier lokale Rollen: `--flaeche` (Grund), `--vorder` (Text), `--leise` (Nebentext: #e9d6ef auf Lila, #cfc3d4 auf Nacht, tinte-2 auf Weiß) und `--akzent` (weiss auf Lila, lila-licht auf Nacht, lila auf Weiß). Komponenten lesen diese Rollen, nicht die Rohfarben.

### Named Rules
**The Kurvenbild Rule.** Keine Fläche ist schlicht. Jede `kurve`-Fläche trägt ein Kurvenfoto als Duotone, dessen Lichter die Flächenfarbe sind, und darüber Korn (`korn.png`, 180px, 16 % Deckkraft, overlay). Auch das Lese-Blatt ist ein weiß getöntes Kurvenbild (`blatt-weiss.webp`). Neue Motive entstehen nur über `scripts/make-curves.mjs`, nie als Farbfilter im CSS.

**The Drei-Farben Rule.** Lila, Weiß, Schwarz sind festgelegt. Alle anderen Töne sind Abstufungen von Lila; ein fremder Farbton erscheint nur als Fehlerzustand eines Formularfelds.

## Typography

**Display Font:** Damaged Goods (vom Auftraggeber festgelegt; bis die Datei vorliegt, greift Rubik Distressed, selbst gehostet unter OFL; Fallback Arial Black)
**Body Font:** Arial (festgelegt; mit Helvetica Neue, Helvetica)

**Character:** Gemalte, zerkratzte Versalien wie auf einer Zaunfahne gegen nüchternes Arial. Die Display-Schrift schreit, der Text spricht.

Die Display-Schrift wird über `/fonts/display.css` (erzeugt von `src/pages/fonts/display.css.ts`) eingebunden: liegt `public/fonts/damaged-goods.woff2` (oder .woff/.ttf/.otf) vor, greift sie automatisch; sonst bleibt der Stack bei Rubik Distressed.

### Hierarchy
- **Display Hero** (400, „INFERNO“ bis 15.5rem, „OSNABRÜCK“ clamp(3.1rem, 12.6vw, 11.2rem), 0.95): nur der Name im ersten Bildschirm.
- **Display** (400, h1, 0.95): Seitenköpfe (dort bis clamp(2.3rem, 0.6rem + 7vw, 6rem), max. 16ch).
- **Headline** (400, h2, 0.95): Abschnittstitel jeder Fläche.
- **Title** (400, h3, 1.05): Beitragstitel, Gruppenüberschriften, Stationen.
- **Label** (400, 1.1 bis 1.2rem, Versalien, Display): Aktionen, Menüpunkte, „mehr“-Links, Feldbeschriftungen.
- **Body** (400, 1.65): Fließtext und Abschnitts-Unterzeilen.
- **Body Lesetext** (400, 1.75, max. 68ch, Silbentrennung): Geschichte, Rechtliches, Beiträge.

### Named Rules
**The Versalien Rule.** Die Display-Schrift steht immer in Versalien und immer im Gewicht 400; Gewicht kommt aus der Größe, nicht aus Bold.

**The Arbeitsteilung Rule.** Display für alles, was gerufen wird (Titel, Menü, Aktionen, Bänder, Jahreszahlen); Arial für alles, was gelesen wird. Kein Absatz in Display, kein Titel in Arial.

## Layout

Inhalte stehen in einer zentrierten Spalte von `breite` (78rem) mit seitlichem `rand` (clamp(1rem, 4vw, 3.5rem)); die Kopfleiste nutzt 90rem. Flächen stapeln sich vollbreit mit vertikalem Polster `flaeche` (clamp(4rem, 9vw, 8rem)). Abschnittsköpfe (`kopf`) sind max. 52rem breit, Unterzeile in `--leise`, Abstand nach unten clamp(2rem, 4vw, 3.5rem). Lesetext ist auf 68ch begrenzt.

Die Startseite beginnt mit einem vollflächigen Trailer (100svh) unter Nacht-Verlauf, 30 % Lila-Tönung und Korn; Name links unten, über die halbe Breite. Danach wechseln Flächen in der Folge Lila, Nacht, Weiß. Laufbänder (`margin-block: -1.4rem`) überlappen die Kanten zweier Flächen.

Raster: Saisonwand als auto-fill mit min. 15rem (die zwei neuesten Saisons doppelt breit), auf Mobil fest zwei Spalten; Zeitleiste vier Spalten, darunter einspaltig. Umbrüche im Build: 1080px (Menü wird Vollbild-Dialog), 900px, 760px, 700px, 640px.

## Elevation & Depth

Tiefe entsteht aus Ebenen, nicht aus Karten: Kurvenbild, Korn, dann gehängte Elemente (Spruchband, Laufband, Blatt, Aufkleber), die mit weichen, tief versetzten Schatten über der Fläche schweben. Schatten sind immer weich und negativ gespreizt, nie hart versetzt.

### Shadow Vocabulary
- **Tuch** (`box-shadow: 0 0.6rem 1.4rem -0.4rem rgb(10 8 11 / 0.55)`): Spruchband.
- **Band** (`box-shadow: 0 0.8rem 2rem -0.8rem rgb(0 0 0 / 0.6)`): Laufband.
- **Blatt** (`box-shadow: 0 2rem 4rem -2rem rgb(10 8 11 / 0.55)`): Lese-Blatt, Kontaktformular.
- **Medium** (`box-shadow: 0 1.5rem 3rem -1.2rem rgb(0 0 0 / 0.75)`): Videos, Untermenü, Aufkleber, Lightbox-Bild.

### Named Rules
**The Gehängt Rule.** Was einen Schatten trägt, hängt vor der Kurve (Tuch, Band, Blatt, Aufkleber). Bedienelemente heben sich durch Farbwechsel und 2px Versatz, nicht durch Schatten.

## Shapes

Eckig ist der Standard: Aktionen, Felder, Bänder, Kacheln und Blätter haben keine Rundung. Rund (50 %) ist nur, was rund ist: Logos, das Osnabrücker Rad, der Video-Startknopf, die runden Lightbox-Knöpfe. Gehängte Elemente sind leicht schräg: Spruchband -2.2deg, Laufband -1.6deg (Gegenrichtung 1.4deg), Datumskarte -3deg, Statement-Stempel -6deg, Aufkleber -5 / 4 / -2deg, Kontakt-Blatt -0.6deg. Flächenkanten können mit `kurve--schraeg` schräg geschnitten werden (2.5vw), wie ein Banner.

## Components

### Aktion (Buttons)
Laut und eckig wie ein Transparent.
- **Shape:** eckig (0), 2px Rand in Grundfarbe, min. 3rem hoch.
- **Primary:** weiß mit lila Display-Versalien (1.15rem), optional Icon 1.15em rechts.
- **Hover / Focus:** wird hohl (transparent, Schrift in Grundfarbe) und hebt sich 2px; 0.25s, `ease-out`. Fokus: 3px Ring in Flutlichtlila, 3px Abstand.
- **Hohl:** transparent mit Rand; im Hover gefüllt.
- **Auf Weiß:** Grundfarbe wird Lila, Schrift Weiß.
- **Mehr-Link:** Display-Versalien in `--akzent` mit Pfeil, der im Hover 4px nach rechts rückt.

### Spruchband (Signatur)
Weißes Tuch, lila gemalte Schrift, schräg gehängt (-2.2deg), Tuch-Schatten. Varianten Lila und Nacht. Trägt Motto, Untertitel, Galerietitel; im Lesetext werden allein stehende fette Abschlusszeilen automatisch zum lila Band (-1.5deg, die letzte -2.5deg und 1.35em).

### Laufband (Signatur)
Schräges Band über der Kante zweier Flächen, Text und Rad im Wechsel, 48s linear, Richtung umkehrbar; steht bei reduzierter Bewegung still. Varianten Nacht, Weiß, Lila.

### Osnabrücker Rad
Sechs Speichen, Nabe, Felge als SVG in `currentColor`; Nabenloch in Flächenfarbe (`--rad-loch`). Trenner im Laufband, Marke in der Fußzeile, Station der Zeitleiste (dreht sich im Hover um 120deg).

### Navigation
Feste Kopfleiste (4.25rem) in Nacht mit 82 % Deckkraft, Blur 14px, Logolila-Unterkante. Auf der Startseite ist sie verborgen, bis der Trailer verlassen wird. Menüpunkte in Display 1.2rem; Hover und aktive Seite in Flutlichtlila, aktiv zusätzlich 3px unterstrichen. Untermenü ist eine lila Kurvenfläche mit weißer 4px Oberkante. Unter 1080px öffnet „Menü“ einen Vollbild-Dialog, der von oben aufgezogen wird.

### Saisonkachel
Spieltagsfoto in Graustufen unter Rauchlila-Verlauf (multiply); im Hover kommt die Farbe zurück und das Bild zoomt 5 %. Saisonname in Display bis 4.6rem (Containergröße). Leere Saison zeigt ein lila Kurvenbild und ein schräges weißes Band „Bilder folgen“.

### Blatt (Lesetext)
Weißes, kurvenbedrucktes Blatt (max. 52rem, Blatt-Schatten) vor einer Kurvenfläche; Lesetext darauf in Tinte, Links in Lila.

### Inputs / Fields
- **Style:** eckig, 2px Rand #cbb8d3, Grund Nebel, Text Tinte, Label in Display-Versalien Lila.
- **Focus:** Rand Lila, Grund Weiß, 3px Logolila-Schein (25 %).
- **Error:** Rand #b3261e.

### Video und Lightbox
Videos starten erst auf Klick (Vorschaubild unter Rauchlila-Verlauf, runder weißer Startknopf mit Puls). Die Lightbox ist eine Nacht-Kurvenfläche mit Rauchbild, runden umrandeten Knöpfen und Bildzähler in Flutlichtlila; Tastatur und Wischen.

## Do's and Don'ts

### Do:
- **Do** jede neue Fläche als `kurve kurve--{lila|nacht|weiss} bild-{motiv}` bauen, damit Kurvenbild, Korn und Farbrollen mitkommen.
- **Do** Farben über die Flächenrollen `--vorder`, `--leise`, `--akzent` setzen, damit eine Komponente auf allen drei Flächen stimmt.
- **Do** neue Hintergrundmotive mit `scripts/make-curves.mjs` tönen (Lila #2a0a35 nach #5c1d68, Nacht #040305 nach #2a1630, Weiß #e4d9ea nach #ffffff).
- **Do** Motto und Untertitel als schräg gehängtes Spruchband setzen.
- **Do** alle Übergänge mit `--ease-out` (cubic-bezier(0.16, 1, 0.3, 1)) führen und bei reduzierter Bewegung abschalten.

### Don't:
- **Don't** schlichte Hintergründe verwenden: keine Fläche und kein Textblock ohne Kurvenbild.
- **Don't** das Vereinsseiten-Template bauen: weiße Seite, Logo links, News-Kacheln im Raster.
- **Don't** Farben außerhalb von Lila, Weiß, Schwarz und ihren Lila-Abstufungen einführen.
- **Don't** Rechtecke abrunden; rund ist nur, was rund ist (Logo, Rad, Startknopf, Lightbox-Knöpfe).
- **Don't** die Display-Schrift fett, kursiv oder in Kleinbuchstaben setzen, und keinen Fließtext in ihr.
- **Don't** harte Versatzschatten verwenden; Schatten sind weich und nur an gehängten Elementen.
