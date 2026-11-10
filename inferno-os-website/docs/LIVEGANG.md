# Vorschau für den Kunden und Livegang

Reihenfolge: erst eine passwortgeschützte Vorschau-Adresse für den Kunden, nach der Abnahme dann die Umstellung
von www.inferno-os.de. Die alte Seite bleibt bis zum letzten Schritt unverändert online.

Benötigt: ein GitHub-Konto (am besten eine Organisation, z. B. `inferno-os`), ein kostenloses Cloudflare-Konto
und Zugriff auf die Domain-Verwaltung von inferno-os.de.

---

## 1. Eigenes Repository anlegen

1. Auf GitHub ein **privates** Repository anlegen, z. B. `inferno-os/website`.
2. Den Ordner `inferno-os-website/` dort hineinkopieren (der Inhalt ist das Wurzelverzeichnis des neuen Repos).
3. In der `.gitignore` die Zeile `public/media/spieltage/` **löschen**: Im eigenen Repo gehört das Fotoarchiv dazu.
4. Fotoarchiv von der alten Seite übernehmen (einmalig, dauert ca. 10 Minuten, braucht Node.js 22):

   ```bash
   npm install
   npm run migrate        # lädt alle Spieltagsbilder der alten Seite und verkleinert sie (ca. 180 MB)
   git add -A && git commit -m "Fotoarchiv der alten Seite übernommen" && git push
   ```

5. In `public/admin/config.yml` bei `backend.repo` den Namen des Repos eintragen (z. B. `inferno-os/website`).
6. Repository-Einstellungen: Settings → Branches → Regel für `main`: Force-Pushes und Löschen verbieten.
   In der Organisation: Settings → Authentication security → **Zwei-Faktor-Anmeldung verpflichtend**.

## 2. Cloudflare Pages verbinden

1. Cloudflare-Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → Repository wählen.
2. Projektname: `inferno-os`
3. Build-Einstellungen:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Umgebungsvariable `NODE_VERSION` = `22`
4. **Save and Deploy**. Nach 2 bis 3 Minuten läuft die Seite unter `https://inferno-os.pages.dev`.

## 3. Vorschau mit Passwortschutz (für die Präsentation)

Solange der Kunde noch nicht abgenommen hat, darf die Vorschau nicht öffentlich sein.

1. Cloudflare-Dashboard → **Zero Trust** (beim ersten Mal Team-Namen wählen, Gratis-Tarif „Free“).
2. **Access → Applications → Add an application → Self-hosted**.
3. Name: `INFERNO Vorschau`, Domain: `inferno-os.pages.dev`, zusätzlich `*.inferno-os.pages.dev`.
4. Policy: **Allow**, Include → **Emails** → die E-Mail-Adressen von dir und vom Kunden.
5. Login-Methode: **One-time PIN** (Code per E-Mail, kein Passwort nötig).

Ergebnis: Wer `inferno-os.pages.dev` aufruft, muss seine E-Mail-Adresse eingeben und bekommt einen Code.
Alternativ zur Präsentation auf dem eigenen Laptop: `npm run build && npm run preview`, dann http://localhost:4321.

Zusätzlich ist während der Vorschau-Phase alles auf `noindex` gestellt (Einstellung „Vorschau-Modus“ und `robots.txt`),
damit Suchmaschinen nichts aufnehmen.

## 4. Login für das Redaktionssystem einrichten

**Schnell (für die Präsentation):** Unter `/admin/` „Sign In Using Access Token“ wählen. Den Token erstellt man auf GitHub
unter Settings → Developer settings → **Fine-grained tokens**: nur dieses eine Repository, Berechtigung
„Contents: Read and write“, Ablaufdatum setzen.

**Dauerhaft (für die Redaktion):** Login per „Sign In with GitHub“.
1. Den Login-Dienst **sveltia-cms-auth** als Cloudflare Worker anlegen (Anleitung und „Deploy“-Knopf:
   https://github.com/sveltia/sveltia-cms-auth).
2. Auf GitHub eine **OAuth App** anlegen (Settings → Developer settings → OAuth Apps), Callback-URL:
   `https://<worker-adresse>/callback`. Client-ID und Secret als Secrets im Worker hinterlegen,
   `ALLOWED_DOMAINS` = `www.inferno-os.de, inferno-os.pages.dev`.
3. In `public/admin/config.yml` bei `backend.base_url` die Worker-Adresse eintragen.
4. Jede Person der Redaktion bekommt im Repository Schreibrechte (Settings → Collaborators).

## 5. CMS zusätzlich absichern

Zero Trust → Access → Applications → **Add an application → Self-hosted**:
Name `INFERNO Redaktion`, Domains `www.inferno-os.de/admin` und `inferno-os.pages.dev/admin`,
Policy **Allow** → Emails der Redaktion. (Bleibt auch nach dem Livegang bestehen.)

## 6. Kontaktformular einrichten

Das Formular schickt Nachrichten per E-Mail an `info@inferno-os.de`. Bis das eingerichtet ist, zeigt es einen
freundlichen Hinweis mit der E-Mail-Adresse.

1. Kostenloses Konto bei **Resend** (resend.com) anlegen, die Domain `inferno-os.de` dort verifizieren
   (Resend nennt die DNS-Einträge), API-Key erstellen.
2. Cloudflare → Pages-Projekt → **Settings → Variables and Secrets**:
   - Secret `RESEND_API_KEY` = der API-Key
   - `KONTAKT_AN` und `KONTAKT_VON` stehen schon in `wrangler.toml` (bei Bedarf dort ändern)
3. Spam-Schutz **Turnstile** (Cloudflare, ohne Cookies): Dashboard → Turnstile → Widget anlegen für
   `www.inferno-os.de` und `inferno-os.pages.dev`.
   - Build-Variable `PUBLIC_TURNSTILE_SITEKEY` = Site Key
   - Secret `TURNSTILE_SECRET` = Secret Key
4. Neu deployen (Deployments → Retry deployment) und eine Testnachricht schicken.

## 7. Schrift „Damaged Goods“ einsetzen

1. Lizenz prüfen: Die Schrift ist auf Fontseiten meist nur „free for personal use“ gekennzeichnet.
   Für eine öffentliche Website am besten beim Urheber nachfragen oder eine Lizenz erwerben.
2. Datei als `public/fonts/damaged-goods.woff2` ablegen (eine `.ttf` oder `.otf` mit dem Namen `damaged-goods` geht auch;
   in WOFF2 umwandeln spart Ladezeit, z. B. mit `npx ttf2woff2`).
3. Fertig: Beim nächsten Build ersetzt sie automatisch den Platzhalter „Rubik Distressed“ in allen Überschriften und im Menü.

## 8. Livegang auf www.inferno-os.de

Vorher erledigen:
- [ ] Kunde hat abgenommen
- [ ] Beispiel-Beiträge unter Aktuelles gelöscht
- [ ] Datenschutzerklärung ergänzt (`Seiten & Texte → Datenschutz`, Hinweis „Text folgt noch“ ausschalten)
- [ ] Text „20 Jahre“ eingefügt oder Hinweis bewusst stehen gelassen
- [ ] `Einstellungen → Vorschau-Modus` ausgeschaltet
- [ ] `public/robots.txt` durch die Livegang-Version ersetzt (steht in der Datei)

Umstellung:
1. Domain zu Cloudflare holen: Cloudflare → **Add a site** → `inferno-os.de`. Cloudflare liest die vorhandenen
   DNS-Einträge ein. **Wichtig: MX- und TXT-Einträge für die E-Mail-Adresse übernehmen**, sonst kommt keine Mail mehr an.
   Danach beim bisherigen Domain-Anbieter die Nameserver auf die zwei von Cloudflare genannten ändern.
2. Pages-Projekt → **Custom domains** → `www.inferno-os.de` und `inferno-os.de` hinzufügen.
   Cloudflare legt die Einträge an und besorgt das Zertifikat.
3. Weiterleitung `inferno-os.de` → `www.inferno-os.de`: Rules → **Redirect Rules** → „Redirect from root to www“.
4. Access-Anwendung „INFERNO Vorschau“ löschen (die für `/admin` bleibt).
5. Firewall einschalten wie in `SICHERHEIT.md`, Abschnitt 2 beschrieben.
6. Prüfen: alte Adressen wie `www.inferno-os.de/Fotos/2526.html` leiten automatisch auf die neuen Seiten um.

## Trailer ohne Vimeo (optional)

Der Hintergrund-Trailer kommt von Vimeo, wie auf der alten Seite. Wer gar keine Verbindung zu Vimeo/YouTube möchte:
Trailer als MP4 (720p, H.264, möglichst unter 25 MB) im CMS unter **Einstellungen → Trailer im Hintergrund → Quelle:
Eigene Videodatei** hochladen. Dateien über 25 MB nimmt Cloudflare Pages nicht an; dann das Video vorher verkleinern,
z. B. `ffmpeg -i trailer.mp4 -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -an trailer-720.mp4`.
