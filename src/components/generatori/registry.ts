/**
 * Registro dei componenti generatore. La entry `.md` in src/content/generatori/
 * indica `componente: "GeneratoreVillaggio"`; qui si mappa la stringa al
 * componente Astro reale. Aggiungere una riga per ogni nuovo generatore.
 */
import GeneratoreVillaggio from './GeneratoreVillaggio.astro';

export const GENERATORI: Record<string, unknown> = {
  GeneratoreVillaggio,
};
