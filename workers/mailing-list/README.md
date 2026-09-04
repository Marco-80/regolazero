# Worker: mailing list The Mist

Endpoint che riceve le iscrizioni dalla pagina `/the-mist/mailing-list/` e le
salva "internamente" (CLAUDE.md §7.5). **Stub**: da confermare l'approccio in
§9.8 prima di andare in produzione.

## Setup (approccio "commit sul repo")

1. `npm i -g wrangler` (o `npx wrangler`).
2. `cp wrangler.toml.example wrangler.toml` e compila `REPO`, `ALLOW_ORIGIN`.
3. Crea un PAT GitHub *fine-grained*: accesso al solo repo del sito,
   permesso **Contents: Read and write**. Poi:
   `wrangler secret put GITHUB_TOKEN`
4. `wrangler deploy`. Prendi l'URL del Worker (es.
   `https://regolazero-mailing-list.<subdomain>.workers.dev` o un dominio
   custom `oauth.regolazero.it` / `api.regolazero.it`).
5. Nel sito, imposta la env var di build:
   `PUBLIC_MAILINGLIST_ENDPOINT=<url del worker>`
   (in locale: `.env`; in CI: secret/var del repo — vedi `.env.example`).

## Note

- Un commit per iscrizione: va bene per volumi bassi. Per volumi alti passare a
  Cloudflare KV/D1 e un export periodico (decisione §9.8).
- Doppio opt-in (email di conferma): `TODO` nello stub, richiede invio email.
- Rate limiting: valutare Cloudflare Rules / Turnstile.
- Test locale: `wrangler dev` + `curl -X POST localhost:8787 -d '{...}'`.
