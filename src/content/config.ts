import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* ========================================================================
   SITO MADRE RegolaZero (solo IT) — catalogo → gioco → {articoli,
   contenuti, generatori}. Vedi CLAUDE.md §6.1.
   ======================================================================== */

const linkEsterno = z.object({ label: z.string(), url: z.string().url() });

// Catalogo giochi: una entry per gioco.
const giochi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/giochi' }),
  schema: z.object({
    titolo: z.string(),
    sistema: z.string(), // es. "Mörk Borg (compatibile)"
    stato: z.enum(['in-sviluppo', 'pubblicato']).default('in-sviluppo'),
    anno: z.number().int(),
    copertina: z.string(),
    estratto: z.string(),
    microsito: z.string().nullable().default(null), // es. "/the-mist/"
    link_esterni: z.array(linkEsterno).default([]),
    ordine: z.number().int().default(0),
  }),
});

// Tipi di articolo (vocabolario controllato — Decap usa un select su questo).
// Confermare/estendere la lista con l'utente (CLAUDE.md §9.10).
export const TIPI_ARTICOLO = [
  'novità',
  'recensione',
  'tips',
  'guida',
  'diario di sviluppo',
  'intervista',
  'dietro le quinte',
  'errata',
] as const;

// Articoli tipo WP.
const articoli = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articoli' }),
  schema: z.object({
    titolo: z.string(),
    tipo: z.enum(TIPI_ARTICOLO).default('novità'), // recensione | tips | ...
    gioco: z.string().nullable().default(null), // slug di `giochi`, o null (articolo generico)
    data: z.coerce.date(),
    aggiornato: z.coerce.date().optional(),
    autore: z.string(),
    tag: z.array(z.string()).default([]),
    estratto: z.string(),
    copertina: z.string().optional(),
    bozza: z.boolean().default(false),
  }),
});

// Contenuti/risorse. `gioco` vuoto + `sistema` valorizzato => materiali per
// sistemi di altri autori (alimentano /materiali/).
const contenuti = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/contenuti' }),
  schema: z.object({
    titolo: z.string(),
    gioco: z.string().nullable().default(null),
    sistema: z.string().nullable().default(null),
    tipo: z.enum(['scheda', 'espansione', 'hack', 'download', 'riferimento']),
    file: z.string().nullable().default(null), // path in /public/downloads/…
    link_esterno: z.string().url().nullable().default(null),
    estratto: z.string(),
    bozza: z.boolean().default(false),
  }),
});

// Registro generatori: la LOGICA è un componente in src/components/generatori/.
const generatori = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/generatori' }),
  schema: z.object({
    titolo: z.string(),
    gioco: z.string().nullable().default(null),
    estratto: z.string(),
    componente: z.string(), // es. "GeneratoreVillaggio"
    dati: z.string().nullable().default(null), // path a un JSON in src/data/generatori/
  }),
});

/* ========================================================================
   MICROSITO The Mist — bilingue (<slug>.it.md / <slug>.en.md). §6.2.
   ======================================================================== */

const bestiario = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/the-mist/bestiario' }),
  schema: z.object({
    nome: z.string(),
    pf: z.number().int().optional(),
    morale: z.number().int().optional(),
    tratti: z.array(z.string()).default([]),
    fonte: z.string().optional(),
    immagine: z.string().optional(),
  }),
});

const avventure = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/the-mist/avventure' }),
  schema: z.object({
    titolo: z.string(),
    autore: z.string().default('RegolaZero'),
    giocatori: z.string().optional(),
    durata: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  giochi,
  articoli,
  contenuti,
  generatori,
  bestiario,
  avventure,
};
