import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

/** Un articolo è pubblicato se non è bozza (le bozze non entrano in build in prod). */
export function isPubblicato(a: CollectionEntry<'articoli'>): boolean {
  if (a.data.bozza) return false;
  return true;
}

/** URL canonico di un articolo: sotto il gioco se ne ha uno, altrimenti /articoli/. */
export function hrefArticolo(a: CollectionEntry<'articoli'>): string {
  return a.data.gioco
    ? `/giochi/${a.data.gioco}/articoli/${a.id}/`
    : `/articoli/${a.id}/`;
}

/** Tutti gli articoli pubblicati, dal più recente. */
export async function articoliPubblicati(): Promise<CollectionEntry<'articoli'>[]> {
  const all = await getCollection('articoli', isPubblicato);
  return all.sort((x, y) => y.data.data.getTime() - x.data.data.getTime());
}

export function isPubblicatoContenuto(c: CollectionEntry<'contenuti'>): boolean {
  return !c.data.bozza;
}
