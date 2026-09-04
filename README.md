# RegolaZero — sito

Sito statico del publisher **RegolaZero**. HTML/CSS/JS puro — nessun
framework, nessuna build, nessun `npm install`. Si apre e si modifica come
qualunque file di testo.

Le istruzioni complete sono in **[CLAUDE.md](./CLAUDE.md)**.

## Sviluppo

Apri `index.html` col doppio click, oppure con un server locale qualsiasi
(es. l'estensione "Live Server" di VS Code) se serve testare percorsi
assoluti (`/images/...`).

## Deploy

Automatico: ogni push su `main` pubblica il contenuto del repo così com'è
su GitHub Pages, via GitHub Actions (`.github/workflows/deploy.yml`) —
nessuna build, solo upload dei file. Dominio custom: `regolazero.it` (file
`CNAME`).
