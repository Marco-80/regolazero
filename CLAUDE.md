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
├── index.html                  coming-soon con i 3 pannelli (v. §4)
├── mappa/index.html            stub "in arrivo" (link da pannello sinistro)
├── the-mist/index.html         stub "in arrivo" (link da pannello destro)
├── images/
│   └── site/
│       ├── logo-regolazero.png         logo bianco, sfondo trasparente
│       ├── logo-regolazero-header.png  stessa cosa, versione più piccola
│       └── cliccami.png                freccia+testo "Cliccami", trasparente
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

- Sfondo scuro fisso `#121212` (non segue tema chiaro/scuro di sistema: il
  logo è bianco su trasparente, deve restare leggibile sempre).
- Logo centrato (`images/site/logo-regolazero.png`). **Non c'è più testo
  sotto** ("Il sito è in costruzione. Torna presto." è stato tolto su
  richiesta esplicita del 04/09 notte, sostituito dall'interazione al
  click descritta sotto).
- **Nebbia di sfondo animata**: due gruppi di macchie bianche appena
  percettibili, sfocate via CSS (`filter: blur(70px)`), che derivano
  lentissime con **p5.js** (rumore di Perlin, `t += 0.0015 * vel` per
  frame) — script caricato da CDN (`cdnjs.cloudflare.com/.../p5.min.js`),
  nessuna build, coerente con §1. **3 "nuclei"** compatti (raggio
  0.35–0.6× la dimensione maggiore dello schermo, alpha 5/255, velocità
  normale) + **3 macchie diffuse** più larghe (raggio 0.85–1.15×, alpha
  3/255, velocità ridotta ×0.6). Ogni macchia segue un percorso di
  rumore indipendente (seed diverso): si incrociano, si fondono
  (l'alpha si somma dove si sovrappongono) e si dividono da sole, senza
  logica esplicita di collisione. `pointer-events` non toccati (il
  canvas sta dietro al contenuto, `z-index: 0`).
- Niente pulsante di login, niente Netlify: rimossi su richiesta esplicita
  dell'utente il 04/09 sera
  ("elimina tutto ciò che ha a che fare con Astro, Netlify"). Se in futuro
  serve di nuovo un login/blocco d'accesso, va ridiscusso da capo — non
  riportare dentro lo script di Netlify Identity di default.
- **Interazione al click sul logo**: il logo (`#logo`) sta dentro
  `.salita` che al click risale con `transform: translateY(...)`
  (transizione CSS 5,6s, `cubic-bezier(0.83, 0, 0.17, 1)` — accelera e
  decelera molto lentamente) finché il logo non è a 50px dal bordo
  superiore, e resta lì fisso. Un solo click ha effetto (flag `spostato`
  in JS): i successivi non fanno nulla.
- **Indicatore "Cliccami"** (`#cliccami`, immagine freccia+testo
  trasparente, `images/site/cliccami.png`): compare in dissolvenza
  (1,2s) 4,5s dopo il caricamento della pagina, posizionata sopra il
  logo (`position:absolute` dentro `.salita`, percentuali relative al
  box del logo). Al click sul logo sparisce **di botto, non in
  dissolvenza** — si ottiene togliendo la classe `.cliccami--visibile`
  (che porta con sé sia `opacity:1` sia la `transition`): senza
  transizione dichiarata sullo stato base, il cambio è istantaneo.
  Se si clicca prima dei 4,5s il timer viene annullato e non compare
  affatto. `pointer-events:none` per non intercettare i click destinati
  al logo sottostante.
- **Pannelli sotto il logo** (`#pannelli`): `position:fixed`,
  indipendenti dal logo. Quando il logo è a **metà** della sua risalita
  (2,8s), i pannelli partono da più in basso e risalgono in dissolvenza
  (3,4s, più veloci del logo) fino quasi al centro schermo (+30px). La
  posizione finale è **calcolata in JS a ogni click** (non in puro CSS)
  sulle dimensioni reali di logo/pannelli/viewport, per garantire che
  non finiscano mai sotto al logo, a nessuna risoluzione (desktop
  incluso, su finestre basse). Layout: riga di 3 affiancati su schermi
  larghi; sotto i 640px, griglia 2×2 con 2 quadrati sopra
  (`#pannello-sinistra`/`#pannello-destra`) + 1 rettangolo largo sotto
  (`#pannello-centro`, larghezza uguale ai due sopra insieme — se non
  c'è spazio verticale si accorcia in altezza soltanto, disattivando
  `aspect-ratio` via JS per non perdere la larghezza).
  **Contenuto attuale dei 3 pannelli** (05/09):
  - `#pannello-sinistra` — link `<a href="/mappa/">` "Mappa interattiva
    e generatori" → pagina stub `mappa/index.html` ("Pagina in arrivo"),
    in attesa di ospitare la mappa/i generatori che oggi vivono fuori
    dal repo (§6: restano da decidere hosting definitivo e collegamento).
  - `#pannello-destra` — link `<a href="/the-mist/">` "Scopri The Mist"
    → pagina stub `the-mist/index.html` ("Pagina in arrivo"), da
    scrivere rispettando le regole sui contenuti di §7.
  - `#pannello-centro` — form newsletter (`#form-newsletter`):
    **registrazione disattivata di proposito** (pulsante `disabled`,
    messaggio fisso "Al momento non disponibile..."). L'utente ha
    esplicitamente rifiutato di far scrivere il form direttamente su un
    file nel repo GitHub via token client-side: qualunque credenziale
    nel JS del sito è visibile a chiunque (view-source), quindi
    chiunque potrebbe scrivere/vandalizzare quel file — non è
    praticabile per un sito statico pubblico, a prescindere dallo scope
    del token. La strada corretta quando si riprende il discorso: una
    funzione serverless (token lato server, mai esposto) oppure un
    servizio di form/email marketing pronto — entrambi "servizio
    esterno nuovo", quindi da concordare (§9) prima di implementare.
  **Bug CSS/JS incontrati e da ricordare**: (1) un elemento
  `position:fixed` con `left`+`right` e poi una `width` esplicita in un
  media query va centrato con `margin: 0 auto`, altrimenti il browser
  scarta `right` e il box si incolla a sinistra; (2) impostare `height`
  via JS su un elemento con `aspect-ratio` in CSS fa ricalcolare anche
  la `width` — va disattivato `aspect-ratio: auto` insieme all'altezza;
  (3) **`.contenuto`** (il wrapper che centra il logo) è trasparente ma
  copre l'intera pagina (`min-height:100svh`) — essendo dopo `#pannelli`
  nel DOM con lo stesso `z-index`, senza `pointer-events:none` su
  `.contenuto` (e `pointer-events:auto` su `.salita` per ridare i click
  al logo) intercetta i click destinati ai pannelli ovunque tranne
  esattamente sul logo.
- **Audio di sottofondo**: player YouTube nascosto (video attuale
  `c6RiHp2-bGY`; il precedente `1YhKgK_2PU4` resta commentato nel codice
  nel caso si torni indietro), dominio `youtube-nocookie.com` per
  ridurre il tracciamento, via **YouTube IFrame Player API** ufficiale
  (`https://www.youtube.com/iframe_api`) — nessun download/estrazione
  audio, solo embed standard. **Parte con l'audio già attivo**
  (`mute:0` nell'autoplay) a volume molto basso (`8/100`): i browser
  bloccano quasi sempre l'autoplay con audio senza gesto dell'utente,
  quindi come rete di sicurezza si sblocca comunque al primo click/
  tocco/tasto sulla pagina se risulta ancora muto. **Pulsante
  altoparlante** in alto a destra (`#audio-toggle`, icona SVG classica
  on/off) come controllo manuale attiva/disattiva — sostituisce il
  vecchio "sblocco al primo tocco" come unico controllo, non affidabile
  su mobile. **Bug incontrato**: l'attributo/proprietà `hidden` su
  `<svg>` non è affidabile in tutti i browser (`.hidden` può risultare
  `undefined`, e `[hidden]{display:none}` dello UA stylesheet non
  sempre si applica a `<svg>`) — si usa `setAttribute`/`removeAttribute`
  esplicito più una regola CSS `svg[hidden]{display:none}` dedicata,
  non ci si affida al default. Div contenitore `#audio-sottofondo`,
  nascosto via CSS inline (1×1px, `opacity:0`).
- **Respiro del logo più organico**: il `@keyframes respiro` (variazione
  di luminosità, 10s ease-in-out infinite) varia leggermente la propria
  durata a ogni ciclo (10s ± 1,5s) invece di restare fissa. **Bug
  incontrato**: cambiare `animation-duration` a caldo sull'animazione in
  corso fa scattare il valore, perché il browser ricalcola la fase
  sul tempo totale trascorso dall'inizio, non da quel ciclo — si
  riavvia invece l'animazione da zero a ogni ciclo
  (`animation:none` + reflow forzato + nuova `animation` con la nuova
  durata), invisibile perché inizio e fine del keyframe coincidono
  (`brightness(1)` a 0% e 100%).

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

- Nessun CDN di terze parti che traccia, a parte l'embed YouTube per
  l'audio di sottofondo (§4) — usa `youtube-nocookie.com` apposta per
  ridurre il tracciamento, ma resta comunque una connessione a Google.
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
