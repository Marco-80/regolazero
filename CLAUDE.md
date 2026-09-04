# RegolaZero — Istruzioni di Progetto (CLAUDE.md)

> File di riferimento per Claude Code. Se un dettaglio non è qui e non è
> deducibile dal codice, **chiedere all'utente** prima di inventare.

---

## 1. Cos'è, e come si costruisce (deciso il 04/09/2026, dopo un reset completo)

Sito del publisher indie di giochi di ruolo **RegolaZero** (Roberto
Mazzucchi, Cristian Lenti, Alessandra Panuccio). In futuro ospiterà: la
presentazione delle produzioni originali (a partire da **The Mist**, GdR
dark fantasy compatibile Mörk Borg, licenza *Mörk Borg Third Party
License*) e materiali gratuiti per sistemi di altri autori.

**Regola tecnica non negoziabile, decisa esplicitamente dall'utente:**
**solo HTML, CSS, JavaScript puri. Niente Node, niente Astro (o altro
framework/generatore di siti), niente build step, niente npm install per
poter lavorare.** Si scrive un file `.html`, lo si apre col doppio click o
lo si pusha, punto. Vale per questo sito **e** per gli strumenti separati
(§6).

**Perché**: nella sessione del 04/09 si era costruito il sito con Astro +
Decap CMS + Netlify Identity/Git Gateway. Ha funzionato, ma il tempo speso
a configurare servizi esterni (Netlify privato di default, funzioni a
pagamento, certificato HTTPS lento, bug di timing tra librerie, un secondo
login da capire) ha superato il valore di quello che l'automazione dava.
L'utente ha chiesto **esplicitamente** di cancellare tutto e ripartire con
codice semplice, scritto a mano, senza toolchain — e poco dopo ha chiesto
di togliere **anche** il pulsante di login Netlify Identity dalla pagina
(prima tenuto perché "funzionava già"): sulla pagina non deve restare
**nulla** legato a Netlify. **Non riproporre Astro, Decap, Netlify (in
nessuna forma — Identity/Git Gateway/hosting), Strapi/Payload/Ghost/
WordPress, Bootstrap o jQuery senza che sia l'utente a richiederlo di
nuovo direttamente** — è già stato deciso di no, più volte.

---

## 2. Infrastruttura già pronta — NON toccare/ricreare senza motivo

Questa parte ha richiesto ore reali di lavoro (dell'utente, sui pannelli di
terzi) e **funziona**. Un reset del codice non tocca questi pezzi:

- **Dominio**: `regolazero.it`, registrato su Register.it. DNS già puntati
  a GitHub Pages: 4 record A sull'apex (`185.199.108.153`, `.109.153`,
  `.110.153`, `.111.153`) + CNAME `www` → `marco-80.github.io.`
- **Repo GitHub**: **https://github.com/Marco-80/regolazero** (pubblico).
  `origin` già collegato in locale, branch `main`.
- **GitHub Pages**: Settings → Pages → Source = **GitHub Actions**. File
  `CNAME` nel repo mantiene il dominio custom.
- **HTTPS**: ✅ attivo — certificato emesso, `http://` reindirizza da solo
  a `https://` (verificato la sera del 04/09).
- **Netlify Identity — NON PIÙ USATO sul sito** (rimosso da `index.html` su
  richiesta esplicita dell'utente: "elimina tutto ciò che ha a che fare con
  Astro, Netlify"). L'account/progetto Netlify **esiste ancora**
  (`regolazero.netlify.app`, Project ID
  `83295086-8ed3-4cc5-b43b-23bd362780c3`) — non è stato cancellato, solo
  scollegato dalla pagina. Non riattivarlo/riusarlo senza che l'utente lo
  chieda di nuovo.

---

## 3. Struttura del repository

```
REGOLAZERO/
├── CLAUDE.md
├── README.md
├── .gitignore
├── CNAME                       riga singola: regolazero.it
├── index.html                  UNICA pagina per ora: coming-soon
├── images/
│   └── site/
│       ├── logo-regolazero.png         logo bianco, sfondo trasparente
│       ├── logo-regolazero-header.png  stessa cosa, versione più piccola
│       └── lucchetto.png               icona lucchetto per il pulsante login
└── .github/
    └── workflows/
        └── deploy.yml           push su main → pubblica il repo così com'è
                                  (nessuna build: solo checkout + upload)
```

Quando si aggiungono pagine: file `.html` allo stesso livello o in
sottocartelle, link relativi normali (`<a href="/pagina/">` o
`<a href="./pagina.html">`), CSS inline o in un file `.css` condiviso,
niente componenti/template — se serve ripetere header/footer su più
pagine, si copia l'HTML in ciascun file (è il costo accettato della scelta
"niente framework", già discusso e confermato con l'utente).

---

## 4. `index.html` — coming-soon (l'unica pagina, per ora)

**L'unica cosa che l'utente ha detto esplicitamente di aver apprezzato**
del lavoro precedente: tenerla così, non ridisegnarla senza che lo chieda.
Versione attuale, **volutamente minima, senza JavaScript**:

- Sfondo scuro fisso `#121212` (non segue tema chiaro/scuro di sistema: il
  logo è bianco su trasparente, deve restare leggibile sempre).
- Logo centrato (`images/site/logo-regolazero.png`), sotto il testo
  "Il sito è in costruzione. Torna presto."
- **Nient'altro.** Niente pulsante di login, niente script esterni, niente
  Netlify: rimossi su richiesta esplicita dell'utente il 04/09 sera
  ("elimina tutto ciò che ha a che fare con Astro, Netlify"). Se in futuro
  serve di nuovo un login/blocco d'accesso, va ridiscusso da capo — non
  riportare dentro lo script di Netlify Identity di default.

---

## 5. Backend/CMS per scrivere contenuti — NON ANCORA DECISO

Con Astro/Decap è stato tentato e poi abbandonato (v. §1). Ora che il sito
è di nuovo HTML puro, il discorso "pannello per scrivere articoli" va
ripensato da zero — potenzialmente più semplice proprio perché non c'è più
un framework/CMS di mezzo con cui far quadrare le cose. Non proporre
soluzioni finché l'utente non chiede di riprendere questo punto.

---

## 6. Strumenti standalone (mappa, generatori) — FUORI da questo repo

Mappa interattiva del Braenmore e generatori casuali di The Mist: **non
vivono qui**. Stanno in:
```
C:\Users\mscar\Desktop\regolazero\strumenti\
├── index.html                    hub con link a tutti gli strumenti
├── style.css                     tema scuro condiviso
├── mappa/
│   ├── index.html                mappa interattiva (pin cliccabili)
│   └── img/braenmore.jpg         scansione reale del Braenmore
└── generatore-villaggio/
    └── index.html                nome/disgrazia/segreto di un villaggio
```
Stessa regola di §1: HTML/CSS/JS puro, nessuna dipendenza. Se si riprende
questo lavoro, partire da quella cartella, non da questo repo. Restano da
decidere: dove ospitarli stabilmente e come richiamarli dal sito
definitivo (link diretto o iframe).

---

## 7. The Mist — regola sui contenuti (resta valida)

**The Mist è un prodotto in vendita, non va regalato sul sito.** Quando si
scriveranno pagine su The Mist: solo materiale promozionale (blurb,
ambientazione a grandi linee, perché giocarlo, copertina, credits) ed
eventuali 1-2 esempi "anteprima" espliciti — mai bestiario/avventure/regole
o tabelle trascritte di peso dal manuale. Le 134 pagine del manuale in
`Desktop/regolazero/themist/` restano riferimento di tono, non materiale
da copiare.

Terminologia di gioco già fissata da usare se/quando si scrive:
`PF` (Punti Ferita) · `CD` (Classe Difficoltà) · `Presenza` · `Sussurro` ·
`Agilità` · `Forza` · `Tempra` · `Morale` · `Lumen`. Nomi propri (personaggi,
luoghi, "The Mist" stesso) invariati in italiano e in inglese.

---

## 8. Privacy e legale (resta valido)

- Nessun CDN di terze parti che traccia, a parte lo script di Netlify
  Identity per il login (funzionale, non di tracciamento).
- Nessun dato personale in URL.
- Non inventare mai dati di contatto (email, telefono) come segnaposto —
  è già successo una volta, evitarlo. Se manca un dato reale, ometterlo o
  chiedere.
- Materiali "compatibili con X" vanno marcati come tali, non affiliati;
  per Mörk Borg rispettare la *Mörk Borg Third Party License* (testo/logo
  ufficiali ancora da recuperare dall'utente).

---

## 9. Regole operative per Claude Code

- **Prima di aggiungere qualunque dipendenza, tool, framework o servizio
  esterno nuovo: fermarsi e chiedere.** È la lezione della giornata del
  04/09: ogni "tanto è comodo" ha finito per costare più tempo di quanto
  ne facesse risparmiare.
- Ambiente: **Windows PowerShell 5.1**, non supporta `&&`. Usare `;` o
  righe separate.
- Commit/push solo quando l'utente chiede di procedere (o l'ha già
  autorizzato esplicitamente per l'iterazione in corso).
- Aggiornare questo file quando cambia qualcosa di sostanziale — è già
  successo che una versione vecchia abbia fatto ripetere un errore.
