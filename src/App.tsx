import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'
import Shell from '@/components/layout/Shell'
import { ToastProvider } from '@/components/ui'
import { AuthProvider, completeSignIn, useAuth } from '@/lib/auth'
import Landing from '@/features/Landing'
import Access, { AccountSetup } from '@/features/Access'
import Command from '@/features/Command'
import Approvals from '@/features/Approvals'
import Coverage from '@/features/Coverage'
import { OperationDetail, OperationsList } from '@/features/Operations'
import { Audit, Billing, Evidence, Integrations, Planner, Reports, Settings, Team, Telemetry } from '@/features/More'
const AttackPath = lazy(() => import('@/features/AttackPath'))
const Design = lazy(() => import('@/features/Design'))

function RequireAuth({ children }: { children: ReactNode }) {
  const { ready, configured, user, profile, profileError } = useAuth()
  const location = useLocation()
  if (!ready || (user && !profile && !profileError)) return <div className="min-h-screen bg-ink" role="status" aria-label="Restoring sign-in" />
  if (!configured) return <Navigate to="/access?config=required" replace />
  if (!user || user.expired) return <Navigate to="/access" replace state={{ from: location.pathname }} />
  if (profileError) return <AccountSetup message={profileError} />
  return children
}

function AuthCallback() {
  const nav = useNavigate()
  const { configured } = useAuth()
  const [error, setError] = useState('')
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    if (!configured) { setError('Sign-in is not configured.'); return }
    completeSignIn()
      .then((user) => {
        const returnTo = typeof user.state === 'string' && user.state.startsWith('/') && !user.state.startsWith('//') ? user.state : '/app'
        nav(returnTo, { replace: true })
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Identity callback failed.'))
  }, [configured, nav])
  return <main className="min-h-screen bg-ink flex items-center justify-center px-6">
    <p role={error ? 'alert' : 'status'} className="text-[14px] text-mute">{error || 'Completing sign-in…'}</p>
  </main>
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/access" element={<Access />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/design" element={<Design />} />
              <Route path="/app" element={<RequireAuth><Shell /></RequireAuth>}>
                <Route index element={<Command />} />
                <Route path="operations" element={<OperationsList />} />
                <Route path="operations/:id" element={<OperationDetail />} />
                <Route path="attack-path" element={<AttackPath />} />
                <Route path="coverage" element={<Coverage />} />
                <Route path="planner" element={<Planner />} />
                <Route path="approvals" element={<Approvals />} />
                <Route path="telemetry" element={<Telemetry />} />
                <Route path="evidence" element={<Evidence />} />
                <Route path="reports" element={<Reports />} />
                <Route path="billing" element={<Billing />} />
                <Route path="team" element={<Team />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="audit" element={<Audit />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <div className="grain" aria-hidden="true" /><div className="vignette" aria-hidden="true" />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
    </MotionConfig>
  )
}
