import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Field, inputCls } from '@/components/ui'
import { Logo } from '@/components/ui/Icon'
import { EASE_OUT } from '@/lib/motion'
import { useAuth } from '@/lib/auth'

export default function Access() {
  const [sp] = useSearchParams()
  const location = useLocation()
  const nav = useNavigate()
  const { configured, user, profile, signIn } = useAuth()
  const request = sp.get('step') === 'request'
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && profile && !request) nav('/app', { replace: true })
  }, [nav, profile, request, user])

  const beginSignIn = async () => {
    setError('')
    try {
      const returnTo = (location.state as { from?: string } | null)?.from ?? '/app'
      await signIn(returnTo)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to start sign-in.')
    }
  }

  if (user && profile && !request) return <Navigate to="/app" replace />

  return (
    <div className="min-h-screen grid md:grid-cols-[1fr_minmax(420px,520px)]">
      <div className="hidden md:flex flex-col justify-between p-12 hair-b border-r border-line">
        <Link to="/" className="flex items-center gap-3 display text-[24px] tracking-[0.04em]"><Logo size={20} />REDOPS</Link>
        <h1 className="display text-[clamp(56px,7vw,112px)] max-w-[9ch]">Access is a<br /><span className="italic text-bone/60">ceremony.</span></h1>
        <p className="label">Every session is recorded in the audit log</p>
      </div>
      <main className="flex items-center px-8 md:px-14 py-16">
        <AnimatePresence mode="wait">
          {request ? (
            <motion.div key="request" className="w-full flex flex-col gap-7" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
              <div><p className="label mb-3">Request access</p><h2 className="display text-[40px]">Invitations only.</h2></div>
              <p className="text-[14px] text-mute leading-relaxed">Ask an Owner or Admin in your organization to invite your verified work email. The invitation is accepted after you sign in with the configured identity provider.</p>
              <Link to="/access" className="text-[13px] text-mute hover:text-bone">Return to sign in</Link>
            </motion.div>
          ) : (
            <motion.div key="login" className="w-full flex flex-col gap-7" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
              <div><p className="label mb-3">Organization identity</p><h2 className="display text-[40px]">Sign in</h2></div>
              {configured ? (
                <Button variant="primary" onClick={beginSignIn}>Continue with your identity provider</Button>
              ) : (
                <p role="alert" className="text-[13px] text-amber">Sign-in is unavailable until VITE_OIDC_AUTHORITY and VITE_OIDC_CLIENT_ID are configured.</p>
              )}
              {error && <p role="alert" className="text-[13px] text-crimson-ink">{error}</p>}
              <Link to="/access?step=request" className="text-[13px] text-mute hover:text-bone">Need access? Ask your organization owner</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export function AccountSetup({ message }: { message: string }) {
  const { apiFetch, refreshProfile, signOut } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await apiFetch('/v1/bootstrap', {
        method: 'POST',
        body: JSON.stringify({ organization_name: name, organization_slug: slug }),
      })
      await refreshProfile()
      nav('/app', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Organization setup failed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6 py-12">
      <form onSubmit={submit} className="w-full max-w-[480px] flex flex-col gap-6">
        <div><p className="label mb-3">Organization access</p><h1 className="display text-[40px]">Account setup</h1></div>
        <p className="text-[13px] text-mute">{message}</p>
        <p className="text-[13px] text-mute">If this identity is configured as the initial Owner, you can create the first organization. Otherwise, ask an Owner to invite your verified email.</p>
        <Field id="org-name" label="Organization name"><input id="org-name" required minLength={2} maxLength={160} value={name} onChange={(event) => setName(event.target.value)} className={inputCls} /></Field>
        <Field id="org-slug" label="Organization slug" hint="Lowercase letters, numbers, and single hyphens."><input id="org-slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" minLength={2} maxLength={80} value={slug} onChange={(event) => setSlug(event.target.value)} className={inputCls} /></Field>
        {error && <p role="alert" className="text-[13px] text-crimson-ink">{error}</p>}
        <div className="flex items-center gap-3"><Button type="submit" variant="primary" disabled={saving}>{saving ? 'Setting up…' : 'Create organization'}</Button><button type="button" onClick={() => void signOut()} className="text-[13px] text-mute hover:text-bone">Sign out</button></div>
      </form>
    </main>
  )
}
