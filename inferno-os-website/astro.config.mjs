// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.inferno-os.de',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Keine Inline-Styles und -Skripte: erlaubt eine strenge Content-Security-Policy
    // ohne 'unsafe-inline' (siehe public/_headers).
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  devToolbar: { enabled: false },
});
