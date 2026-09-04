/**
 * Interruttore "Coming soon" per l'intero sito (sia RegolaZero che il
 * microsito The Mist). Vedi CLAUDE.md §14 per i dettagli.
 *
 * Per SPEGNERE il gate quando il sito è pronto: mettere `COMING_SOON = false`
 * e ridistribuire (commit + push).
 */
export const COMING_SOON = true;

/** Parametro URL che, se presente col codice giusto, sblocca la navigazione. */
export const BYPASS_PARAM = 'anteprima';

/**
 * "Codice" di bypass. Non è un vero segreto (è nel codice sorgente pubblico
 * del sito): serve solo a evitare che qualcuno ci finisca per caso.
 * Cambialo quando vuoi, semplicemente editando questo file.
 */
export const BYPASS_CODE = 'nebbia-2026';

/** Chiave localStorage in cui si ricorda lo sblocco, valida su tutto il dominio. */
export const BYPASS_KEY = 'rz-bypass-coming-soon';

/**
 * URL base dell'API di Netlify Identity usata per il login vero (invito via
 * email, username/password) sul pulsante lucchetto della pagina coming-soon.
 * Es. "https://qualcosa.netlify.app/.netlify/identity" — vedi CLAUDE.md §15.
 * Vuoto finché non è stato creato il progetto Netlify Identity: il pulsante
 * resta presente ma non fa nulla di funzionale (nessun endpoint reale a cui
 * parlare).
 */
export const NETLIFY_IDENTITY_URL = 'https://regolazero.netlify.app/.netlify/identity';

/**
 * Registrazione APERTA a chiunque (Netlify Identity → Registration → Open),
 * ma vedere il sito mentre è in coming-soon richiede uno di questi ruoli,
 * assegnato A MANO dall'admin per ogni utente dal pannello Netlify Identity
 * (Identity → utente → Roles). Chi si registra senza ruolo resta "in lista
 * d'attesa" — è comunque nell'elenco utenti di Identity, che funge da
 * mailing list. Vedi CLAUDE.md §15.
 */
export const RUOLI_CHE_SBLOCCANO = ['preview', 'editor'];
