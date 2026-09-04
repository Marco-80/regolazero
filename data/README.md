# data/

Dati versionati in Git, non generati dalla build.

## `mailing-list.ndjson`

Iscrizioni alla mailing list di The Mist. **Una riga JSON per iscrizione**
(NDJSON), aggiunta in append dal Cloudflare Worker `workers/mailing-list/`
(vedi CLAUDE.md §7.5). Esempio di riga:

```json
{"email":"nome@esempio.it","lingua":"it","consenso":true,"ts":"2026-09-04T10:00:00.000Z","stato":"confermato"}
```

Campi:

| campo | note |
|---|---|
| `email` | in minuscolo, trim |
| `lingua` | `it` \| `en` — lingua della pagina di iscrizione |
| `consenso` | deve essere `true` (checkbox obbligatoria) |
| `ts` | ISO 8601, UTC |
| `stato` | `nuovo` → `confermato` (se si attiva il doppio opt-in) → `disiscritto` |

### Privacy

- Sono dati personali: serve una privacy policy e una base giuridica (consenso).
- Non committare **mai** questo file in un repo pubblico se contiene indirizzi
  reali. Opzioni: repo privato, oppure cifratura, oppure storage fuori dal repo
  (Cloudflare KV/D1). → decisione aperta CLAUDE.md §9.8.
- La disiscrizione deve essere sempre possibile (link in ogni email).
