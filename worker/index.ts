/**
 * Gate the whole site behind HTTP Basic Auth.
 *
 * The site is otherwise a pure static-asset Worker; this script sits in front
 * of the asset server (see `run_worker_first` in wrangler.jsonc) and passes the
 * request to ASSETS only once the browser has sent valid credentials.
 */

interface Env {
  ASSETS: Fetcher;
  AUTH_USER: string;
  AUTH_PASS: string;
}

const encoder = new TextEncoder();

/** Built per call: one shared Response would re-serve an already-read body. */
function unauthorized(): Response {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="thinq.co", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}

/** Compare without leaking length or match position through timing. */
function safeEqual(a: string, b: string): boolean {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.byteLength !== right.byteLength) return false;
  return crypto.subtle.timingSafeEqual(left, right);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Deploying the script before the secrets exist must not open the site up:
    // an unset binding would otherwise compare against the string "undefined".
    if (!env.AUTH_USER || !env.AUTH_PASS) {
      return new Response('Not configured', {
        status: 503,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const header = request.headers.get('Authorization');
    if (!header?.startsWith('Basic ')) return unauthorized();

    let decoded: string;
    try {
      decoded = atob(header.slice('Basic '.length));
    } catch {
      return unauthorized();
    }

    // Only the first colon separates the pair; passwords may contain colons.
    const colon = decoded.indexOf(':');
    if (colon === -1) return unauthorized();

    // Both comparisons always run, so a wrong username costs the same as a
    // wrong password.
    const userOk = safeEqual(decoded.slice(0, colon), env.AUTH_USER);
    const passOk = safeEqual(decoded.slice(colon + 1), env.AUTH_PASS);
    if (!userOk || !passOk) return unauthorized();

    // No noindex header here: nothing behind this wall reaches a crawler, and
    // index.html already carries its own robots meta tag.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
