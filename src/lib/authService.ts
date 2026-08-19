/**
 * The authService client — mobile + OTP only.
 *
 * Two requests take a visitor from a blank field to a session:
 *
 *   POST /otp/send    { channel, value }   -> attemptId + two deadlines
 *   POST /otp/verify  { attemptId, code }  -> SIGNED_IN or REGISTERED, + cookie
 *
 * ── The envelope ───────────────────────────────────────────────────────────
 *
 * Every response has the same shape either way, and the server never sends
 * prose — it sends a message id, and the copy comes from the catalogue below.
 * So nothing here renders `error.code` at a reader: the code picks the
 * behaviour, the catalogue supplies the words.
 *
 * ── Deadlines are instants, not durations ──────────────────────────────────
 *
 * `expiresAt` and `resendAvailableAt` are absolute RFC 3339 timestamps, and
 * every countdown is computed from them rather than from a number handed over
 * at the start. A slow request would otherwise shift the deadline by however
 * long it took to arrive.
 */

/**
 * Where authService lives — a RELATIVE path, deliberately.
 *
 * Same-origin is not a preference here, it is the only arrangement that works.
 * The service runs on its own host, and reaching it directly fails three ways
 * at once: its CORS allowlist admits only https://thinq.co and its www form;
 * `tq_csrf` is set by that host, so `document.cookie` on any other origin
 * cannot read the token the client is required to echo; and the deployed site
 * is HTTPS while the service is plain HTTP, which a browser refuses as mixed
 * content. All three are measured, not assumed — see the proxy note in
 * vite.config.ts.
 *
 * A relative base sidesteps all of it: the browser talks only to the origin
 * serving the page, and something in front — the Vite proxy in development, a
 * Cloudflare route in production — forwards /api to authService.
 *
 * `VITE_AUTH_BASE_URL` still overrides it, for pointing at a service on
 * another host when that host's allowlist and cookies permit it.
 */
export const AUTH_BASE =
  import.meta.env.VITE_AUTH_BASE_URL ?? '/api/auth/v1'

/** The closed set of error codes. Branch on these, never on the HTTP status. */
export type AuthErrorCode =
  | 'VALIDATION_FAILED'
  | 'OTP_INVALID'
  | 'SESSION_TERMINATED'
  | 'ACCOUNT_LOCKED'
  | 'RESEND_COOLDOWN'
  | 'RESEND_LIMIT'
  | 'DISPATCH_CAP'
  | 'ATTEMPT_EXPIRED'
  | 'DUPLICATE_MOBILE'
  | 'UPSTREAM_UNAVAILABLE'
  | 'INTERNAL'
  /** Not from the server: the request never completed. */
  | 'NETWORK'

export interface ServerMessage {
  id: string
  params?: Record<string, string | number>
}

export interface SendOtpResult {
  attemptId: string
  /** e.g. "+91-XXXXXX0121" — show this rather than echoing what was typed. */
  maskedTo: string
  /** The code dies at this instant (~3 min). */
  expiresAt: string
  /** Resend is allowed from this instant (~30 s). */
  resendAvailableAt: string
}

export interface VerifyOtpResult {
  /**
   * Only these two are reachable in this version. NEXT and LINKED belong to
   * the email and contact flows, which this deployment does not run.
   */
  outcome: 'SIGNED_IN' | 'REGISTERED'
  scope: string
  /** Present on REGISTERED. */
  status?: string
}

export interface SessionResult {
  status: string
  scope: string
  /** Omitted when the number is unproved — guard before rendering. */
  maskedMobile?: string
  /** When the ACCOUNT was created, not this session. */
  joinedAt: string
  /** The 06:00 IST cut-off, when every session ends. */
  expiresAt: string
}

/**
 * A failure the server described.
 *
 * Carries everything the UI needs to decide what to do: the code to branch on,
 * the message id to look up, and the two fields that drive a countdown or an
 * attempts-remaining line.
 */
export class AuthError extends Error {
  readonly code: AuthErrorCode
  readonly messageId?: string
  readonly params?: Record<string, string | number>
  readonly attemptsRemaining?: number
  /** When the lock or cooldown lifts, as an absolute instant. */
  readonly retryExpiresAt?: string
  /**
   * Developer-facing explanation, never shown to a reader.
   *
   * Set when the failure is a misconfiguration rather than something the
   * server said — a base URL pointing at the wrong host, for instance. It goes
   * to the console so the cause is visible without a debugger.
   */
  readonly detail?: string

  constructor(init: {
    code: AuthErrorCode
    messageId?: string
    params?: Record<string, string | number>
    attemptsRemaining?: number
    retryExpiresAt?: string
    detail?: string
  }) {
    super(init.detail ?? init.code)
    this.name = 'AuthError'
    this.code = init.code
    this.messageId = init.messageId
    this.params = init.params
    this.attemptsRemaining = init.attemptsRemaining
    this.retryExpiresAt = init.retryExpiresAt
    this.detail = init.detail
    if (init.detail) console.error(`[authService] ${init.detail}`)
  }
}

/**
 * The double-submit CSRF token.
 *
 * `tq_csrf` is deliberately readable by script; `tq_sess` is HttpOnly and
 * travels on its own. A fresh browser is given the token by its first GET, and
 * the catalogue and config reads below happen on boot, so by the time any POST
 * is possible it exists.
 */
function readCsrfToken(): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie.match(/(?:^|;\s*)tq_csrf=([^;]+)/)?.[1]
}

/**
 * Guarantees the CSRF cookie exists before a write.
 */
async function ensureCsrfToken(): Promise<void> {
  if (readCsrfToken()) return
  await loadCatalogue()
}

interface Envelope<T> {
  ok: boolean
  data?: T
  message?: ServerMessage
  error?: {
    code: AuthErrorCode
    message?: ServerMessage
    attemptsRemaining?: number
    retry?: { expiresAt?: string }
  }
}

/** Fallback mock generator when no backend server is running locally */
function handleMockRequest<T>(path: string, body?: unknown): T {
  const now = Date.now()
  if (path === '/otp/send') {
    const b = body as { value?: string }
    const phone = b?.value ?? ''
    const cleanDigits = phone.replace(/^\+?91/, '').replace(/\D/g, '')
    const masked = `+91-${cleanDigits}`
    return {
      attemptId: 'mock-attempt-' + Math.random().toString(36).substring(2, 9),
      maskedTo: masked,
      expiresAt: new Date(now + 180000).toISOString(),
      resendAvailableAt: new Date(now + 30000).toISOString(),
    } as T
  }

  if (path === '/otp/verify') {
    return {
      outcome: 'REGISTERED',
      scope: 'WAITLIST',
    } as T
  }

  if (path === '/messages/catalogue') {
    return {
      version: '1.0',
      locale: 'en-IN',
      messages: {},
    } as T
  }

  if (path === '/config') {
    return { contacts: 'MOBILE' } as T
  }

  throw new AuthError({ code: 'NETWORK' })
}

async function request<T>(
  path: string,
  init: { method?: 'GET' | 'POST'; body?: unknown; idempotencyKey?: string } = {},
): Promise<T> {
  const method = init.method ?? 'GET'
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (method === 'POST') {
    await ensureCsrfToken()
    const csrf = readCsrfToken()
    /*
     * REFUSED HERE, not at the server.
     *
     * This used to be `if (csrf)`, which silently omitted the header when the
     * token could not be read. The write then failed at authService with
     * VALIDATION_FAILED and no message id, which the reader sees as nothing at
     * all — and the cause is not in the request that failed, it is in the base
     * URL used to make it.
     *
     * `tq_csrf` is host-only, so `document.cookie` can only see it when the API
     * answers on the origin serving this page. An absolute AUTH_BASE pointing at
     * another host makes the token permanently invisible and every POST
     * permanently refused. Naming that here costs one branch and turns a
     * server-side mystery into a console line that says which setting is wrong.
     */
    if (!csrf) {
      throw new AuthError({
        code: 'INTERNAL',
        detail:
          `tq_csrf is unreadable from this origin, so X-Tq-Csrf cannot be sent. ` +
          `AUTH_BASE is "${AUTH_BASE}" — the cookie is host-only, so authService has to ` +
          `answer on the origin serving this page. In production that means leaving ` +
          `VITE_AUTH_BASE_URL unset so the relative default is used.`,
      })
    }
    headers['X-Tq-Csrf'] = csrf
    if (init.idempotencyKey) headers['Idempotency-Key'] = init.idempotencyKey
  }

  try {
    const response = await fetch(`${AUTH_BASE}${path}`, {
      method,
      credentials: 'include',
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    })

    if (response.status === 204) return undefined as T

    /*
     * Refuse anything that is not JSON, and be specific about why.
     *
     * The likeliest cause is a base URL aimed at something that is not
     * authService — most often this very site, whose Worker answers every
     * unmatched path with index.html and a 200. Handing that to `json()`
     * fails with a syntax error about an unexpected "<", which says nothing
     * about the real mistake. Measured against thinq.co: /api/auth/v1/config
     * returns 200 text/html, so this is the failure a misconfigured base URL
     * actually produces.
     */
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('json')) {
      throw new AuthError({
        code: 'INTERNAL',
        detail: `${AUTH_BASE}${path} answered ${response.status} ${contentType || 'with no content type'} rather than JSON — check VITE_AUTH_BASE_URL points at authService.`,
      })
    }

    let envelope: Envelope<T>
    try {
      envelope = (await response.json()) as Envelope<T>
    } catch {
      throw new AuthError({ code: response.ok ? 'INTERNAL' : 'UPSTREAM_UNAVAILABLE' })
    }

    if (!envelope.ok) {
      throw new AuthError({
        code: envelope.error?.code ?? 'INTERNAL',
        messageId: envelope.error?.message?.id,
        params: envelope.error?.message?.params,
        attemptsRemaining: envelope.error?.attemptsRemaining,
        retryExpiresAt: envelope.error?.retry?.expiresAt,
      })
    }

    return envelope.data as T
  } catch (err) {
    if (err instanceof AuthError && err.code !== 'NETWORK') {
      throw err
    }
    /*
     * THE MOCK IS A DEVELOPMENT AFFORDANCE AND MUST NOT REACH A BUILD.
     *
     * Everything below answers an unreachable service with an invented success:
     * /otp/send returns a mock attempt id, /otp/verify returns REGISTERED. In
     * development, against no backend, that is the point. In production it means
     * a visitor whose request never arrived — CORS refusal, DNS failure, origin
     * down — is told they have joined the waitlist. No code was sent, no account
     * exists, and nothing anywhere records that it happened.
     *
     * import.meta.env.DEV is true under `vite dev` and false in every build, so
     * the branch is also removed from the bundle rather than merely skipped.
     */
    if (!import.meta.env.DEV) {
      throw err instanceof AuthError
        ? err
        : new AuthError({
            code: 'NETWORK',
            detail: `${AUTH_BASE}${path} could not be reached.`,
          })
    }
    return handleMockRequest<T>(path, init.body)
  }
}

/**
 * Starts a journey, or resends a code to an existing one.
 */
export function sendOtp(args: {
  value: string
  attemptId?: string
  idempotencyKey?: string
}): Promise<SendOtpResult> {
  return request<SendOtpResult>('/otp/send', {
    method: 'POST',
    body: {
      channel: 'MOBILE',
      value: args.value,
      ...(args.attemptId ? { attemptId: args.attemptId } : {}),
    },
    idempotencyKey: args.idempotencyKey,
  })
}

/** Verifies a code. Sets `tq_sess` on success, whichever outcome comes back. */
export function verifyOtp(args: {
  attemptId: string
  code: string
}): Promise<VerifyOtpResult> {
  return request<VerifyOtpResult>('/otp/verify', { method: 'POST', body: args })
}

/**
 * Who the reader is.
 */
export function getSession(): Promise<SessionResult> {
  return request<SessionResult>('/session')
}

/** Ends every session for the account, on every device. */
export function signOut(): Promise<void> {
  return request<void>('/session/signout', { method: 'POST' })
}

// ───────────────────────────── message catalogue ──────────────────────────

interface Catalogue {
  version: string
  locale: string
  messages: Record<string, { type?: string; placement?: string; template: string }>
  labels?: Record<string, string>
}

let cataloguePromise: Promise<Catalogue | null> | null = null

/**
 * Fetches the copy catalogue once per page load.
 */
export function loadCatalogue(): Promise<Catalogue | null> {
  cataloguePromise ??= fetchCatalogue().catch(() => null)
  return cataloguePromise
}

/**
 * Reads the catalogue, which is NOT an envelope.
 *
 * Every other JSON route answers `{ ok, data, message }`. This one returns the
 * catalogue object bare — `{ version, locale, messages, labels }` — with no
 * wrapper at all, exactly as the integration note shows it.
 *
 * Putting it through the envelope reader was silently fatal: `ok` was
 * undefined, so the reader treated a perfectly good response as a failure,
 * threw, and the `.catch` above turned that into `null`. The catalogue was
 * therefore never loaded, and every server message the UI showed fell back to
 * generic copy while the real strings sat one parse away. Nothing surfaced,
 * because a missing catalogue is designed to be survivable.
 *
 * Measured against the live service: the response's top-level keys are
 * version, locale, messages, labels — and messages['REG-M01'] is
 * "Enter a valid 10-digit mobile number."
 */
async function fetchCatalogue(): Promise<Catalogue> {
  const response = await fetch(`${AUTH_BASE}/messages/catalogue`, {
    // Still credentialed: this GET is also what mints `tq_csrf` for the first
    // POST, so it has to be allowed to set cookies.
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new AuthError({ code: 'INTERNAL' })
  return (await response.json()) as Catalogue
}

/**
 * Renders a server message id into copy.
 */
export function renderMessage(
  catalogue: Catalogue | null,
  message: { id?: string; params?: Record<string, string | number> } | undefined,
  fallback: string,
  /**
   * Values the client supplies rather than the server.
   *
   * `countdown` is the reason this exists. Several templates ask for it —
   * "Try again in {countdown}", "Expires in {countdown}" — and no response ever
   * carries it, because the contract sends deadlines as absolute instants and
   * never as durations. A duration would be wrong the moment it was written:
   * stale by however long the response spent in flight. So the server sends
   * `retry.expiresAt` and the seconds remaining are the caller's to compute,
   * which also lets the number tick while the message is on screen.
   *
   * Without this the placeholder leaked to the reader verbatim, as
   * "Try again in {countdown}".
   */
  extraParams?: Record<string, string | number>,
): string {
  const template = message?.id ? catalogue?.messages?.[message.id]?.template : undefined
  if (!template) return fallback
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => {
    const value = message?.params?.[key] ?? extraParams?.[key]
    return value === undefined ? whole : String(value)
  })
}

/**
 * Seconds as words a reader can act on.
 *
 * Minutes appear once there are any, because "Try again in 847s" asks someone
 * to do arithmetic to find out whether it is worth waiting.
 */
export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return 'a moment'
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}s`
  if (seconds === 0) return `${minutes}m`
  return `${minutes}m ${seconds}s`
}

/** Which contact channels this deployment accepts. Currently always MOBILE. */
export function getConfig(): Promise<{ contacts: string }> {
  return request<{ contacts: string }>('/config')
}
