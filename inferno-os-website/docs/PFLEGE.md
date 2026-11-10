# Pflege der Website (für die Redaktion)

Alles läuft im Browser unter **www.inferno-os.de/admin/**. Programmieren muss niemand.
Nach jedem Speichern baut sich die Seite automatisch neu und ist nach etwa 1 bis 2 Minuten online.

## Anmelden

1. www.inferno-os.de/admin/ öffnen.
2. Cloudflare fragt zuerst nach deiner E-Mail-Adresse und schickt dir einen Code (das ist die erste Sperre).
3. Danach **Sign In with GitHub** wählen und mit deinem GitHub-Konto anmelden (zweite Sperre, mit 2-Faktor-Code).

Wer neu in die Redaktion kommt, braucht ein GitHub-Konto mit aktivierter Zwei-Faktor-Anmeldung und wird vom Admin
im Repository als Mitarbeiter eingetragen und in Cloudflare Access freigeschaltet (siehe `LIVEGANG.md`).

## Jede Woche: Spieltagsbilder hochladen

1. Links **Spieltagsbilder** → oben **Neu**.
2. **Titel** wie bisher: `20. Spieltag VfL Osnabrück vs. FC Beispielstadt 2:1`
   (Pokal: `NFV Pokal …`, `DFB-Pokal …`, Aktionen einfach mit ihrem Namen).
3. **Saison** auswählen (aktuell `2026/27`).
4. **Spieltag am**: Datum des Spiels. Danach richtet sich die Reihenfolge, der neueste Spieltag steht oben und
   erscheint automatisch auf der Startseite unter „Letzter Spieltag“.
5. **Bilder**: alle Fotos auf einmal in das Feld ziehen. Das CMS verkleinert jedes Foto automatisch
   (max. 1600 Pixel, WebP). Ein 5-MB-Kamerafoto wird dabei zu etwa 150 KB. Reihenfolge per Ziehen ändern;
   das erste Bild ist das Titelbild.
6. **Speichern**. Fertig.

Tipp: Gesichter, die nicht erkennbar sein sollen, **vor** dem Hochladen verpixeln. Das CMS ändert nichts an den Motiven.

## Statements und Events

1. **Aktuelles** → **Neu**.
2. **Art**: `Statement` oder `Event`.
3. Bei Events zusätzlich **Termin** (Datum und Uhrzeit) und **Ort** ausfüllen. Der Termin erscheint groß auf der Startseite.
4. Text schreiben. Fett, Kursiv, Listen und Links gehen über die Symbolleiste.
5. **Speichern**.

Die drei neuesten Beiträge stehen auf der Startseite. **Vor dem Livegang die beiden Beispiel-Beiträge löschen.**

## Neue Saison anlegen (einmal im Sommer)

1. **Einstellungen** → **Saisons** → oben einen Eintrag hinzufügen, z. B. `2027/28`, Hinweis „Die Bilder der laufenden Saison folgen.“
2. Speichern. Die Saison erscheint sofort im Menü und auf der Startseite.

## Texte ändern

Unter **Seiten & Texte** liegen alle festen Texte (Wer wir sind, Gruppenlogos, 5/10/15/20 Jahre, Kontakt, Impressum, Datenschutz).
Sie wurden wortgetreu von der alten Seite übernommen.

**20 Jahre:** Sobald der Text fertig ist, unter Seiten & Texte → „20 Jahre“ einfügen und den Schalter **Text folgt noch** ausschalten.

## Trailer

**Trailer** → **Neu**: Plattform (Vimeo oder YouTube), Video-ID und ein Vorschaubild. Das Video wird erst geladen,
wenn jemand auf „Abspielen“ klickt (Datenschutz).

Den Trailer im **Hintergrund der Startseite** stellt ihr unter **Einstellungen → Trailer im Hintergrund** ein.
Für YouTube einfach Plattform `youtube` wählen und die ID aus dem Link (`youtube.com/watch?v=XXXX`) eintragen.

## Links

**Links** → Gruppen „Osnabrück“ und „Sonstige“, jeweils mit Name, Adresse und Logo.

## Wenn etwas schiefgeht

- Jede Änderung wird als eigene Version gespeichert (GitHub). Der Admin kann jede frühere Version wiederherstellen.
- Wenn die Seite nach dem Speichern nicht aktualisiert wird, liegt meist ein Fehler im Eintrag vor (z. B. Saison im falschen Format).
  Der Admin sieht die Meldung im Cloudflare-Dashboard unter **Workers & Pages → inferno-os → Deployments**.
  Die alte Version bleibt in dieser Zeit online.
