/**
 * Kontaktboard: Cloudflare Pages Function unter /api/kontakt
 *
 * Schutz vor Spam und Missbrauch:
 *  - nur POST, nur vom eigenen Ursprung (Origin-Prüfung)
 *  - Honeypot-Feld und Mindest-Ausfüllzeit
 *  - Längenbegrenzung aller Felder, Prüfung der E-Mail-Adresse
 *  - optional Cloudflare Turnstile (unsichtbares Captcha, datenschutzfreundlich)
 *  - zusätzlich Rate-Limit-Regel in der Cloudflare-Firewall (docs/SICHERHEIT.md)
 *
 * Versand per E-Mail, je nach Einrichtung:
 *  - Cloudflare Email Routing: Binding "KONTAKT_MAIL" (send_email), Ziel KONTAKT_AN
 *  - oder Resend-API: Secret RESEND_API_KEY, Absender KONTAKT_VON, Ziel KONTAKT_AN
 *
 * Umgebungsvariablen (Cloudflare Pages -> Settings -> Variables and Secrets):
 *  KONTAKT_AN          Empfänger, z. B. info@inferno-os.de
 *  KONTAKT_VON         Absender, z. B. kontaktboard@inferno-os.de
 *  TURNSTILE_SECRET    (optional) Secret Key von Cloudflare Turnstile
 *  RESEND_API_KEY      (optional) API-Key, falls Resend statt Email Routing genutzt wird
 */

const MAX = { name: 120, email: 200, betreff: 200, nachricht: 5000 };
const MIN_AUSFUELLZEIT_MS = 3000;
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

const json = (daten, status = 200) =>
  new Response(JSON.stringify(daten), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const antwort = (request, ok, fehler, status) => {
  const willJson = (request.headers.get('Accept') || '').includes('application/json');
  if (willJson) return json(ok ? { ok: true } : { fehler }, status);
  const ziel = new URL(ok ? '/kontakt/?gesendet=1' : '/kontakt/?fehler=1', request.url);
  return Response.redirect(ziel.toString(), 303);
};

const sauber = (wert, max) =>
  String(wert ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);

async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;
  const daten = new FormData();
  daten.append('secret', env.TURNSTILE_SECRET);
  daten.append('response', token);
  if (ip) daten.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: daten });
  const ergebnis = await r.json().catch(() => ({}));
  return ergebnis.success === true;
}

async function sende(env, { name, email, betreff, nachricht }) {
  const an = env.KONTAKT_AN;
  const von = env.KONTAKT_VON;
  if (!an || !von) throw new Error('nicht eingerichtet');
  const text = `Neue Nachricht über das Kontaktboard auf inferno-os.de\n\nName: ${name}\nE-Mail: ${email}\nBetreff: ${betreff}\n\n${nachricht}\n`;
  const titel = `Kontaktboard: ${betreff}`.replace(/[\r\n]+/g, ' ');

  if (env.KONTAKT_MAIL) {
    const { EmailMessage } = await import('cloudflare:email');
    const roh = [
      `From: INFERNO Kontaktboard <${von}>`,
      `To: <${an}>`,
      `Reply-To: <${email}>`,
      `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(titel)))}?=`,
      `Message-ID: <${crypto.randomUUID()}@inferno-os.de>`,
      `Date: ${new Date().toUTCString()}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      text,
    ].join('\r\n');
    await env.KONTAKT_MAIL.send(new EmailMessage(von, an, roh));
    return;
  }
  if (env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: `INFERNO Kontaktboard <${von}>`, to: [an], reply_to: email, subject: titel, text }),
    });
    if (!r.ok) throw new Error(`Resend ${r.status}`);
    return;
  }
  throw new Error('nicht eingerichtet');
}

export async function onRequestPost({ request, env }) {
  const herkunft = request.headers.get('Origin');
  if (herkunft && herkunft !== new URL(request.url).origin) {
    return json({ fehler: 'Ungültige Anfrage.' }, 403);
  }
  const laenge = Number(request.headers.get('Content-Length') || 0);
  if (laenge > 20000) return json({ fehler: 'Die Nachricht ist zu lang.' }, 413);

  let form;
  try {
    form = await request.formData();
  } catch {
    return antwort(request, false, 'Ungültige Anfrage.', 400);
  }

  // Honeypot und Ausfüllzeit: Bots bekommen eine „Erfolgsmeldung“, es wird nichts verschickt.
  const zeit = Number(form.get('zeit'));
  if (sauber(form.get('website'), 200) || (zeit && Date.now() - zeit < MIN_AUSFUELLZEIT_MS)) {
    return antwort(request, true, null, 200);
  }

  const daten = {
    name: sauber(form.get('name'), MAX.name),
    email: sauber(form.get('email'), MAX.email),
    betreff: sauber(form.get('betreff'), MAX.betreff),
    nachricht: sauber(form.get('nachricht'), MAX.nachricht),
  };
  if (!daten.name || !daten.betreff || !daten.nachricht || !EMAIL_RE.test(daten.email)) {
    return antwort(request, false, 'Bitte fülle alle Felder aus und prüfe deine E-Mail-Adresse.', 422);
  }

  const ip = request.headers.get('CF-Connecting-IP');
  if (!(await turnstileOk(env, form.get('cf-turnstile-response'), ip))) {
    return antwort(request, false, 'Die Sicherheitsprüfung hat nicht geklappt. Bitte lade die Seite neu.', 403);
  }

  try {
    await sende(env, daten);
  } catch (err) {
    console.error('Kontaktboard:', err.message);
    return antwort(
      request,
      false,
      'Das Kontaktboard ist gerade nicht erreichbar. Schreib uns bitte direkt an info@inferno-os.de.',
      503,
    );
  }
  return antwort(request, true, null, 200);
}

export function onRequest() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
