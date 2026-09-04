/**
 * i18n del microsito The Mist.
 *
 * Approccio: LINGUE SEPARATE con URL distinti (CLAUDE.md §7.3).
 *   IT (default) -> /the-mist/...        renderizza SOLO italiano
 *   EN           -> /the-mist/en/...     renderizza SOLO inglese
 *
 * Ogni pagina contiene una sola lingua. Il selettore a bandierina è un link
 * alla pagina gemella nell'altra lingua.
 */
export const LINGUE = ['it', 'en'] as const;
export type Lingua = (typeof LINGUE)[number];
export const LINGUA_DEFAULT: Lingua = 'it';

/** Prefisso URL per lingua ('' per il default). */
export function prefissoLingua(lang: Lingua): string {
  return lang === 'en' ? '/en' : '';
}

/** URL di una pagina del microsito nella lingua data. `sub` senza slash iniziale. */
export function urlMist(lang: Lingua, sub = ''): string {
  const p = sub ? `/${sub.replace(/^\/+/, '')}` : '/';
  return `/the-mist${prefissoLingua(lang)}${p}`;
}

/** Data una pathname dentro il microsito, restituisce la gemella nell'altra lingua. */
export function altMistPath(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/the-mist') return '/the-mist/en/';
  if (clean === '/the-mist/en') return '/the-mist/';
  if (clean.startsWith('/the-mist/en/')) {
    return clean.replace('/the-mist/en/', '/the-mist/') + '/';
  }
  return clean.replace('/the-mist/', '/the-mist/en/') + '/';
}

export function altraLingua(lang: Lingua): Lingua {
  return lang === 'en' ? 'it' : 'en';
}

export const NOME_LINGUA: Record<Lingua, string> = { it: 'Italiano', en: 'English' };
export const BANDIERA: Record<Lingua, string> = { it: '🇮🇹', en: '🇬🇧' };

/** Stringhe UI brevi. I contenuti lunghi stanno nei file .it.md / .en.md. */
export const t = {
  it: {
    ritornoSitoMadre: 'un progetto RegolaZero ↩',
    lingua: 'Lingua',
    intro:
      'Il Braenmore è muto. La Nebbia ha preso le strade, i volti, i nomi. Chi ancora cammina lo fa a memoria, con un Lumen che non basta mai.',
    // descrizione del gioco (home) — TESTI PROVVISORI, definitivi in Fase 3
    descrTitolo: 'Il gioco',
    // Traduzione IT del testo di presentazione originale (manuale, p. 4).
    descr1:
      'Borg in The Mist avvolge un mondo cupo e marcio, dove l’epica si mescola a toni gotici. Uomini disperati, cavalieri in cerca di redenzione, predicatori folli e senza paura, musicisti all’inseguimento di speranze perdute vagano per le sue terre. Creature silenziose e infide, fantasmi e demoni risvegliati da antiche maledizioni si nascondono nell’ombra.',
    descr2:
      'Castelli abbandonati, rovine dimenticate, terre desolate e misteri irrisolti attendono chi avrà il coraggio di affrontare la Nebbia.',
    pilastriTitolo: 'In breve',
    pilastri: [
      'Compatibile Mörk Borg: se conosci quello, sai già giocare.',
      'Esplorazione esagono per esagono di una terra che cambia con la Nebbia.',
      'Generatori e tabelle per creare villaggi, rovine e incontri al volo.',
      'One-shot e campagne brevi: la posta è la sopravvivenza, non la gloria.',
    ],
    sezioni: 'Sezioni',
    mappa: 'La mappa del Braenmore',
    mappaTesto: 'Percorri le terre soffocate dalla Nebbia.',
    generatori: 'Generatori',
    generatoriTesto: 'Villaggi, rovine e presenze, tirati sul momento.',
    bestiario: 'Bestiario',
    bestiarioTesto: 'Ciò che si muove quando la luce cala.',
    avventure: 'Avventure',
    avventureTesto: 'Storie pronte da portare al tavolo.',
    download: 'Download',
    downloadTesto: 'Schede, PDF e materiali stampabili.',
    mailingList: 'Mailing list',
    mailingListTesto: 'Ricevi gli aggiornamenti su The Mist.',
    segnaposto: 'Segnaposto.',
    mappaInArrivo: 'La mappa interattiva arriva in Fase 5 (CLAUDE.md §12).',
    generatoriInArrivo: 'I generatori casuali arrivano in Fase 4 (CLAUDE.md §12).',
    downloadInArrivo: 'PDF, schede e materiali stampabili in arrivo.',
    genVillaggio: 'Generatore di villaggio',
    genRovine: 'Generatore di rovine — "Vecchi Ricordi"',
    genSpettro: "Spettro della Nebbia — l'emozione del luogo",
    nessunaScheda: 'Nessuna scheda ancora. Migrazione in Fase 3.',
    nessunaAvventura: 'Nessuna avventura ancora. Migrazione in Fase 3.',
    tornaBestiario: '← Bestiario',
    tornaAvventure: '← Avventure',
    di: 'di',
    giocatori: 'giocatori',
    fonte: 'Fonte',
    // mailing list
    mlTitolo: 'Iscriviti alla mailing list',
    mlIntro:
      'Un messaggio quando esce qualcosa di nuovo su The Mist: nuove avventure, materiali, aggiornamenti. Niente spam, disiscrizione con un clic.',
    mlEmailLabel: 'La tua email',
    mlEmailPlaceholder: 'nome@esempio.it',
    mlSubmit: 'Iscrivimi',
    mlConsenso:
      'Acconsento a ricevere email da RegolaZero su The Mist. Posso disiscrivermi in qualsiasi momento.',
    mlOk: 'Fatto. Controlla la posta per confermare (se richiesto).',
    mlErrore: 'Qualcosa non ha funzionato. Riprova più tardi.',
    mlEmailNonValida: 'Inserisci un indirizzo email valido.',
    mlNonConfigurato: 'Iscrizione non ancora attiva. Torna a trovarci presto.',
    mlInvio: 'Invio…',
  },
  en: {
    ritornoSitoMadre: 'a RegolaZero project ↩',
    lingua: 'Language',
    intro:
      'The Braenmore is silent. The Mist has taken the roads, the faces, the names. Those still walking do it from memory, with a Lumen that is never enough.',
    descrTitolo: 'The game',
    // Original blurb from the manual (p. 4), verbatim.
    descr1:
      'Borg in The Mist shrouds a dark, rotten world, where epics mingle with gothic tones. Desperate men, cavaliers seeking redemption, fearless mad preachers, musicians chasing lost hopes wander its lands. Silent, treacherous creatures, ghosts and demons awakened by ancient curses lurk in the shadows.',
    descr2:
      'Abandoned castles, forgotten ruins, desolate lands and unsolved mysteries await those daring enough to face The Mist.',
    pilastriTitolo: 'At a glance',
    pilastri: [
      'Mörk Borg compatible: if you know that, you already know how to play.',
      'Hex-by-hex exploration of a land that shifts with the Mist.',
      'Generators and tables to build villages, ruins and encounters on the fly.',
      'One-shots and short campaigns: the stake is survival, not glory.',
    ],
    sezioni: 'Sections',
    mappa: 'Map of the Braenmore',
    mappaTesto: 'Cross the lands smothered by the Mist.',
    generatori: 'Generators',
    generatoriTesto: 'Villages, ruins and presences, rolled on the spot.',
    bestiario: 'Bestiary',
    bestiarioTesto: 'What moves when the light fails.',
    avventure: 'Adventures',
    avventureTesto: 'Stories ready for the table.',
    download: 'Downloads',
    downloadTesto: 'Sheets, PDFs and printable material.',
    mailingList: 'Mailing list',
    mailingListTesto: 'Get updates about The Mist.',
    segnaposto: 'Placeholder.',
    mappaInArrivo: 'The interactive map lands in Phase 5 (CLAUDE.md §12).',
    generatoriInArrivo: 'The random generators land in Phase 4 (CLAUDE.md §12).',
    downloadInArrivo: 'PDFs, sheets and printable material coming soon.',
    genVillaggio: 'Village generator',
    genRovine: 'Ruins generator — "Old Memories"',
    genSpettro: 'Spectre of the Mist — the mood of the place',
    nessunaScheda: 'No entries yet. Migration in Phase 3.',
    nessunaAvventura: 'No adventures yet. Migration in Phase 3.',
    tornaBestiario: '← Bestiary',
    tornaAvventure: '← Adventures',
    di: 'by',
    giocatori: 'players',
    fonte: 'Source',
    mlTitolo: 'Join the mailing list',
    mlIntro:
      'One message when something new lands for The Mist: new adventures, material, updates. No spam, one-click unsubscribe.',
    mlEmailLabel: 'Your email',
    mlEmailPlaceholder: 'name@example.com',
    mlSubmit: 'Sign me up',
    mlConsenso:
      'I agree to receive emails from RegolaZero about The Mist. I can unsubscribe at any time.',
    mlOk: 'Done. Check your inbox to confirm (if required).',
    mlErrore: 'Something went wrong. Please try again later.',
    mlEmailNonValida: 'Please enter a valid email address.',
    mlNonConfigurato: 'Sign-up is not active yet. Check back soon.',
    mlInvio: 'Sending…',
  },
} as const;

export type ChiaveUI = keyof (typeof t)['it'];
