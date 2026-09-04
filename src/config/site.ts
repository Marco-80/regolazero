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
