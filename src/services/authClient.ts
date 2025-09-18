import { MissingStrapiConfigError, getStrapiBaseUrl, strapiFetch } from './strapiClient.ts'

export type AuthUser = {
  id: number
  username: string
  email: string
  confirmed?: boolean
  blocked?: boolean
}

export type AuthSession = {
  jwt: string
  user: AuthUser
}

export type LoginCredentials = {
  identifier: string
  password: string
}

export type RegisterPayload = {
  username: string
  email: string
  password: string
}

const STORAGE_KEY = 'tasis-al-ilm.auth'
const REDIRECT_STORAGE_KEY = 'tasis-al-ilm.auth.redirect'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function loadStoredSession(): AuthSession | null {
  if (!isBrowser()) {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function persistSession(session: AuthSession) {
  if (!isBrowser()) {
    return session
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function clearStoredSession() {
  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const baseUrl = getStrapiBaseUrl()
  const response = await fetch(`${baseUrl}/api/auth/local`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    let message = 'Unable to sign in with the provided credentials.'

    try {
      const payload = (await response.json()) as { error?: { message?: string } }
      if (payload?.error?.message) {
        message = payload.error.message
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        message = 'Received an unexpected response from the authentication server.'
      }
    }

    throw new Error(message)
  }

  const session = (await response.json()) as AuthSession
  return persistSession(session)
}

export async function fetchAuthenticatedUser(token: string): Promise<AuthUser> {
  try {
    const user = await strapiFetch<AuthUser>('api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return user
  } catch (error) {
    if (error instanceof MissingStrapiConfigError) {
      throw error
    }

    throw new Error('Unable to fetch the signed-in user profile. Please sign in again.')
  }
}

export function logout() {
  clearStoredSession()
}

export async function register(payload: RegisterPayload): Promise<AuthSession> {
  const baseUrl = getStrapiBaseUrl()
  const response = await fetch(`${baseUrl}/api/auth/local/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    let message = 'We could not create your account. Please check your details and try again.'

    try {
      const payloadJson = (await response.json()) as { error?: { message?: string } }
      if (payloadJson?.error?.message) {
        message = payloadJson.error.message
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        message = 'Received an unexpected response from the authentication server.'
      }
    }

    throw new Error(message)
  }

  const session = (await response.json()) as AuthSession
  return persistSession(session)
}

export function storePostLoginRedirect(path: string) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(REDIRECT_STORAGE_KEY, path)
}

export function consumePostLoginRedirect() {
  if (!isBrowser()) {
    return null
  }

  const path = window.localStorage.getItem(REDIRECT_STORAGE_KEY)
  if (path) {
    window.localStorage.removeItem(REDIRECT_STORAGE_KEY)
  }

  return path
}

export function buildProviderAuthUrl(provider: string, redirectUrl: string, state?: string) {
  const baseUrl = getStrapiBaseUrl()
  const params = new URLSearchParams()

  if (redirectUrl) {
    params.set('redirect', redirectUrl)
    params.set('callback', redirectUrl)
  }

  if (state) {
    params.set('state', state)
  }

  const query = params.toString()
  return `${baseUrl}/api/connect/${provider}${query ? `?${query}` : ''}`
}

export function createSessionFromOAuthParams(params: URLSearchParams): AuthSession {
  const token = params.get('access_token') ?? params.get('jwt')
  const userParam = params.get('user')

  if (!token || !userParam) {
    throw new Error('Missing authentication data from the provider callback. Please try signing in again.')
  }

  let user: AuthUser
  try {
    user = JSON.parse(userParam) as AuthUser
  } catch (error) {
    console.error('Failed to parse user payload from provider callback', error)
    throw new Error('Received an invalid user payload from the provider callback.')
  }

  return { jwt: token, user }
}
