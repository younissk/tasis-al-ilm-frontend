function normalizeStrapiUrl(url: string | undefined) {
  if (!url) {
    return url
  }

  const trimmed = url.replace(/\/$/, '')

  if (trimmed.endsWith('/admin')) {
    return trimmed.slice(0, -'/admin'.length)
  }

  return trimmed
}

const STRAPI_URL = normalizeStrapiUrl(import.meta.env.VITE_STRAPI_URL)
const STRAPI_API_KEY = import.meta.env.VITE_STRAPI_API_KEY

export class MissingStrapiConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MissingStrapiConfigError'
  }
}

export class StrapiRequestError extends Error {
  status: number
  details?: unknown

  constructor(status: number, message: string, details?: unknown) {
    super(message)
    this.name = 'StrapiRequestError'
    this.status = status
    this.details = details
  }
}

export function getStrapiBaseUrl() {
  if (!STRAPI_URL) {
    throw new MissingStrapiConfigError('VITE_STRAPI_URL is not set. Add it to your .env file to enable Strapi requests.')
  }

  return STRAPI_URL
}

export async function strapiFetch<TResponse>(endpoint: string, init?: RequestInit): Promise<TResponse> {
  if (!STRAPI_URL) {
    throw new MissingStrapiConfigError('VITE_STRAPI_URL is not set. Add it to your .env file to enable Strapi requests.')
  }

  const sanitizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  const url = `${STRAPI_URL}/${sanitizedEndpoint}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_API_KEY ? { Authorization: `Bearer ${STRAPI_API_KEY}` } : {}),
    ...init?.headers,
  }

  const response = await fetch(url, { ...init, headers })

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? ''
    const rawBody = await response.text()
    let message = response.statusText || `Strapi request failed with status ${response.status}`
    let details: unknown = rawBody

    if (rawBody) {
      if (contentType.includes('application/json')) {
        try {
          const parsed = JSON.parse(rawBody) as { error?: { message?: string } }
          details = parsed
          const parsedMessage = parsed?.error?.message ?? (parsed as { message?: string })?.message
          if (parsedMessage) {
            message = parsedMessage
          }
        } catch (error) {
          console.warn('Failed to parse Strapi error payload as JSON', error)
          message = rawBody
        }
      } else {
        message = rawBody
      }
    }

    throw new StrapiRequestError(response.status, message, details)
  }

  return (await response.json()) as TResponse
}
