// Cloudflare Worker entry point.
//
// Cloudflare has retired Pages for new projects, so the app deploys as a Worker
// with static assets. This script does two things:
//
//   1. Answers /api/lake-level, which exists because its upstream source
//      refuses cross-origin browser reads.
//   2. Hands everything else to the static asset binding, which serves the
//      built site out of dist/.
//
// The handlers are thin — the real work lives in shared/, which the Netlify
// functions and the Vite dev server also use, so no logic is duplicated.

import { fetchLakeLevel } from '../shared/usace.mjs';

const json = (body, status = 200, maxAge = 0) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    ...(maxAge ? { 'cache-control': `public, max-age=${maxAge}` } : {}),
  },
});

async function handleLakeLevel() {
  try {
    // Gage readings are hourly; no point hammering a government server.
    return json({ level: await fetchLakeLevel() }, 200, 900);
  } catch (err) {
    return json({ error: err.message }, 502);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/lake-level') return handleLakeLevel();

    return env.ASSETS.fetch(request);
  },
};
