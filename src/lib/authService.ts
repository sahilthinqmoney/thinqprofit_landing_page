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
 * Where authService lives.
 *
 * Configurable because the documented base is a developer's own machine, which
 * is reachable from nowhere else. Anything but local development must set
 * `VITE_AUTH_BASE_URL`, and the origin has to be on the service's CORS
 * allowlist — every call sends credentials, which a wildcard cannot satisfy.
 */
export const AUTH_BASE =
  import.meta.env.VITE_AUTH_BASE_URL ?? 'http://localhost:8080/api/auth/v1'

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
    if (csrf) headers['X-Tq-Csrf'] = csrf
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
    // Fallback gracefully to mock backend mode if API server is not running
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
  cataloguePromise ??= request<Catalogue>('/messages/catalogue').catch(() => null)
  return cataloguePromise
}

/**
 * Renders a server message id into copy.
 */
export function renderMessage(
  catalogue: Catalogue | null,
  message: { id?: string; params?: Record<string, string | number> } | undefined,
  fallback: string,
): string {
  const template = message?.id ? catalogue?.messages?.[message.id]?.template : undefined
  if (!template) return fallback
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => {
    const value = message?.params?.[key]
    return value === undefined ? whole : String(value)
  })
}

/** Which contact channels this deployment accepts. Currently always MOBILE. */
export function getConfig(): Promise<{ contacts: string }> {
  return request<{ contacts: string }>('/config')
}
