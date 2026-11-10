# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (statische Seite, kein Server, keine Datenbank) + Sveltia CMS (Git-basiertes Redaktionssystem unter /admin) + Cloudflare Pages mit Cloudflare-Firewall (WAF, DDoS-Schutz, Access-Passwortschutz für die Vorschau). Vom Auftraggeber so gewählt, weil die Seite wöchentlich gepflegt wird und maximale Sicherheit verlangt ist.

## Users

- **Die Fanszene und das Umfeld der Gruppe**: Mitglieder, Ex-Mitglieder, Freunde, junge VfL-Fans, die sich für Ultrà in Osnabrück interessieren. Sie schauen nach dem Spieltag die Bilder an, lesen Statements und Events, und informieren sich über Geschichte und Haltung der Gruppe. Viele kommen über das Handy.
- **Redaktion der Gruppe**: einige Mitglieder ohne Programmierkenntnisse, die jede Woche die Spieltagsbilder hochladen und regelmäßig Statements oder Events veröffentlichen.
- **Auftraggeber (Eigentümer der Seite)**: muss den Entwurf vor dem Livegang abnehmen.

## Product Purpose

Die Online-Präsenz des INFERNO Osnabrück (Ultràjugend, gegründet im Dezember 2005, Ostkurve VfL Osnabrück). Sie zeigt Spieltagsbilder jeder Saison, erzählt die Geschichte der Gruppe, erklärt Haltung und Gruppenlogos, zeigt die Trailer und verlinkt befreundete Initiativen. Erfolg heißt: die Seite fühlt sich nach Kurve an, und die Redaktion kann sie ohne Hilfe aktuell halten.

## Positioning

Die Seite einer Gruppe, die seit 2005 Jugendliche an Ultrà heranführt, eigenständig neben der Violet Crew. Motto: „Verschwende deine Jugend!“. Kein Verein, kein Shop, keine Werbung.

## Operating Context

- Wöchentlicher Rhythmus: nach jedem Spieltag eine neue Galerie (Titelformat wie bisher, z. B. „19. Spieltag VfL Osnabrück vs. VfB Stuttgart II 1:2“).
- Unregelmäßige Statements und Events.
- Kontakt läuft bewusst nicht als Debatte übers Internet: „Jeder, der mit uns das Gespräch sucht, weiß, wo er uns findet: In der Kurve!“
- Neue Seite wird erst dem Auftraggeber als Vorschau gezeigt und danach unter www.inferno-os.de live geschaltet.

## Capabilities and Constraints

- Alte Texte werden **Wort für Wort** übernommen (Quelle: www.inferno-os.de, Stand November 2026). Nur technische Zeichensatzfehler der alten Seite werden korrigiert.
- Saisons mit Bildern: 2016/17, 2017/18, 2018/19, 2019/20, 2021/22, 2022/23, 2023/24, 2024/25, 2025/26. 2026/27 ist angelegt, Bilder folgen.
- Geschichte: 5 Jahre, 10 Jahre, 15 Jahre vorhanden; **20 Jahre: Text liegt noch nicht vor** und darf nicht erfunden werden.
- Startseite: Trailer „INFERNO OSNABRÜCK - Verschwende deine Jugend!“ (Vimeo 277888338) läuft im Hintergrund; darüber „Inferno Osnabrück“ und darunter „Verschwende deine Jugend!“.
- Weitere Videos: „Verschwende deine Jugend! - Saison 2018 / 2019 - INFERNO Osnabrück“ (Vimeo 360315097), „INFERNO OSNABRÜCK - 15 Jahre“ (Vimeo 535228000).
- Sicherheit hat hohe Priorität: keine Angriffsfläche auf dem Server, Firewall davor, Admin-Zugang mit 2FA.
- Gesichter auf Gruppenfotos sind auf der alten Seite teils verpixelt; das bleibt so.

## Brand Commitments

- Name: INFERNO Osnabrück / INFERNO Ultràjugend Osnabrück. Schreibweise „INFERNO“ in Versalien im Fließtext.
- Motto: „Verschwende deine Jugend!“ (VdJ).
- Gruppenlogos: Gründungslogo (Osnabrücker Rad im lila Ring, „INFERNO OSNABRÜCK · ULTRA' JUGEND“), Fünf-Jahres-Emblem (Rampendahl-Biertrinker), Arminius-Logo. Violet-Crew-Wappen nur im Logos-Text.
- Farben vom Auftraggeber festgelegt: Lila, Weiß, Schwarz.
- Schriften vom Auftraggeber festgelegt: „Damaged Goods“ für Überschriften und Menü, Arial für Fließtext.
- Hintergründe nie schlicht: immer Kurvenbilder, auf Lila in einem etwas dunkleren Lila.

## Evidence on Hand

- Texte: Wer wir sind, Gruppenlogos, 5 Jahre, 10 Jahre, 15 Jahre, Verschwende deine Jugend!, Kontakt, Impressum, Links (`src/content/`).
- 293 Galerien mit rund 1.860 Spieltagsbildern 2016–2026 (`public/media/spieltage/`).
- Logos und Geschichtsbilder der alten Seite (`public/images/`).
- Keine Mitgliederzahlen, Zitate Dritter oder Presse vorhanden; nichts davon erfinden.

## Product Principles

1. Die Kurve ist der Inhalt: Bilder und Worte der Gruppe stehen vorn, die Oberfläche tritt zurück.
2. Wortgetreu: die Texte der Gruppe werden nicht umgeschrieben, gekürzt oder ergänzt.
3. Pflegbar ohne Technikwissen: eine Galerie pro Spieltag in wenigen Minuten.
4. Sicher by default: nichts, was gehackt werden kann, läuft auf einem Server.
