import type { CollectionEntry } from 'astro:content';
import type { Lingua } from './the-mist';

type MistEntry = CollectionEntry<'bestiario'> | CollectionEntry<'avventure'>;

/**
 * Le entry stanno in sottocartelle per lingua: `it/<slug>.md` / `en/<slug>.md`.
 * Il glob loader produce `id` tipo "it/spettro-della-nebbia". Qui filtriamo per
 * lingua e restituiamo lo slug base (senza il prefisso di lingua).
 *
 * Lingue separate: l'indice/dettaglio EN esiste SOLO se c'è il file in `en/`.
 * Nessun fallback silenzioso all'altra lingua (CLAUDE.md §7.3).
 */
export function vociPerLingua<E extends MistEntry>(
  entries: E[],
  lang: Lingua,
): { base: string; entry: E }[] {
  const out: { base: string; entry: E }[] = [];
  for (const entry of entries) {
    const m = entry.id.match(/^(it|en)\/(.+)$/);
    if (!m || m[1] !== lang) continue;
    out.push({ base: m[2], entry });
  }
  return out;
}
