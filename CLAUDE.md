# RegolaZero — Istruzioni di Progetto (CLAUDE.md)

> File unico di riferimento per Claude Code. Contiene il brief, lo stack, la
> struttura del repo, i comandi, le convenzioni e il piano di lavoro a fasi.
> Se un dettaglio non è qui e non è deducibile dal codice, **chiedere all'utente**
> prima di inventare.

---

## 1. Cos'è

Sito del publisher indie di giochi di ruolo **RegolaZero** (Roberto Mazzucchi,
Cristian Lenti, Alessandra Panuccio). Ospita:

1. La **presentazione** delle produzioni originali del team — a partire da
   **The Mist**, GdR dark fantasy compatibile Mörk Borg, pubblicato sotto
   *Mörk Borg Third Party License* (MB3PL).
2. **Materiali supplementari futuri**, gratuiti, creati dal team per sistemi
   di altri autori (es. contenuti "compatibili con Mörk Borg", "compatibili
   con CY_BORG", ecc.).

> **Regola fondamentale (decisa dall'utente): The Mist è un prodotto in
> vendita, non va regalato sul sito.** Questo sito è la sua **vetrina**
> (presentazione, atmosfera, perché giocarlo, dove comprarlo) e la casa dei
> **materiali futuri gratuiti** — non un modo per leggere il manuale gratis.
> Dettagli operativi in §13.

- **Dominio:** `regolazero.it` — già registrato, DNS presumibilmente già puntati.
- **Hosting:** GitHub Pages. Sito **100% statico**, nessun backend server, nessun
  database, nessun PHP. Tutto file-based e versionato in Git.
- **Lingua dei contenuti:**
  - **Sito RegolaZero (sito madre): solo italiano.** Nessun i18n, nessun
    prefisso lingua negli URL.
  - **Microsito The Mist: bilingue IT/EN.** Stesse pagine, stessi URL: la
    lingua si sceglie con una **bandierina** nel microsito (vedi §7.3).
    Default `it`. Struttura pronta ad aggiungere altre lingue in futuro.
  - Nomi propri (personaggi, luoghi, il titolo "The Mist") restano invariati
    in entrambe le lingue, come da traduzione ufficiale del manuale.

---

## 2. Stack tecnico

| Ambito | Scelta | Note |
|---|---|---|
| Static site generator | **Astro** (ultima major) | componenti `.astro` nativi; framework JS pesanti solo dove serve davvero |
| Editing contenuti | **Decap CMS** (ex Netlify CMS) | pannello web sotto `/admin/`, login GitHub, ogni salvataggio = commit Git |
| Ricerca full-text | **Pagefind** via `astro-pagefind` | indice generato in build, gira lato client, zero servizi a pagamento |
| Sitemap XML | `@astrojs/sitemap` | |
| Markdown esteso | `@astrojs/mdx` | per le pagine che devono includere componenti interattivi |
| CI/CD | **GitHub Actions** | build + deploy a ogni push su `main` |
| Hosting | **GitHub Pages** | dominio custom via file `CNAME` |
| Package manager | **npm** | lockfile `package-lock.json` committato |
| Runtime | **Node ≥ 20** (`.nvmrc` = 20; dev machine: 24.19.0) | build verificata su Node 24 |

### Requisiti d'ambiente

Node.js è installato sulla macchina di sviluppo (v24.19.0, npm 11.x). `npm
install` + `npm run build` girano puliti (31 pagine, Pagefind + sitemap OK).

Attenzione: la shell è **Windows PowerShell 5.1**, che **non** supporta `&&`.
Concatenare i comandi con `;` o su righe separate:

```powershell
npm install ; npm run dev
```

---

## 3. Struttura del repository

Root del repo = `D:\Workspace\REGOLAZERO`.

```
REGOLAZERO/
├── CLAUDE.md                    questo file
├── README.md                    setup rapido per umani
├── .gitignore
├── .nvmrc                       "20"
├── package.json
├── package-lock.json
├── astro.config.mjs
├── tsconfig.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml           build + deploy GitHub Pages
│
├── public/
│   ├── CNAME                    contiene la sola riga: regolazero.it
│   ├── admin/
│   │   ├── index.html           entry point Decap CMS
│   │   └── config.yml           configurazione collection Decap
│   ├── fonts/                   webfont self-hosted (woff2)
│   └── images/
│       ├── archivio/            copertine card
│       └── the-mist/            asset del microsito
│
├── src/
│   ├── content/
│   │   ├── config.ts            schema Zod delle collection
│   │   ├── giochi/              .md — catalogo (una entry per gioco), solo IT
│   │   ├── articoli/            .md/.mdx — post tipo WP, campo `gioco`, solo IT
│   │   ├── contenuti/           .md — schede/espansioni/hack/download, solo IT
│   │   ├── generatori/          .md — registro generatori (logica = componente), solo IT
│   │   └── the-mist/
│   │       ├── bestiario/{it,en}/  <slug>.md — una scheda per creatura, per lingua
│   │       └── avventure/{it,en}/  <slug>.md — una per avventura, per lingua
│   │
│   ├── i18n/
│   │   ├── the-mist.ts          dizionario stringhe UI del microsito { it, en }
│   │   └── content.ts           vociPerLingua(): filtra it/<slug> · en/<slug> per lingua
│   │
│   ├── layouts/
│   │   ├── MainLayout.astro     sito RegolaZero (header/footer publisher, solo IT)
│   │   ├── ArticoloLayout.astro layout tipo blog per il singolo articolo
│   │   └── TheMistLayout.astro  microsito The Mist (identità separata, bilingue)
│   │
│   ├── components/
│   │   ├── main/                Header, Footer, CardGioco, CardArticolo, CardContenuto,
│   │   │                        FiltriFaccette…
│   │   ├── generatori/          <Nome>.astro — un componente per generatore (isola client)
│   │   └── the-mist/            MistReturnLink, LanguageSwitcher, MappaBraenmore…
│   │       └── pages/           *Body.astro — corpo di ogni pagina del microsito
│   │                            (prop `lang`), condiviso da route IT ed EN
│   │
│   ├── styles/
│   │   ├── main.css             tema publisher: pulito, neutro
│   │   └── the-mist.css         tema microsito: decadenza & nebbia
│   │
│   ├── data/
│   │   └── generatori/          tabelle dei generatori come JSON
│   │
│   └── pages/
│       ├── index.astro                          home publisher
│       ├── giochi/
│       │   ├── index.astro                      catalogo (collection `giochi`)
│       │   └── [gioco]/
│       │       ├── index.astro                  hub del gioco
│       │       ├── articoli/{index,[slug]}.astro
│       │       ├── contenuti/{index,[slug]}.astro
│       │       └── generatori/{index,[slug]}.astro
│       ├── articoli/
│       │   └── {index,[slug]}.astro             indice cross-gioco + articoli "di casa"
│       ├── materiali/
│       │   └── index.astro                      vista `contenuti` senza gioco, per sistema
│       ├── archivio/
│       │   └── index.astro                      vista aggregata + Pagefind + faccette
│       └── the-mist/                            MICROSITO — usa solo TheMistLayout
│           ├── index.astro                IT  → /the-mist/  (descrizione gioco)
│           ├── mappa.astro
│           ├── generatori/index.astro
│           ├── mailing-list.astro
│           ├── bestiario/{index,[slug]}.astro
│           ├── avventure/{index,[slug]}.astro
│           ├── download.astro
│           └── en/                         EN → /the-mist/en/  (stesse route, lang="en")
│               ├── index.astro
│               ├── mappa.astro
│               ├── generatori/index.astro
│               ├── mailing-list.astro
│               ├── bestiario/{index,[slug]}.astro
│               ├── avventure/{index,[slug]}.astro
│               └── download.astro
│
├── data/
│   ├── mailing-list.ndjson      iscrizioni (una riga JSON per email) — scritto dal Worker
│   └── README.md                formato e note privacy
│
├── workers/
│   └── mailing-list/            Cloudflare Worker: POST → commit su data/mailing-list.ndjson
│       ├── index.js             (stub, §7.5)
│       ├── wrangler.toml.example
│       └── README.md
│
└── scripts/
    └── importa-manuale.mjs      utility one-shot: PNG/docx manuale → bozze .md
```

Le route `the-mist/` (IT) e `the-mist/en/` (EN) sono **wrapper minimi** (~5
righe): tutto il markup vive una volta sola nei componenti
`src/components/the-mist/pages/*Body.astro`, che ricevono `lang`. Le route EN
differiscono solo per `lang="en"` e la profondità dei path relativi.

### Materiali sorgente (fuori repo, non committare i binari grezzi)

`C:\Users\mscar\Desktop\regolazero\`
- `themist/` — 134 PNG numerati = pagine del manuale The Mist (scan/export).
- `themist/the mist.zip` — stesse pagine + extra utili:
  - `mappa.png` — mappa del Braenmore (base per la mappa interattiva, Fase 5)
  - `scelta colori.png` — candidate palette e font (vedi §9, decisione aperta)
  - `tab1.png`, `tab 2.png`, `tab 3.png` — tabelle casuali del manuale (inglese)
- `RegolaZero/` — cartella vuota, ignorare.

Da queste fonti si estraggono testi e immagini per bestiario, avventure e lore.
Le immagini definitive vanno in `public/images/`, ottimizzate (vedi §8).

---

## 4. Comandi

```bash
npm install            # prima volta e dopo ogni cambio dipendenze
npm run dev            # server di sviluppo -> http://localhost:4321
npm run build          # build statica in ./dist  (include indice Pagefind)
npm run preview        # anteprima locale della build
npm run cms            # decap-server locale per editare i contenuti offline (porta 8081)
```

`package.json` → `scripts`:

```json
{
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "cms": "decap-server"
}
```

Editing locale dei contenuti: avviare **sia** `npm run dev` **sia** `npm run cms`,
poi aprire `http://localhost:4321/admin/`. In `config.yml` deve essere presente
`local_backend: true`.

---

## 5. Configurazione Astro

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://regolazero.it',
  // dominio custom alla root: NIENTE `base`
  integrations: [mdx(), sitemap(), pagefind()],
  build: { format: 'directory' },
});
```

Note:
- `site` serve a sitemap, canonical URL e Pagefind. Non cambiarlo.
- Nessun `base`: il sito sta alla radice di `regolazero.it`.
- `astro-pagefind` aggiunge l'indicizzazione in coda a `astro build` e fornisce
  il componente `<Search />`. Marcare il contenuto indicizzabile con
  `data-pagefind-body` nei layout; escludere nav/footer con
  `data-pagefind-ignore`.

---

## 6. Modello di contenuto

Tutte **content collections** Astro con loader `glob` e schema Zod in
`src/content/config.ts`. Editing via Decap CMS (§ pannello `/admin/`).

### 6.1 Architettura del sito madre: catalogo → gioco → {articoli, contenuti, generatori}

Richiesta dell'utente: un sistema editoriale tipo WordPress, agganciato al
catalogo giochi. La gerarchia è:

```
catalogo giochi (collection `giochi`)
  └─ gioco (una entry)                         /giochi/<gioco>/
       ├─ articoli   (collection `articoli`,  gioco=<slug>)   news, approfondimenti, diari
       ├─ contenuti  (collection `contenuti`, gioco=<slug>)   schede, espansioni, hack, download
       └─ generatori (collection `generatori`, gioco=<slug>)  strumenti interattivi
```

Ogni entry di `articoli` / `contenuti` / `generatori` ha un campo **`gioco`**
(lo slug di una entry `giochi`). Se `gioco` è vuoto:
- articolo → articolo "di casa" RegolaZero (non legato a un titolo);
- contenuto → materiale per **sistemi di altri autori** (campo `sistema`
  valorizzato) — è ciò che alimenta `/materiali/`.

**Collection (schema Zod, sintesi):**

```ts
// giochi — il catalogo
{
  titolo, slug, sistema,               // es. "Mörk Borg (compatibile)"
  stato: 'in-sviluppo' | 'pubblicato',
  anno: number,
  copertina: string,
  estratto: string,                    // per la card
  microsito?: string,                  // es. "/the-mist/" (solo The Mist per ora)
  link_esterni?: { label, url }[],     // store, itch, DriveThru…
  ordine?: number,                     // ordinamento manuale nel catalogo
  // body = descrizione lunga del gioco
}

// articoli — post tipo blog/WP
{
  titolo, slug,
  gioco?: string,                      // slug di `giochi`, o vuoto
  data: date, aggiornato?: date,
  autore: string,                      // "Roberto Mazzucchi" | "Cristian Lenti" | …
  categoria: string,                   // "novità" | "diario di sviluppo" | "regole" | …
  tag: string[],
  estratto: string,
  copertina?: string,
  bozza: boolean,                      // true = non pubblicato (vedi editorial_workflow)
  // body MDX (può includere componenti: tabelle, generatori embed…)
}

// contenuti — materiali/risorse
{
  titolo, slug,
  gioco?: string,
  sistema?: string,                    // valorizzato se gioco è vuoto (materiali per altri sistemi)
  tipo: 'scheda' | 'espansione' | 'hack' | 'download' | 'riferimento',
  file?: string,                       // path in /public/downloads/… (PDF, docx)
  link_esterno?: string,
  estratto: string,
  // body opzionale
}

// generatori — registro; la LOGICA è un componente, non il file .md
{
  titolo, slug,
  gioco?: string,
  estratto: string,
  componente: string,                  // nome file in src/components/generatori/<X>.astro
  dati?: string,                       // path a un JSON di tabelle in src/data/generatori/
}
```

`bestiario` e `avventure` (microsito The Mist) restano collection a sé, bilingui
(§6.2).

### 6.1.1 Routing del sito madre

```
/giochi/                              catalogo: griglia da `giochi`
/giochi/<gioco>/                      hub del gioco: descrizione + ultimi articoli +
                                       contenuti + generatori + (se presente) CTA al microsito
/giochi/<gioco>/articoli/             elenco articoli del gioco
/giochi/<gioco>/articoli/<slug>/      articolo (URL canonico se ha `gioco`)
/giochi/<gioco>/contenuti/            elenco contenuti del gioco
/giochi/<gioco>/contenuti/<slug>/     contenuto
/giochi/<gioco>/generatori/           elenco generatori del gioco
/giochi/<gioco>/generatori/<slug>/    generatore (monta il componente)
/articoli/                            indice di TUTTI gli articoli (cross-gioco);
                                       gli articoli senza `gioco` sono canonici qui: /articoli/<slug>/
/materiali/                           vista su `contenuti` con `gioco` vuoto e `sistema` valorizzato
/archivio/                            vista aggregata (giochi + articoli + contenuti) + Pagefind + faccette
```

**The Mist — sovrapposizione col microsito (decisione aperta §9.9).** Proposta:
`articoli` e `contenuti` di The Mist vivono nel sistema editoriale del sito
madre (`/giochi/the-mist/…`, comodi da scrivere in Decap, con la grafica
publisher). Mappa, bestiario, avventure e generatori immersivi restano nel
microsito `/the-mist/…`. L'hub `/giochi/the-mist/` mostra la descrizione + una
**CTA forte** verso il microsito e i link alle sue sezioni.

### 6.1.2 Sistema editoriale (il "tipo WP")

- **Decap CMS** fornisce l'editing tipo WP: editor rich text/Markdown, upload
  media, anteprima, e **workflow editoriale** (`publish_mode:
  editorial_workflow` → colonne Bozza / In revisione / Pronto, con PR su
  GitHub). In alternativa più semplice: campo `bozza: true/false` e basta.
- Un articolo con `bozza: true` (o non ancora "Pronto" nel workflow) **non**
  viene incluso nella build (`getCollection` filtra `data.bozza !== true`, e in
  `import.meta.env.PROD`).
- Feed RSS di `/articoli/` con `@astrojs/rss` (aggiungere la dipendenza quando
  si implementa la Fase relativa).
- Immagini degli articoli: `src/assets/articoli/` via `astro:assets`, oppure
  `public/images/articoli/` se caricate da Decap.

### 6.1.3 Il backend (Decap) — anche il catalogo giochi è "tipo WP"

`public/admin/config.yml` — tutte le entità si creano/modificano dal pannello
come in WordPress:

- **Giochi**: pulsante "New Gioco", campi titolo/sistema/stato/anno/copertina/
  estratto/microsito/link esterni/ordine + corpo (descrizione). Il catalogo è
  interamente CMS-managed: aggiungere un gioco = una entry, zero codice.
- **Articoli**: "New Articolo" →
  - **Tipo di articolo**: `select` su vocabolario controllato
    (`TIPI_ARTICOLO` in `src/content/config.ts`): *novità, recensione, tips,
    guida, diario di sviluppo, intervista, dietro le quinte, errata*.
    Estendibile — tenere allineati enum Zod e `options` del `config.yml`.
  - **Collega a un gioco**: widget `relation` sulla collection `giochi`
    (`value_field: {{slug}}`). Vuoto ⇒ **articolo generico** RegolaZero
    (canonico in `/articoli/<slug>/`); valorizzato ⇒ canonico in
    `/giochi/<gioco>/articoli/<slug>/`.
  - data, autore, tag, estratto, copertina, `bozza` (default **true**), corpo.
- **Contenuti** e **Generatori**: stesso schema `relation` opzionale su
  `giochi`; per i contenuti, `sistema` valorizzato + gioco vuoto ⇒ `/materiali/`.
- **The Mist**: collection separate per lingua (`bestiario_it` / `bestiario_en`
  / `avventure_it` / `avventure_en`) che scrivono nelle sottocartelle
  `it/` ed `en/` della stessa collection.
- `publish_mode: editorial_workflow` attivo (Bozza / In revisione / Pronto via
  PR). Disattivabile per usare solo il flag `bozza` (§9.10).

### 6.2 Collection `the-mist/bestiario` e `the-mist/avventure` — bilingue

Contenuti del microsito. Migrati dai materiali già tradotti/prodotti
(bestiario, avventure di test come "Il Canto Gelato"). Mantenere la
**terminologia fissata** (§10).

**Modello bilingue: sottocartella per lingua.** Ogni voce ha un file in
`it/` e uno in `en/` con lo stesso nome:

```
src/content/the-mist/bestiario/
├── it/
│   └── spettro-della-nebbia.md
└── en/
    └── spettro-della-nebbia.md
```

> Nota: il glob loader **slugifica** gli `id` e rimuove i punti, quindi un
> suffisso `nome.it.md` diventerebbe `nomeit`. Con la sottocartella l'`id` è
> pulito: `it/spettro-della-nebbia`.

- Il loader `glob` (`**/*.md`) prende tutto; `vociPerLingua(entries, lang)` in
  `src/i18n/content.ts` fa match su `^(it|en)/(.+)$` e restituisce lo slug base.
- **Lingue separate** (§7.3): l'indice e il dettaglio IT usano solo i file
  in `it/` (route `/the-mist/…`); quelli EN solo i file in `en/`
  (route `/the-mist/en/…`). Se manca il file di una lingua, la voce **non esiste** in
  quell'edizione — nessun fallback all'altra lingua.
- Il frontmatter è per-lingua (`nome`/`titolo`, `tratti`/`tags` possono
  differire). Le collection del sito madre (§6.1) restano **solo IT**.

---

## 7. I due temi visivi

### 7.1 `MainLayout.astro` — sito RegolaZero

Identità da **publisher**: pulita, neutra, sobria. **Non** deve scimmiottare lo
stile di un singolo gioco. Header con logo RegolaZero + nav
(`Home · Giochi · Articoli · Materiali · Archivio`), footer con crediti team,
link social, note legali.

**Hub di gioco** (`/giochi/<gioco>/`): modello pagine prodotto di
`needgames.it/giochi/` — hero, descrizione di ambientazione, punti di forza,
box copertina/stato/link, e in fondo le tre sezioni collegate: **ultimi
articoli**, **contenuti**, **generatori** (§6.1). Per The Mist, in più, una
CTA netta al microsito ("Entra nel mondo di The Mist →").

**Articolo** (`/giochi/<gioco>/articoli/<slug>/` o `/articoli/<slug>/`): layout
tipo blog — titolo, meta (autore, data, categoria), copertina, corpo MDX,
tag, e "altri articoli di <gioco>" in fondo.

### 7.2 `TheMistLayout.astro` — microsito The Mist

**Requisito chiave: deve sentirsi un'esperienza a sé.** Regole ferree:

- Stesso repo, sotto-percorso `/the-mist/`, **layout completamente separato**.
- **Nessun** componente di navigazione/header/footer condiviso col sito madre.
- `MainLayout.astro` non viene **mai** importato sotto `src/pages/the-mist/`.
- L'unico ponte verso il sito madre è un link minimo e discreto in un angolo
  (componente `MistReturnLink`, tipo "un progetto RegolaZero ↩").
- In un angolo (accanto al link di ritorno) sta il **selettore lingua a
  bandierine** (`LanguageSwitcher`), IT / EN — vedi §7.3.
- Una sola build, un solo deploy, un solo indice Pagefind — ma due identità
  nettamente distinte.

Linee guida estetiche (valori definitivi da confermare, §9):
- Palette scura, desaturata, con **un** accento forte (candidati: rosso sangue /
  blu di Prussia / giallo marcio — vedi `scelta colori.png`).
- Tipografia display gotica/old-style per i titoli (coerente con le copertine
  originali); corpo testo con font leggibile.
- Texture/rumore leggero sullo sfondo, estetica "Borg".
- Micro-interazioni che suggeriscono nebbia/foschia (hover, cambi pagina) senza
  animazioni pesanti. Rispettare `prefers-reduced-motion`.

### 7.3 The Mist — bilingue IT/EN (lingue SEPARATE, URL distinti)

Scelta dell'utente: le due lingue sono **separate**. Ogni pagina è resa in
**una sola lingua**; la bandierina è un **link** alla pagina gemella.

- **URL:**
  - IT (default): `/the-mist/…` — nessun prefisso.
  - EN: `/the-mist/en/…` — stesso albero di route sotto `src/pages/the-mist/en/`.
- **Niente i18n globale di Astro** (il sito madre resta intoccato): il routing
  per lingua è manuale, via cartella `en/`.
- **Markup una volta sola:** ogni pagina del microsito ha il corpo in
  `src/components/the-mist/pages/<Nome>Body.astro`, con prop `lang`. Le route
  IT ed EN sono wrapper di ~5 righe che passano `lang` a `TheMistLayout` e al
  `*Body`.
- **Stringhe UI:** `src/i18n/the-mist.ts` → `t[lang].<chiave>`. Helper di path:
  `urlMist(lang, 'bestiario/')`, `altMistPath(pathname)` (per il selettore),
  `prefissoLingua(lang)`.
- **Contenuti lunghi:** un file per lingua in `it/<slug>.md` / `en/<slug>.md`
  (§6.2). `vociPerLingua(entries, lang)` filtra e restituisce lo slug base.
  Se manca il file di una lingua, quella voce **non compare** in
  quell'edizione: nessun fallback silenzioso all'altra lingua.
- **`TheMistLayout`** prende `lang`, imposta `<html lang>`, `og:locale`,
  `data-pagefind-filter="lang:<lang>"` sul corpo, e monta
  `LanguageSwitcher` + `MistReturnLink` nell'angolo.
- **`LanguageSwitcher`**: due voci bandierina (🇮🇹 IT / 🇬🇧 EN); l'attiva ha
  `aria-current` e non è un link, l'altra punta a `altMistPath(...)`. Salva la
  scelta in `localStorage['tm-lang']` (per un eventuale redirect futuro dalla
  home — **non** attivo ora, niente redirect automatici lato SSG).
- **Pagefind:** i risultati portano `filters.lang`; in Fase 6 la ricerca di
  `/archivio/` (sito madre, IT) e quella del microsito restano separabili per
  lingua.
- **`giochi/the-mist.astro`** (sito madre, IT) linka a `/the-mist/` (IT).
- **`sitemap`**: `@astrojs/sitemap` include automaticamente sia `/the-mist/…`
  sia `/the-mist/en/…`. `hreflang` esplicito: opzionale, da valutare in Fase 6.

Il sito madre non è toccato: resta IT puro, nessun `LanguageSwitcher`, nessun
file in `the-mist/**/en/`, nessun componente `*Body` con `lang`.

### 7.4 The Mist — funzionalità richieste

Il microsito deve avere (tutte in IT e EN, route gemella sotto `en/`):

| # | Sezione | Route IT | Stato | Fase |
|---|---|---|---|---|
| 1 | **Descrizione del gioco** — cos'è, ambientazione, come si gioca, pilastri | `/the-mist/` (home) | struttura sì, testi definitivi no | 3 |
| 2 | **Mappa interattiva** del Braenmore | `/the-mist/mappa/` | placeholder | 5 |
| 3 | **Iscrizione alla mailing list** (salva le email "internamente") | `/the-mist/mailing-list/` | form sì, backend da decidere — §7.5 | 3 |
| 4 | **Generatore casuale** | `/the-mist/generatori/` | placeholder | 4 |
| 5 | **Contenuti scaricabili** (PDF, schede, docx) | `/the-mist/download/` | placeholder | 3 |

Bestiario e avventure restano parte del microsito ma non sono nell'elenco
"minimo" richiesto dall'utente: priorità ai 5 punti qui sopra.

### 7.5 Mailing list — vincolo dell'hosting statico

**Problema.** Il sito è statico su GitHub Pages: **non c'è un server** e una
pagina statica **non può scrivere un file** alla submit. "Salvare le email in
un file interno" richiede per forza un piccolo componente lato server che
riceve il POST e scrive nel repo (o in uno storage).

**Approccio consigliato** (coerente con "tutto in Git", privacy-first, e con
l'infrastruttura già prevista per l'OAuth di Decap, §9.3):

- Un **Cloudflare Worker** dedicato (`workers/mailing-list/`) espone un
  endpoint `POST /`. Riceve `{ email, lingua, ts }`, valida, e **committa**
  una riga in `data/mailing-list.ndjson` nel repo via GitHub Contents API
  (token in un secret del Worker, **mai** nel repo). Un file NDJSON =
  "file interno", versionato, ispezionabile, esportabile.
- Anti-spam: honeypot nascosto + campo `tempo minimo di compilazione`;
  opzionale Cloudflare Turnstile (niente Google reCAPTCHA).
- Doppio opt-in (email di conferma): fuori scope per la Fase 3, previsto dopo
  (serve un invio email — es. MailChannels dal Worker, o Buttondown).
- La pagina Astro (`MailingListBody.astro`) ha un `<form method="post">` con
  `action={import.meta.env.PUBLIC_MAILINGLIST_ENDPOINT}` + progressive
  enhancement `fetch()` per messaggi inline. Se l'env var non è impostata, il
  form mostra un avviso e ripiega su un link `mailto:`.

**Alternative** se non si vuole gestire un Worker: Buttondown / Listmonk
self-hosted / Formspree (tier free). Nessuna salva "nel repo": vanno valutate
solo se si rinuncia al requisito "file interno". → **decisione aperta §9.8.**

**Mai nel repo:** token GitHub, chiavi API, URL con segreti. L'endpoint pubblico
del Worker sì (è pubblico per natura), via `PUBLIC_MAILINGLIST_ENDPOINT`.

---

## 8. Asset e immagini

- Le immagini vanno referenziate da `src/` quando possibile e passate per
  `astro:assets` (`<Image />`) per ottimizzazione automatica; le copertine e gli
  asset editoriali gestiti da Decap stanno in `public/images/` (percorso stabile,
  niente hashing).
- Convertire i PNG del manuale in **WebP/AVIF** dove usati come artwork; tenere
  gli originali fuori dal repo.
- Ogni immagine di contenuto ha `alt` significativo in italiano.
- La mappa del Braenmore (`mappa.png`) resta come immagine di base ad alta
  risoluzione sotto `public/images/the-mist/`, con i marker in overlay SVG/HTML
  (Fase 5), non "bruciati" nell'immagine.

---

## 9. Decisioni aperte — CHIEDERE prima di finalizzare

1. **Palette del microsito.** Candidati da `scelta colori.png`:
   `bianco/nero/rosso` · `bianco/nero/blu di Prussia` · `bianco/nero/giallo`.
   Servono i valori esatti (hex) per sfondo, testo, accento, stati hover.
2. **Font del microsito.** Candidati display: *Another Shabby*, *Kust*,
   *AC Pathetich*, *Rushk*, *Avalon Caps*. Serve la scelta finale + licenza
   d'uso web + file `woff2` (self-hosting, niente Google Fonts CDN per privacy).
3. **Login di Decap CMS — GitHub o Google? (chiesto dall'utente)**
   Il backend `github` di Decap autentica **sempre via account GitHub**: ogni
   redattore deve averne uno, e il commit del contenuto viene attribuito a
   quell'account. "Accedi con Google" non esiste come opzione diretta su
   questo backend.
   Per avere davvero un **"Accedi con Google"** l'unica via è cambiare
   backend: **Netlify Identity + Git Gateway**. Si crea un progetto Netlify
   **gratuito** collegato allo stesso repo GitHub (il sito continua a essere
   **buildato e servito da GitHub Pages**, Netlify serve solo per
   autenticazione — non è un secondo hosting in conflitto); si abilita
   Identity con provider esterno Google; Decap si configura con
   `backend: { name: git-gateway }` invece di `github`. I redattori si
   loggano con l'account Google che inviti da Netlify Identity; Git Gateway
   fa i commit per loro (non serve più che abbiano un account GitHub).
   **Alternativa già pronta nello scaffold**: proxy OAuth su Cloudflare
   Worker (§7.5 ne ha già uno per la mailing list — stesso account) — ma lì
   il login resta "Accedi con GitHub".
   → **Da decidere**: Netlify Identity/Git Gateway (login Google, consigliato
   se chi scrive non ha/vuole un account GitHub) oppure GitHub OAuth via
   Worker (login GitHub, meno servizi esterni). Fino alla scelta, editing solo
   in locale (`npm run dev` + `npm run cms`).
4. **Struttura `/materiali/`.** Route dinamica `[sistema].astro` da subito o
   pagina indice singola finché c'è un solo sistema? Default proposto: indice
   singolo ora, dinamica quando arriva il secondo sistema.
5. **Testo legale MB3PL.** Recuperare dall'utente la formulazione esatta della
   nota "compatibile con Mörk Borg / non affiliato / used under the Mörk Borg
   Third Party License" e il logo ufficiale MB3PL da mettere nel footer del
   microsito e nelle pagine dei materiali Mörk Borg.
6. **Analytics.** Nessuno di default (privacy-first). Confermare o indicare una
   soluzione senza cookie (es. Plausible self-host / GoatCounter).
7. **Traduzioni EN di The Mist.** Chi fornisce i testi inglesi? Molti sono già
   nel manuale originale (in inglese); per i contenuti prodotti da RegolaZero
   (avventure, testi di lore, stringhe UI) serve sapere se traduce il team o
   vanno lasciati come `TODO:` nel file `en/<slug>.md`. Convenzione attuale:
   se manca il file in `en/`, la voce non compare nell'edizione EN.
8. **Backend mailing list (§7.5) — POSTICIPATO (deciso dall'utente).** Per ora
   `/the-mist/mailing-list/` resta col solo fallback `mailto:` (nessun
   `PUBLIC_MAILINGLIST_ENDPOINT` configurato). Lo stub Worker
   (`workers/mailing-list/`) resta come riferimento per quando si riprende il
   punto: approccio, token GitHub, Turnstile, doppio opt-in, privacy policy.
9. **The Mist: articoli/contenuti nel sito madre o nel microsito? (§6.1.1).**
   Proposta: articoli e contenuti in `/giochi/the-mist/…` (sistema editoriale
   publisher); mappa/bestiario/avventure/generatori restano nel microsito.
   Confermare o spostare tutto nel microsito.
10. **Tipi di articolo + workflow.** Confermare la lista `TIPI_ARTICOLO`
    (novità, recensione, tips, guida, diario di sviluppo, intervista, dietro
    le quinte, errata) — aggiungerne/toglierne. Tenere `editorial_workflow`
    (più "WP") o passare al solo flag `bozza`? Chi sono gli autori (valori del
    campo `autore`)?
11. **Repo pubblico o privato? — RISOLTO: pubblico (deciso dall'utente).**
    Implicazioni da tenere a mente: quando si riprende §9.8, `data/
    mailing-list.ndjson` **non deve mai contenere email reali** finché il
    repo è pubblico (spostare lo storage altrove — KV/D1 — o rendere privato
    il repo prima di attivare il backend). Con `editorial_workflow` le bozze
    articoli passano per una PR pubblica: chi non vuole bozze visibili prima
    della pubblicazione deve saperlo.
    Repo GitHub: **https://github.com/Marco-80/regolazero** (pubblico, creato
    dall'utente). `origin` collegato, branch `main`. `public/admin/config.yml`
    e `workers/mailing-list/wrangler.toml.example` puntano già a
    `Marco-80/regolazero`.
12. **Dove si compra The Mist?** Il sito deve linkare uno store reale (store
    proprio, itch.io, DriveThruRPG…) — per ora `link_esterni` in
    `giochi/the-mist.md` è vuoto. Serve l'URL quando c'è.
13. **Quali 1-2 contenuti "anteprima" pubblicare?** Vedi §13 — quali pezzi di
    bestiario/avventure (se nessuno) l'utente vuole mostrare come assaggio,
    ed eventuali PDF/quickstart gratuiti per `/the-mist/download/`.

---

## 10. Terminologia e convenzioni di scrittura

Termini di gioco **fissati** dalla traduzione del manuale — usare sempre questi:

`PF` (Punti Ferita) · `CD` (Classe Difficoltà) · `Presenza` · `Sussurro` ·
`Agilità` · `Forza` · `Tempra` · `Morale` · `Lumen`

- Sito madre: contenuti Markdown **solo in italiano**.
- Microsito The Mist: ogni voce ha un file in `it/` **e** uno in `en/`. La versione EN dei
  termini di gioco segue la nomenclatura del manuale originale Mörk Borg
  (HP, DR, …); la versione IT usa i termini fissati qui sopra.
- Nomi propri di personaggi e luoghi restano invariati in entrambe le lingue;
  idem il titolo "The Mist".
- Luoghi noti del Braenmore (per la mappa): Dun-Tara, Zarath, Cadmornagh,
  Lago di Oen, … (elenco completo da consolidare in Fase 5).
- Notazione dei dadi: nel manuale originale il glifo "d" è reso con un
  font-dado custom; nei testi del sito usare notazione testuale normale
  (`d6`, `2d6`, `d100`).
- Le tabelle casuali del manuale (`tab1/2/3.png`) sono in inglese: vanno
  tradotte quando diventano generatori (Fase 4).

---

## 11. Deploy — GitHub Actions + Pages

`.github/workflows/deploy.yml` (schema):

```yaml
name: Deploy site
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3        # installa Node, npm ci, astro build
      # withastro/action carica già l'artifact di Pages da ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- Repo GitHub → Settings → Pages → Source = **GitHub Actions**.
- `public/CNAME` con la sola riga `regolazero.it` finisce in `dist/` e mantiene
  il dominio custom a ogni deploy.
- DNS lato utente: record `A`/`AAAA` a GitHub Pages + `CNAME` per `www`.
- Verificare "Enforce HTTPS" dopo il primo deploy.

---

## 12. Piano di lavoro a fasi

**Fase 1 — Scheletro** *(in corso)*
Setup Astro, `MainLayout` + `TheMistLayout`, routing base di tutte le pagine
(anche solo placeholder), `astro.config.mjs`, `.nvmrc`, `.gitignore`, `CNAME`,
workflow `deploy.yml`. Bilinguismo del microsito già cablato a **lingue
separate**: route IT `/the-mist/` + EN `/the-mist/en/`, corpi condivisi
`components/the-mist/pages/*Body.astro`, `LanguageSwitcher`, dizionario
`src/i18n/the-mist.ts`. Deploy su GitHub Pages **funzionante** col dominio
custom. Nessun contenuto reale ancora, ma le due identità visive già
distinguibili.

**Fase 2 — CMS + catalogo/articoli (il "tipo WP")**
`public/admin/index.html` + `config.yml` con le collection di §6.1 (`giochi`,
`articoli`, `contenuti`, `generatori`), `local_backend` per l'editing offline.
Risolvere l'OAuth (§9.3). Implementare le route del sito madre (§6.1.1):
catalogo, hub di gioco, indici e dettagli di articoli/contenuti/generatori,
`/articoli/` cross-gioco. Filtro bozze in build. Verificare scrittura +
pubblicazione di un articolo end-to-end dal pannello.

**Fase 3 — Vetrina The Mist (IT + EN) + mailing list + download**

*(Rivista: The Mist è in vendita, il sito è vetrina — vedi §1 e §13. Niente
migrazione del manuale completo.)*

- **Descrizione del gioco** (home `/the-mist/`): testi definitivi IT/EN — cos'è,
  ambientazione (il Braenmore), perché giocarlo, pilastri. *(Fatto un primo
  giro con testo reale dal manuale, p. 4 — blurb/retrocopertina, materiale
  promozionale legittimo da pubblicare.)*
- **Link di acquisto**: valorizzare `link_esterni` nella entry `giochi/the-mist.md`
  con dove comprare il manuale (store, itch.io, DriveThruRPG…) — §9.12.
- **Mailing list**: rifinire `MailingListBody` (validazione, honeypot, stati
  successo/errore, privacy note) e **realizzare il backend scelto in §9.8**
  (Worker `workers/mailing-list/` + `data/mailing-list.ndjson`).
- **Download**: SOLO materiale gratuito legittimo (quickstart ridotto,
  scheda personaggio vuota, materiale promozionale) in
  `public/downloads/the-mist/` — non il manuale.
- **Bestiario/avventure**: al massimo **1-2 esempi "anteprima"** esplicitamente
  marcati come tali (per dare un assaggio del tono/qualità), non una
  migrazione sistematica del libro. Confermare con l'utente quali, se
  nessuno è già stato scelto.

**Fase 4 — Generatori casuali**
Componenti interattivi: generatore di villaggio, generatore di rovine
("Vecchi Ricordi"), generatore "Spettro della Nebbia" (emozione del luogo).
Tabelle come JSON in `src/data/`, logica di tiro lato client. Framework JS
leggero solo qui se serve (altrimenti vanilla + `<script>` nell'isola Astro).

**Fase 5 — Mappa interattiva**
`MappaBraenmore` — immagine base `mappa.png` + marker cliccabili in overlay per
le zone di lore (Dun-Tara, Zarath, Cadmornagh, Lago di Oen, …). Popup con testo
breve e link alla scheda estesa dove esiste.

**Fase 6 — Ricerca**
Pagefind su tutto il sito. Pagina `/archivio/` con barra di ricerca e filtri a
faccette (`sistema`, `genere`, `atmosfera`, `tipo`, `gioco`). Filtro `lang` per
distinguere i contenuti del microsito. Feed RSS di `/articoli/`.

**Fase 7 — Rifinitura editoriale e scalabilità**
`editorial_workflow` di Decap se scelto (§9.10), pagine autore/categoria/tag,
`/materiali/` per sistema, `hreflang` per The Mist. Verificare che aggiungere
un secondo gioco RegolaZero sia solo: nuova entry `giochi` + contenuti — zero
modifiche alle route (già dinamiche su `[gioco]`).

---

## 13. Regole operative per Claude Code

- **The Mist è un prodotto in vendita — MAI riversare il manuale sul sito
  pubblico.** Vale per bestiario, avventure, regole, tabelle complete: sono
  contenuto a pagamento. Sul sito vanno **solo**:
  - materiale promozionale (blurb/retrocopertina, ambientazione a grandi
    linee, "perché giocarlo", copertina, credits, ispirazioni — quello che
    normalmente sta su una scheda prodotto o una quarta di copertina);
  - **al massimo 1-2 esempi "anteprima"** espliciti (una creatura, un hook di
    avventura), solo se l'utente conferma quali (§9.13);
  - generatori con **tabelle originali**, scritte per il sito, non le tabelle
    del manuale copiate parola per parola (le tabelle del manuale, es.
    "Haunting Roads", "Weather", sono anch'esse contenuto a pagamento);
  - link per comprare il manuale altrove (§9.12), non un modo per leggerlo.
  Le 134 pagine del manuale in `Desktop/regolazero/themist/` restano una
  fonte di **riferimento per tono/stile**, non materiale da trascrivere in
  blocco. In caso di dubbio se qualcosa è "troppo", **chiedere prima**.
- **Preferire componenti `.astro` nativi.** Isole interattive (`client:*`) solo
  per mappa e generatori.
- **Non introdurre dipendenze** non elencate qui senza chiedere.
- **Non committare** binari grezzi del manuale (PNG/zip di Desktop): solo asset
  ottimizzati e necessari.
- **Non toccare** `MainLayout` dentro le pagine `the-mist/` e viceversa.
- **i18n solo nel microsito.** Mai `LanguageSwitcher`, componenti `*Body` con
  `lang`, o file in `**/en/` fuori da `the-mist/`. Ogni pagina del microsito
  esiste in due route (IT sotto `the-mist/`, EN sotto `the-mist/en/`) che
  condividono lo stesso `*Body.astro`: aggiungendo o modificando una pagina,
  aggiornare **entrambe** le route e le stringhe in `src/i18n/the-mist.ts`
  (chiavi `it` **e** `en`).
- **Accessibilità:** HTML semantico, contrasto AA anche nel tema scuro,
  `prefers-reduced-motion`, `alt` sempre.
- **Privacy:** font self-hosted, nessun CDN di terze parti che traccia, nessun
  dato personale in URL.
- **Legale:** ogni contenuto compatibile con sistemi altrui va marcato
  "compatibile con X — non affiliato"; per Mörk Borg rispettare la MB3PL
  (testo e logo, §9.5).
- Quando una scelta di §9 è ancora aperta e blocca il lavoro, **fermarsi e
  chiedere** invece di scegliere valori arbitrari.
- Aggiornare questo file quando una decisione aperta viene chiusa o quando la
  struttura del repo cambia in modo sostanziale.

---

## 14. Gate "Coming soon"

Il sito, in produzione, mostra a chiunque una pagina **"in arrivo"** finché
non è pronto — deciso dall'utente. Implementazione (sito 100% statico, niente
server, quindi **gate lato client**, non una vera protezione):

- Interruttore: `src/config/site.ts` → `COMING_SOON` (`true`/`false`).
  **Per pubblicare il sito vero, mettere `false` e ridistribuire.**
- Componente `src/components/ComingSoonGate.astro`, incluso come **primissima
  cosa** nell'`<head>` sia di `MainLayout` che di `TheMistLayout`: se
  `COMING_SOON` è vero e la pagina non è `/coming-soon/`, reindirizza lì
  (`location.replace`), a meno che `localStorage['rz-bypass-coming-soon']`
  non sia già impostato.
- **Bypass per chi sviluppa/testa**: visitare una volta
  `https://regolazero.it/?anteprima=nebbia-2026` (parametro e codice in
  `site.ts`, `BYPASS_PARAM`/`BYPASS_CODE`) imposta il flag in `localStorage` e
  da lì in poi quel browser vede il sito normalmente, su tutte le pagine.
  Cambiare `BYPASS_CODE` in `site.ts` in qualsiasi momento (non è un vero
  segreto: è nel codice sorgente pubblico del repo).
- Pagina `src/pages/coming-soon.astro`: standalone, `noindex`, non passa dal
  gate (altrimenti loop).
- **Limite noto, da tenere presente**: essendo tutto statico, l'HTML reale
  delle pagine "gated" esiste comunque nel sito pubblicato — chi disattiva
  JS, guarda il codice sorgente, o fa una richiesta diretta (`curl`, un bot)
  vede comunque il contenuto. Il gate blocca solo la **navigazione normale in
  browser**. Se in futuro serve un blocco vero, servirebbe un layer con logica
  a runtime (es. Cloudflare Access davanti al dominio) — fuori scope ora.
