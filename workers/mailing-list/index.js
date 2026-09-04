/**
 * Cloudflare Worker — endpoint iscrizione mailing list The Mist.
 *
 * STUB DI RIFERIMENTO (CLAUDE.md §7.5). Da rivedere/testare prima del deploy;
 * l'approccio esatto (commit sul repo vs KV/D1) è deciso in §9.8.
 *
 * Flusso "commit sul repo":
 *   POST { email, lingua, consenso, ts }
 *     -> valida (email, consenso, honeypot lato pagina, origine)
 *     -> legge data/mailing-list.ndjson via GitHub Contents API
 *     -> append di una riga NDJSON
 *     -> PUT del file (un commit per iscrizione)
 *
 * Secret richiesti (wrangler secret put ...):
 *   GITHUB_TOKEN   PAT fine-grained, solo "Contents: read/write" su questo repo
 *   ALLOW_ORIGIN   es. https://regolazero.it
 * Vars (wrangler.toml):
 *   REPO           "ORG/REPO"
 *   BRANCH         "main"
 *   FILE_PATH      "data/mailing-list.ndjson"
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'bad_json' }, 400, cors);
    }

    const email = String(body.email || '').trim().toLowerCase();
    const lingua = body.lingua === 'en' ? 'en' : 'it';
    if (!EMAIL_RE.test(email)) return json({ error: 'bad_email' }, 422, cors);
    if (body.consenso !== true) return json({ error: 'no_consent' }, 422, cors);

    const riga =
      JSON.stringify({
        email,
        lingua,
        consenso: true,
        ts: typeof body.ts === 'string' ? body.ts : new Date().toISOString(),
        stato: 'nuovo',
      }) + '\n';

    try {
      await appendToRepoFile(env, riga);
    } catch (err) {
      return json({ error: 'storage', detail: String(err) }, 502, cors);
    }

    // TODO (§7.5): invio email di conferma (doppio opt-in) via MailChannels.
    return json({ ok: true }, 200, cors);
  },
};

function json(obj, status, extra) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });
}

async function appendToRepoFile(env, riga) {
  const api = `https://api.github.com/repos/${env.REPO}/contents/${env.FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'regolazero-mailing-list-worker',
  };

  const getRes = await fetch(`${api}?ref=${env.BRANCH}`, { headers });
  let sha;
  let contenuto = '';
  if (getRes.status === 200) {
    const j = await getRes.json();
    sha = j.sha;
    contenuto = atob(j.content.replace(/\n/g, ''));
  } else if (getRes.status !== 404) {
    throw new Error(`GET ${getRes.status}`);
  }

  const nuovo = btoa(unescape(encodeURIComponent(contenuto + riga)));
  const putRes = await fetch(api, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'mailing-list: nuova iscrizione',
      content: nuovo,
      sha,
      branch: env.BRANCH,
    }),
  });
  if (!putRes.ok) throw new Error(`PUT ${putRes.status}`);
}
