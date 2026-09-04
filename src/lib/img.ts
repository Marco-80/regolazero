import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Vero se il path (es. "/images/giochi/x.jpg") esiste davvero sotto
 * public/. Usato per non mostrare icone di immagine rotta finché i
 * contenuti non hanno copertine reali (CLAUDE.md — nessuna finzione).
 */
export function copertinaEsiste(src?: string | null): boolean {
  if (!src) return false;
  try {
    const p = path.join(process.cwd(), 'public', src.replace(/^\/+/, ''));
    return existsSync(p);
  } catch {
    return false;
  }
}
