import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { UserManager, WebStorageStateStore, type User } from 'oidc-client-ts'

export type Organization = { id: string; name: string; slug: string; role: string }
export type UserProfile = { id: string; email: string; display_name: string; organizations: Organization[] }

type AuthValue = {
  ready: boolean
  configured: boolean
  user: User | null
  profile: UserProfile | null
  profileError: string | null
  organizationId: string | null
  signIn: (returnTo?: string) => Promise<void>
  signOut: () => Promise<void>
  apiFetch: <T>(path: string, init?: RequestInit) => Promise<T>
  refreshProfile: () => Promise<void>
}

const authority = import.meta.env.VITE_OIDC_AUTHORITY?.trim()
const clientId = import.meta.env.VITE_OIDC_CLIENT_ID?.trim()
const apiBase = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const configured = Boolean(authority && clientId)

const userManager = configured
  ? new UserManager({
      authority: authority ?? '',
      client_id: clientId ?? '',
      redirect_uri: `${window.location.origin}/auth/callback`,
      post_logout_redirect_uri: `${window.location.origin}/access`,
      response_type: 'code',
      scope: 'openid profile email',
      userStore: new WebStorageStateStore({ store: window.sessionStorage }),
      automaticSilentRenew: true,
      monitorSession: false,
      extraQueryParams: import.meta.env.VITE_OIDC_API_AUDIENCE
        ? { audience: import.meta.env.VITE_OIDC_API_AUDIENCE }
        : undefined,
    })
  : null

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const apiFetch = useCallback(
    async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
      if (!user?.access_token) throw new Error('Sign in before calling the REDOPS API.')
      const headers = new Headers(init.headers)
      headers.set('Authorization', `Bearer ${user.access_token}`)
      if (profile?.organizations[0]?.id && path !== '/v1/me') {
        headers.set('X-Organization-ID', profile.organizations[0].id)
      }
      if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
      const response = await fetch(`${apiBase}${path}`, { ...init, headers })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        const message = payload?.error?.message ?? `API request failed (${response.status}).`
        throw new Error(message)
      }
      return payload as T
    },
    [profile?.organizations, user?.access_token],
  )

  const refreshProfile = useCallback(async () => {
    if (!user?.access_token) {
      setProfile(null)
      setProfileError(null)
      return
    }
    try {
      const next = await apiFetch<UserProfile>('/v1/me')
      setProfile(next)
      setProfileError(null)
    } catch (error) {
      setProfile(null)
      setProfileError(error instanceof Error ? error.message : 'Unable to load your account.')
    }
  }, [apiFetch, user?.access_token])

  useEffect(() => {
    if (!userManager) {
      setReady(true)
      return
    }
    let active = true
    const handleLoaded = (next: User) => { if (active) setUser(next) }
    const handleUnloaded = () => { if (active) { setUser(null); setProfile(null) } }
    userManager.events.addUserLoaded(handleLoaded)
    userManager.events.addUserUnloaded(handleUnloaded)
    userManager.getUser()
      .then((current) => { if (active) setUser(current) })
      .catch((error: unknown) => { if (active) setProfileError(error instanceof Error ? error.message : 'Unable to restore sign-in.') })
      .finally(() => { if (active) setReady(true) })
    return () => {
      active = false
      userManager.events.removeUserLoaded(handleLoaded)
      userManager.events.removeUserUnloaded(handleUnloaded)
    }
  }, [])

  useEffect(() => { void refreshProfile() }, [refreshProfile])

  const signIn = useCallback(async (returnTo = '/app') => {
    if (!userManager) throw new Error('OIDC sign-in is not configured.')
    await userManager.signinRedirect({ state: returnTo })
  }, [])
  const signOut = useCallback(async () => {
    if (!userManager) return
    await userManager.signoutRedirect()
  }, [])

  const value = useMemo<AuthValue>(() => ({
    ready,
    configured,
    user,
    profile,
    profileError,
    organizationId: profile?.organizations[0]?.id ?? null,
    signIn,
    signOut,
    apiFetch,
    refreshProfile,
  }), [ready, user, profile, profileError, signIn, signOut, apiFetch, refreshProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider.')
  return value
}

export async function completeSignIn() {
  if (!userManager) throw new Error('OIDC sign-in is not configured.')
  return userManager.signinRedirectCallback()
}
