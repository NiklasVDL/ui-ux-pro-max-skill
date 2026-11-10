# Sicherheitskonzept

Ziel: Auf dem Server gibt es nichts, was man hacken kann, und vor allem anderen steht eine Firewall.

## 1. Kein angreifbarer Server

Die Website ist **statisch**: Beim Speichern im CMS wird sie einmal komplett als fertige HTML-Dateien gebaut und
dann nur noch ausgeliefert. Es gibt

- **keine Datenbank** (keine SQL-Injection),
- **kein PHP / kein WordPress** (keine Plugin-Lücken, keine Updates, die man vergessen kann),
- **kein Admin-Login auf dem Webserver** (das CMS speichert direkt in GitHub, nicht auf dem Server),
- **keine Cookies** zu Werbe- oder Analysezwecken und keine fremden Skripte, Schriften oder Tracker.

Einziger serverseitiger Code ist die kleine Funktion für das Kontaktformular (`functions/api/kontakt.js`).
Sie prüft Herkunft, Länge und Format aller Eingaben, hat eine Spam-Falle (Honeypot + Mindest-Ausfüllzeit),
kann Cloudflare Turnstile (datenschutzfreundliches Captcha) nutzen und speichert nichts.

## 2. Firewall: Cloudflare vor der Seite

Die Seite läuft auf **Cloudflare Pages**. Damit steht Cloudflares Netz automatisch davor:

| Schutz | Wo einstellen | Empfehlung |
|---|---|---|
| DDoS-Schutz (Layer 3/4 und 7) | automatisch | immer an, unbegrenzt, auch im Gratis-Tarif |
| Web Application Firewall (WAF), „Cloudflare Free Managed Ruleset“ | Security → WAF → Managed rules | einschalten |
| Bot Fight Mode | Security → Bots | einschalten |
| Rate Limiting für das Kontaktformular | Security → WAF → Rate limiting rules | Pfad `/api/kontakt`, max. **5 Anfragen pro 10 Sekunden** pro IP, Aktion „Block“ für 1 Stunde |
| Eigene Firewall-Regel gegen Scanner | Security → WAF → Custom rules | Block, wenn `URI Path` enthält `wp-login`, `wp-admin`, `xmlrpc`, `.php`, `.env`, `.git` |
| Eigene Regel für das CMS | Security → WAF → Custom rules | Optional: `/admin/` nur aus Deutschland erlauben (`ip.src.country ne "DE"` → Block) |
| SSL/TLS | SSL/TLS → Overview | **Full (strict)**, „Always Use HTTPS“ an, TLS 1.2 Minimum, HSTS an |
| DNSSEC | DNS → Settings | einschalten |

Die genauen Schritte stehen in `LIVEGANG.md`.

## 3. Zugang zum CMS: doppelt gesperrt

1. **Cloudflare Access** (Zero Trust, gratis bis 50 Personen) sperrt `/admin/*`. Nur freigeschaltete E-Mail-Adressen
   kommen überhaupt bis zur Login-Seite; Anmeldung per Einmal-Code.
2. **GitHub-Login** mit **Pflicht zur Zwei-Faktor-Anmeldung** (in der GitHub-Organisation erzwingbar).
   Nur Personen, die im Repository Schreibrechte haben, können speichern.

Jede Änderung ist in GitHub mit Person und Zeitpunkt protokolliert und lässt sich zurückdrehen.
Empfehlung: Branch-Schutz für `main` so einstellen, dass niemand die Historie löschen oder überschreiben kann
(Settings → Branches → „Do not allow force pushes“ und „Do not allow deletions“).

## 4. Sicherheits-Header

In `public/_headers` gesetzt und lokal mit Cloudflares eigener Laufzeit geprüft:

- **Content-Security-Policy**: Skripte, Styles, Schriften und Bilder nur vom eigenen Server. Frames nur von Vimeo,
  YouTube (nocookie) und Turnstile. Kein `unsafe-inline`, kein `unsafe-eval`. Formulare nur an die eigene Seite.
- **Strict-Transport-Security** (2 Jahre, inkl. Subdomains, preload-fähig)
- **X-Frame-Options: DENY** / `frame-ancestors 'none'` (kein Einbetten der Seite in fremde Seiten, gegen Clickjacking)
- **X-Content-Type-Options: nosniff**, **Referrer-Policy**, **Permissions-Policy** (Kamera, Mikro, Standort usw. aus),
  **Cross-Origin-Opener-Policy** und **Cross-Origin-Resource-Policy**
- `/admin/` bekommt eine eigene, engere Ausnahme-Policy (nur GitHub-API, die Schriften der CMS-Oberfläche
  und der eigene Login-Dienst) und wird nie zwischengespeichert.

Nach dem Livegang mit https://securityheaders.com und https://observatory.mozilla.org prüfen (Ziel: A+).

## 5. Datenschutz

- Videos laden erst nach Klick (Zwei-Klick-Lösung), Vimeo im Modus „Do not track“, YouTube über `youtube-nocookie.com`.
- Ausnahme: Der **Hintergrund-Trailer auf der Startseite** lädt Vimeo direkt (so gewünscht, wie bisher auch).
  Er startet nicht bei „Bewegung reduzieren“ oder im Datensparmodus. Wer ganz ohne Drittanbieter auskommen will,
  lädt den Trailer als MP4-Datei hoch (siehe `LIVEGANG.md`, Abschnitt „Trailer ohne Vimeo“).
- Schriften liegen auf dem eigenen Server (keine Google-Fonts-Abfrage).
- Die Datenschutzerklärung muss vor dem Livegang ergänzt werden (`src/content/seiten/datenschutz.md`).

## 6. Wartung

- Keine Server-Updates nötig. Abhängigkeiten (`npm`) einmal im Quartal aktualisieren: `npm update && npm audit`.
- Sveltia CMS liegt als Datei in `public/admin/` (Version 0.253.2) und wird nicht von einem fremden CDN geladen.
  Update: `npm pack @sveltia/cms@<version>` und `dist/sveltia-cms.js` + `dist/chunks/*.js` ersetzen.
- Backups: Das komplette Repository (Texte und Bilder) liegt in GitHub. Zusätzlich empfohlen: einmal im Monat
  `git clone --mirror` auf einen zweiten Ort (z. B. externe Festplatte des Vereins).
