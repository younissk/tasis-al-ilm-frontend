import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import {
  fetchAuthenticatedUser,
  loadStoredSession,
  login,
  logout as clearSession,
  persistSession,
  register,
} from '../services/authClient.ts'
import type { AuthSession, AuthUser, LoginCredentials, RegisterPayload } from '../services/authClient.ts'
import { MissingStrapiConfigError } from '../services/strapiClient.ts'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  status: AuthStatus
  isAuthenticated: boolean
  signIn: (credentials: LoginCredentials) => Promise<AuthSession>
  signUp: (payload: RegisterPayload) => Promise<AuthSession>
  signOut: () => void
  completeAuthentication: (session: AuthSession) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    const stored = loadStoredSession()
    if (!stored) {
      setStatus('unauthenticated')
      return
    }

    setSession(stored)

    void fetchAuthenticatedUser(stored.jwt)
      .then((user) => {
        setSession({ jwt: stored.jwt, user })
        setStatus('authenticated')
      })
      .catch((error) => {
        console.warn('Failed to restore Strapi session', error)
        clearSession()
        setSession(null)
        setStatus('unauthenticated')
      })
  }, [])

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    setStatus('loading')
    try {
      const newSession = await login(credentials)
      setSession(newSession)
      setStatus('authenticated')
      return newSession
    } catch (error) {
      setStatus('unauthenticated')
      if (error instanceof MissingStrapiConfigError) {
        throw error
      }

      throw error instanceof Error ? error : new Error('Unable to sign in. Please try again.')
    }
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setSession(null)
    setStatus('unauthenticated')
  }, [])

  const signUp = useCallback(async (payload: RegisterPayload) => {
    setStatus('loading')
    try {
      const newSession = await register(payload)
      setSession(newSession)
      setStatus('authenticated')
      return newSession
    } catch (error) {
      setStatus('unauthenticated')
      if (error instanceof MissingStrapiConfigError) {
        throw error
      }

      throw error instanceof Error ? error : new Error('Unable to create your account. Please try again.')
    }
  }, [])

  const completeAuthentication = useCallback((newSession: AuthSession) => {
    persistSession(newSession)
    setSession(newSession)
    setStatus('authenticated')
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const token = session?.jwt ?? null
    return {
      user: session?.user ?? null,
      token,
      status,
      isAuthenticated: status === 'authenticated' && Boolean(token),
      signIn,
      signUp,
      signOut,
      completeAuthentication,
    }
  }, [session, signIn, signOut, status, signUp, completeAuthentication])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
