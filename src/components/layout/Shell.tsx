import { useEffect, useRef, useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import { Icon, Logo, type IconName } from '@/components/ui/Icon'
import { cx } from '@/components/ui'
import { EASE_IO, EASE_OUT, useCalm, useMedia } from '@/lib/motion'
import { APPROVALS } from '@/data/mock'
import { useAuth } from '@/lib/auth'

const NAV: { to: string; label: string; icon: IconName; end?: boolean; badge?: number }[] = [
  { to: '/app', label: 'Command Center', icon: 'command', end: true },
  { to: '/app/operations', label: 'Operations', icon: 'ops' },
  { to: '/app/attack-path', label: 'Attack Path', icon: 'path' },
  { to: '/app/coverage', label: 'Coverage', icon: 'matrix' },
  { to: '/app/planner', label: 'Planner', icon: 'planner' },
  { to: '/app/approvals', label: 'Approvals', icon: 'approval', badge: APPROVALS.length },
  { to: '/app/telemetry', label: 'Telemetry', icon: 'telemetry' },
  { to: '/app/evidence', label: 'Evidence', icon: 'vault' },
  { to: '/app/reports', label: 'Reports', icon: 'report' },
]
const NAV2: typeof NAV = [
  { to: '/app/billing', label: 'Billing', icon: 'billing' },
  { to: '/app/team', label: 'Team', icon: 'team' },
  { to: '/app/integrations', label: 'Integrations', icon: 'plug' },
  { to: '/app/audit', label: 'Audit log', icon: 'audit' },
  { to: '/app/settings', label: 'Settings', icon: 'settings' },
]
const ALL = [...NAV, ...NAV2]

function Rail({ open, setOpen }: { open: boolean; setOpen: (b: boolean) => void }) {
  const item = (n: (typeof NAV)[number]) => (
    <NavLink key={n.to} to={n.to} end={n.end} title={n.label}
      className={({ isActive }) => cx('group relative flex items-center gap-4 h-10 px-[19px] text-[13px] transition-colors duration-500', isActive ? 'text-bone' : 'text-mute hover:text-bone')}>
      {({ isActive }) => (<>
        {isActive && <motion.i layoutId="rail-ink" transition={{ duration: 0.6, ease: EASE_OUT }} className="absolute left-0 top-2 bottom-2 w-px bg-crimson" />}
        <Icon name={n.icon} /><span className={cx('whitespace-nowrap transition-opacity duration-500', !open && 'opacity-0 pointer-events-none')}>{n.label}</span>
        {n.badge && open && <span className="ml-auto font-mono text-[11px] text-amber num">{n.badge}</span>}
        {n.badge && !open && <i className="absolute left-[34px] top-2 size-1.5 rounded-full bg-amber" />}
      </>)}
    </NavLink>
  )
  return (
    <motion.nav aria-label="Main" animate={{ width: open ? 232 : 60 }} transition={{ duration: 0.7, ease: EASE_IO }}
      className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-g1/90 border-r border-line">
      <div className="h-16 flex items-center gap-3 px-[19px] hair-b"><Logo /><span className={cx('display text-[22px] tracking-[0.04em] transition-opacity duration-500', !open && 'opacity-0')}>REDOPS</span></div>
      <div className="flex-1 py-4 flex flex-col gap-0.5">{NAV.map(item)}<div className="my-3 mx-5 hair-t" />{NAV2.map(item)}</div>
      <button onClick={() => setOpen(!open)} aria-label={open ? 'Collapse navigation' : 'Expand navigation'} aria-expanded={open}
        className="h-12 hair-t px-[19px] flex items-center gap-4 text-mute hover:text-bone text-[12px]"><Icon name="chev" style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform .6s var(--ease-out)' }} /><span className={cx(!open && 'opacity-0')}>Collapse</span></button>
    </motion.nav>
  )
}

function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNavigate(); const [q, setQ] = useState(''); const [i, setI] = useState(0)
  const list = ALL.filter((n) => n.label.toLowerCase().includes(q.toLowerCase()))
  useEffect(() => { if (open) { setQ(''); setI(0) } }, [open])
  const go = (to: string) => { nav(to); onClose() }
  return (
    <AnimatePresence>{open && (
      <motion.div className="fixed inset-0 z-[80] bg-black/60 flex items-start justify-center pt-[16vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }} className="matte w-[min(560px,92vw)] rounded-[4px]">
          <div className="flex items-center gap-3 px-4 h-12 hair-b"><Icon name="search" className="text-mute" />
            <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setI(0) }} placeholder="Go to…" aria-label="Search destinations"
              onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(x + 1, list.length - 1)) } if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(x - 1, 0)) } if (e.key === 'Enter' && list[i]) go(list[i].to); if (e.key === 'Escape') onClose() }}
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-mute" /><kbd className="font-mono text-[10px] text-mute border border-line-2 px-1.5 py-0.5 rounded-[2px]">ESC</kbd></div>
          <ul role="listbox" className="py-2 max-h-[320px] overflow-y-auto">
            {list.map((n, k) => <li key={n.to} role="option" aria-selected={k === i} onMouseEnter={() => setI(k)} onClick={() => go(n.to)} className={cx('flex items-center gap-3 px-4 h-10 text-[13px] cursor-default', k === i ? 'bg-white/[0.05] text-bone' : 'text-mute')}><Icon name={n.icon} size={16} />{n.label}</li>)}
            {!list.length && <li className="px-4 py-6 text-[13px] text-mute">No destination matches “{q}”.</li>}
          </ul>
        </motion.div>
      </motion.div>
    )}</AnimatePresence>
  )
}

export default function Shell() {
  const [open, setOpen] = useState(true); const [pal, setPal] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const loc = useLocation(); const calm = useCalm(); const mobile = useMedia('(max-width: 767px)')
  const { profile, signOut } = useAuth()
  const main = useRef<HTMLDivElement>(null); const [prog, setProg] = useState(0)
  const [wipe, setWipe] = useState(0)
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal((p) => !p) } }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => {
    const el = main.current; if (!el || calm) return
    const lenis = new Lenis({ wrapper: el, content: el.firstElementChild as HTMLElement, duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) })
    let raf = 0; const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }; raf = requestAnimationFrame(loop)
    lenis.on('scroll', (l: Lenis) => setProg(l.progress))
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [calm, loc.pathname])
  useEffect(() => { setWipe((w) => w + 1); main.current?.scrollTo(0, 0) }, [loc.pathname])
  // Mobile is approval-only by design
  if (mobile && !loc.pathname.startsWith('/app/approvals')) return <Navigate to="/app/approvals" replace />
  return (
    <div className="min-h-screen">
      <Rail open={open} setOpen={setOpen} />
      <motion.div animate={{ paddingLeft: mobile ? 0 : open ? 232 : 60 }} transition={{ duration: 0.7, ease: EASE_IO }} className="h-screen flex flex-col">
        <div className="h-16 shrink-0 hair-b flex items-center justify-between px-6 md:px-12">
          <div className="label flex items-center gap-3"><span className="size-1.5 rounded-full bg-teal" />Northwind Financial · ENG-0087 · In window</div>
          <div className="flex items-center gap-4">
            <button onClick={() => setPal(true)} className="hidden md:flex items-center gap-3 h-8 pl-3 pr-2 border border-line-2 rounded-[3px] text-[12px] text-mute hover:text-bone transition-colors duration-500"><Icon name="search" size={14} />Search<kbd className="font-mono text-[10px] border border-line-2 px-1.5 rounded-[2px]">⌘K</kbd></button>
            <span className="font-mono text-[11px] text-mute">{profile?.display_name ?? 'Signed in'}</span>
            <button onClick={() => { setSignOutError(''); void signOut().catch((error: unknown) => setSignOutError(error instanceof Error ? error.message : 'Sign out failed.')) }} className="text-[12px] text-mute hover:text-bone">Sign out</button>
          </div>
        </div>
        {signOutError && <p role="alert" className="px-6 md:px-12 py-2 text-[12px] text-crimson-ink">{signOutError}</p>}
        <div ref={main} className="flex-1 overflow-y-auto relative">
          <div><AnimatePresence mode="wait" initial={false}><motion.div key={loc.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: EASE_OUT }}><Outlet /></motion.div></AnimatePresence></div>
        </div>
        {/* thin progress indicator replaces scrollbar */}
        <i className="fixed right-0 top-16 w-px bg-crimson/70 z-30 pointer-events-none" style={{ height: `calc((100vh - 64px) * ${prog})` }} />
      </motion.div>
      {/* route curtain wipe */}
      {!calm && <motion.div key={wipe} className="fixed inset-0 z-[60] bg-ink pointer-events-none origin-top" initial={{ scaleY: wipe ? 1 : 0 }} animate={{ scaleY: 0 }} transition={{ duration: 0.8, ease: EASE_IO }} />}
      <Palette open={pal} onClose={() => setPal(false)} />
    </div>
  )
}
