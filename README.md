# RegolaZero — sito

Sito statico del publisher **RegolaZero** e microsito **The Mist**.
Astro + Decap CMS + Pagefind, deploy su GitHub Pages (`regolazero.it`).

Le istruzioni complete di progetto sono in **[CLAUDE.md](./CLAUDE.md)**.

## Setup

Serve **Node 20 LTS**.

```bash
node -v            # deve stampare v20.x
npm install
npm run dev        # http://localhost:4321
```

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | server di sviluppo |
| `npm run build` | build statica in `./dist` (con indice Pagefind) |
| `npm run preview` | anteprima locale della build |
| `npm run cms` | Decap server locale per editare i contenuti offline |

Editing contenuti in locale: avviare `npm run dev` **e** `npm run cms`, poi
aprire `http://localhost:4321/admin/`.

## Deploy

Automatico via GitHub Actions a ogni push su `main`
(`.github/workflows/deploy.yml`). Su GitHub: Settings → Pages → Source =
*GitHub Actions*. Il file `public/CNAME` mantiene il dominio custom.
