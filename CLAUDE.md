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

**Eccezione decisa il 05/09: Firebase (Firestore)** è l'unico backend
approvato, per due usi precisi — salvataggio punti della mappa (§4/§6) e
iscrizioni newsletter (§4). Caricato via CDN (`firebase-app-compat.js` +
`firebase-firestore-compat.js`), nessun SDK da installare, coerente con
"niente build". La `firebaseConfig` (apiKey ecc.) **è pensata per stare
in chiaro nel codice pubblico** — a differenza di un token GitHub, non è
un segreto: la sicurezza sta tutta nelle **regole di Firestore** (v. §4).
Non usare Firebase per altro (auth, hosting, storage...) senza che
l'utente lo richieda di nuovo esplicitamente — resta un'eccezione mirata,
non una porta aperta a "tanto ormai ce l'abbiamo".

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
├── mappa/                      mappa interattiva vera (Leaflet + Firestore, v. §6)
│   ├── index.html
│   ├── img/braenmore.jpg       scansione della mappa del Braenmore
│   ├── icone/                  icone Flaticon per categoria di punto
│   └── punti.json              NON PIÙ USATO dalla pagina (i punti sono
│                                 su Firestore) — lasciato come backup
│                                 dei 9 luoghi iniziali, v. §6
├── the-mist/index.html         stub "in arrivo" (link da pannello destro)
├── images/
│   └── site/
│       ├── logo-regolazero.png         logo bianco, sfondo trasparente
│       ├── logo-regolazero-header.png  stessa cosa, versione più piccola
│       ├── cliccami.png                freccia+testo "Cliccami", trasparente
│       ├── m_mappa.png                 sfondo pannello sinistro (mappa)
│       ├── m_scopri.png                sfondo pannello destro (The Mist)
│       └── m_news.png                  sfondo pannello centrale (newsletter)
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
  percettibili con **p5.js** (rumore di Perlin) — script caricato da CDN
  (`cdnjs.cloudflare.com/.../p5.min.js`), nessuna build, coerente con §1.
  Sfocate via CSS (`filter: blur(70px)`) **e** disegnate con un
  **gradiente radiale** (centro pieno → bordo trasparente, via
  `ctx.createRadialGradient` sul context nativo esposto da
  `p.drawingContext`) invece di un cerchio a tinta unita: la sfumatura
  resta morbida anche a distanza ravvicinata, non solo grazie al blur.
  **3 "nuclei"** piccoli (raggio 0.22–0.4× la dimensione maggiore dello
  schermo, alpha base 5/255) che girano per **tutto lo schermo** +
  **2 macchie grandi e diffuse** (raggio 0.85–1.15×, alpha base 3/255)
  che restano più concentrate verso il centro — a ciascuna macchia è
  associato un `espansione` diverso (2.6 per i nuclei, 0.9 per le
  diffuse: v. nota rumore sotto) che ne limita o allarga il raggio
  d'azione. Le diffuse sono anche le più lente (`vel: 0.6`), i nuclei
  volutamente rallentati il 05/09 (`vel: 0.5`, erano troppo veloci a
  `1`). Ogni macchia varia anche **velocità** (0.4×–1.6× la propria,
  altro asse di rumore indipendente: accelera/rallenta da sola nel
  tempo, ma la media resta lenta) e **intensità** (alpha tra 60% e 140%
  del suo valore base) per conto proprio, oltre a muoversi — non solo si
  spostano, cambiano ritmo e si accendono/affievoliscono. Ogni macchia
  segue un percorso di rumore indipendente (seed diverso): si
  incrociano, si fondono (l'alpha si somma dove si sovrappongono) e si
  dividono da sole, senza logica esplicita di collisione.
  **Nota sul rumore di Perlin** (bug/comportamento da ricordare):
  `p.noise()` da solo oscilla quasi sempre tra ~0.15 e ~0.85, non arriva
  mai vicino agli estremi 0/1 — usato direttamente per la posizione, le
  macchie restano ammassate al centro dello schermo e non toccano mai i
  bordi. Si corregge "allargando" lo scarto dal centro prima di
  convertirlo in posizione: `p.constrain(0.5 + (raw - 0.5) * espansione, 0, 1)`
  — con `espansione` alto (es. 2.6) si arriva davvero ai bordi, con uno
  basso (es. 0.9) il movimento resta più contenuto verso il centro.
  `pointer-events` non toccati (il canvas sta dietro al contenuto,
  `z-index: 0`).
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
  **Contenuto attuale dei 3 pannelli** (aggiornato 05/09): niente più
  testo scritto nell'HTML — ogni pannello ha un'immagine di sfondo
  (`background-image`, `background-size: cover`) fornita dall'utente,
  col titolo già incorporato nell'illustrazione stessa.
  - `#pannello-sinistra` — link `<a href="/mappa/">`, sfondo
    `images/site/m_mappa.png`, `aria-label="Mappa interattiva e
    generatori"` (l'accessibilità del link non dipende più da testo
    visibile) → mappa interattiva vera, v. §6.
  - `#pannello-destra` — link `<a href="/the-mist/">`, sfondo
    `images/site/m_scopri.png`, `aria-label="Scopri The Mist"` →
    pagina stub `the-mist/index.html` ("Pagina in arrivo"), da
    scrivere rispettando le regole sui contenuti di §7.
  - `#pannello-centro` — form newsletter (`#form-newsletter`), sfondo
    `images/site/m_news.png` (`align-items: flex-end`: il form sta
    vicino al fondo dell'illustrazione, dove l'immagine schiarisce ed è
    leggibile). **Funzionante**: al submit scrive su Firestore,
    collezione `newsletter` (v. sotto per le regole). Prima era
    disattivato (l'utente aveva rifiutato di scrivere il form
    direttamente su un file del repo GitHub via token client-side —
    problema di sicurezza reale, non risolvibile "nascondendo" il
    token in nessun modo: qualunque cosa nel JS pubblico è leggibile da
    chiunque). Risolto il 05/09 passando a Firebase (v. §1).
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
  `1YhKgK_2PU4`, ripristinato il 05/09 dopo una prova con `c6RiHp2-bGY`
  che resta commentato nel codice nel caso si torni indietro), dominio
  `youtube-nocookie.com` per
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
(Firebase/Firestore, v. §1, risolve solo i due casi specifici di §4/§6 —
mappa e newsletter — non è un CMS per articoli.)

---

## 6. `mappa/` — mappa interattiva (Leaflet + Firestore)

Sostituisce il vecchio prototipo standalone (che viveva fuori dal repo in
`C:\Users\mscar\Desktop\regolazero\strumenti\mappa\` — quella cartella
resta lì invariata come riferimento storico, non più la fonte).

- **Leaflet** (CDN, `cdnjs.cloudflare.com/.../leaflet.js`) con
  `L.CRS.Simple` + `L.imageOverlay('img/braenmore.jpg', ...)`: non è una
  mappa geografica, è un'immagine trattata come mappa. Comportamento
  pan/zoom touch e mouse è quello di default di Leaflet — già
  "alla Google Maps" su mobile e desktop, nessuna configurazione extra.
  - Zoom minimo = livello che fa **riempire tutto lo schermo** con la
    mappa (`map.getBoundsZoom(confini, true)` — l'opposto di
    `fitBounds`, che invece "contiene" lasciando spazio vuoto attorno).
    `maxBounds` = esattamente i bordi dell'immagine, `maxBoundsViscosity:
    1`: non si esce mai dalla mappa trascinando.
  - Un solo controllo zoom, in basso a destra (`zoomControl: false`
    sulla mappa + `L.control.zoom({position:'bottomright'})` a parte —
    altrimenti Leaflet mette di suo un secondo controllo in alto a
    sinistra).
  - Ogni punto ha un'**etichetta col nome sempre visibile** sotto il
    segnalino (`bindTooltip(..., {permanent:true})`), non solo nel
    popup al click.
- **Categorie** (`luogo`, `citta`, `villaggio`, `png`, `mostro`,
  `maniero`): icona propria (da Flaticon, fornite dall'utente il 05/09,
  in `mappa/icone/`) + colore del bordo del segnalino a goccia (stile
  Google Maps, via `L.divIcon`).
- **Click sulla mappa** (su spazio vuoto) → modale di creazione:
  categoria, nome, descrizione, pulsante "Genera automaticamente"
  (tabelle originali scritte per questo tool, in italiano — **non**
  tabelle trascritte dal manuale di The Mist, v. nota sotto), Salva.
  **Click su un punto esistente** → popup di lettura in stile Google
  Maps (nome + descrizione), via `bindPopup`.
- **Persistenza: Firestore**, collezione `punti` (progetto Firebase
  `regolazero`, v. §1 per la config). Lettura pubblica per tutti i
  visitatori (necessaria per mostrare la mappa), scrittura permessa a
  chiunque (non c'è login) ma **validata dalle regole** — categoria
  deve essere una delle 6 valide, nome/descrizione con limiti di
  lunghezza, lat/lng numerici. **Nessuna modifica o cancellazione dal
  client** (`allow update, delete: if false`): per correggere/rimuovere
  un punto sbagliato serve la console Firebase (Firestore Database →
  collezione `punti`), non c'è modo di farlo dal sito. Se in futuro
  serve poterlo fare dal sito stesso, serve un sistema di login
  (Firebase Auth) per l'utente — da valutare quando richiesto.
  I 9 luoghi originali (nomi presi dal vecchio prototipo, testi ancora
  segnaposto) sono stati migrati su Firestore il 05/09; il file
  `mappa/punti.json` resta solo come backup, **non è più letto dalla
  pagina**. Il pulsante "Esporta punti (JSON)" in alto a destra scarica
  un backup manuale di quello che c'è in quel momento su Firestore.
  **Regole di sicurezza attuali** (da aggiornare qui se cambiano —
  tenerne traccia, non solo nella console Firebase):
  ```
  match /punti/{puntoId} {
    allow read: if true;
    allow create: if request.resource.data.keys().hasOnly(['categoria','nome','descrizione','lat','lng','creato'])
      && request.resource.data.categoria in ['luogo','citta','villaggio','png','mostro','maniero']
      && request.resource.data.nome is string
      && request.resource.data.nome.size() > 0 && request.resource.data.nome.size() <= 80
      && request.resource.data.descrizione is string
      && request.resource.data.descrizione.size() <= 500
      && request.resource.data.lat is number
      && request.resource.data.lng is number;
    allow update, delete: if false;
  }
  ```
- **Generatori casuali — NON usare le tabelle del manuale di The Mist**:
  il 05/09 l'utente ha chiesto di usare le tabelle del manuale (fornito
  come zip di immagini delle pagine in `Desktop/regolazero/themist/`)
  per il generatore automatico. Guardate le pagine ("tab1/2/3.png"):
  sono tabelle di bottino/veleni/anelli magici con **meccaniche vere**
  (Toughness DR, danni, prezzi in gc, bonus numerici) — contenuto
  centrale del manuale a pagamento, non nomi/flavor. Anche tenendole su
  Firestore e pescandone una a caso per volta (mitigazione proposta
  dall'utente), resta contenuto meccanico del manuale reso pubblico e
  gratuito su un sito statico — dove chiunque può comunque leggere il
  codice sorgente. **Non implementato**: il generatore usa tabelle
  originali scritte per l'occasione (v. sopra), non materiale del
  manuale. Se l'utente rivuole insistere su questo punto, richiede una
  conferma esplicita e consapevole (non un "sì" generico) prima di
  procedere — resta comunque valida la regola di §7 sul non regalare
  contenuto del manuale.
- **Ottimizzazione mobile**: campi del modale con `font-size: 1rem`
  (≥16px, evita lo zoom automatico di iOS al focus), modale con
  `max-height: 90vh` e scroll interno, marker e testo dimensionati per
  il tocco.

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
- **Iscrizioni newsletter (Firestore, collezione `newsletter`)**: le
  email **non sono leggibili dal sito** per nessuno, visitatori inclusi
  (`allow read: if false`) — solo scrittura, validata (deve essere una
  stringa a forma di email, max 254 caratteri), mai modifica/
  cancellazione dal client. Per vedere la lista iscritti: console
  Firebase → Firestore Database → collezione `newsletter`. Regole
  complete:
  ```
  match /newsletter/{id} {
    allow read: if false;
    allow create: if request.resource.data.keys().hasOnly(['email','creato'])
      && request.resource.data.email is string
      && request.resource.data.email.matches('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')
      && request.resource.data.email.size() <= 254;
    allow update, delete: if false;
  }
  ```
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
