import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { EASE_OUT, EASE_IO, useCalm, useCountUp } from '@/lib/motion'
import { Icon } from './Icon'
import { useSearchParams } from 'react-router'

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

/* ---------- Button (optionally magnetic) ---------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'quiet'; magnetic?: boolean; size?: 'sm' | 'md' }
export function Button({ variant = 'ghost', magnetic, size = 'md', className, children, ...r }: BtnProps) {
  const calm = useCalm()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 })
  const base = 'inline-flex items-center justify-center gap-2 font-medium tracking-[0.01em] rounded-[3px] transition-[background,border-color,color,opacity] duration-500 ease-[var(--ease-out)] disabled:opacity-40 disabled:pointer-events-none select-none'
  const sz = size === 'sm' ? 'h-8 px-3 text-[12px]' : 'h-10 px-5 text-[13px]'
  const v = {
    primary: 'bg-crimson text-white hover:bg-[#d3202d] shadow-[inset_0_1px_0_rgba(255,255,255,.18)]',
    ghost: 'border border-line-2 text-bone hover:border-bone/50 bg-white/[0.01]',
    quiet: 'text-mute hover:text-bone',
  }[variant]
  return (
    <motion.button style={magnetic && !calm ? { x, y } : undefined}
      onMouseMove={(e) => { if (!magnetic || calm) return; const b = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - b.left - b.width / 2) * 0.22); y.set((e.clientY - b.top - b.height / 2) * 0.3) }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      className={cx(base, sz, v, className)} {...(r as object)}>{children}</motion.button>
  )
}

/* ---------- Badges / chips ---------- */
const tone = {
  neutral: 'text-mute border-line-2', crimson: 'text-crimson-ink border-crimson/50', teal: 'text-teal border-teal/40',
  amber: 'text-amber border-amber/40', bone: 'text-bone border-bone/30',
}
export type Tone = keyof typeof tone
export function Badge({ tone: t = 'neutral', children, dot }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 h-5 px-2 border rounded-[2px] text-[10.5px] tracking-[0.12em] uppercase font-medium whitespace-nowrap', tone[t])}>
      {dot && <i className="size-1.5 rounded-full bg-current" />}{children}
    </span>
  )
}
/** Status chip with cross-fade between states */
export function StatusChip({ status }: { status: 'queued' | 'running' | 'awaiting approval' | 'completed' | 'failed' | 'blocked' }) {
  const t: Record<string, Tone> = { queued: 'neutral', running: 'bone', 'awaiting approval': 'amber', completed: 'teal', failed: 'crimson', blocked: 'crimson' }
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE_IO }}>
        <Badge tone={t[status]} dot>{status}</Badge>
      </motion.span>
    </AnimatePresence>
  )
}
export function Chip({ active, children, ...r }: { active?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button aria-pressed={active} {...r}
      className={cx('h-7 px-3 text-[12px] rounded-[2px] border transition-colors duration-500', active ? 'border-bone/60 text-bone bg-white/[0.05]' : 'border-line text-mute hover:text-bone hover:border-line-2')}>
      {children}
    </button>
  )
}

/* ---------- Tabs ---------- */
export function Tabs({ items, value, onChange }: { items: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div role="tablist" className="flex gap-6 hair-b">
      {items.map((i) => (
        <button key={i.id} role="tab" aria-selected={value === i.id} onClick={() => onChange(i.id)}
          className={cx('relative py-3 text-[13px] transition-colors duration-500', value === i.id ? 'text-bone' : 'text-mute hover:text-bone')}>
          {i.label}
          {value === i.id && <motion.i layoutId="tab-ink" transition={{ duration: 0.6, ease: EASE_OUT }} className="absolute left-0 right-0 -bottom-px h-px bg-crimson" />}
        </button>
      ))}
    </div>
  )
}

/* ---------- Tooltip ---------- */
export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  const [o, setO] = useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={() => setO(true)} onMouseLeave={() => setO(false)} onFocus={() => setO(true)} onBlur={() => setO(false)}>
      {children}
      <AnimatePresence>{o && (
        <motion.span role="tooltip" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE_OUT }}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 whitespace-nowrap matte px-2.5 py-1.5 text-[11px] text-bone rounded-[3px] pointer-events-none">{text}</motion.span>
      )}</AnimatePresence>
    </span>
  )
}

/* ---------- Fields (visible labels) ---------- */
export function Field({ label, error, hint, children, id }: { label: string; error?: string; hint?: string; children: ReactNode; id: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error ? <p id={`${id}-e`} role="alert" className="text-[12px] text-crimson-ink">{error}</p> : hint && <p className="text-[12px] text-mute">{hint}</p>}
    </div>
  )
}
export const inputCls = 'h-10 w-full bg-g1 border border-line-2 rounded-[3px] px-3 text-[14px] text-bone placeholder:text-mute/60 transition-colors duration-500 focus:border-bone/60 focus:outline-none aria-[invalid=true]:border-crimson'

/* ---------- Count ---------- */
export function Count({ to, decimals = 0, suffix = '', className }: { to: number; decimals?: number; suffix?: string; className?: string }) {
  const v = useCountUp(to, 1400, decimals)
  return <span className={cx('num', className)}>{v}{suffix}</span>
}

/* ---------- Press-and-hold confirm ring ---------- */
export function HoldButton({ label, tone: t = 'teal', onConfirm, disabled, hint, ms = 1200 }: { label: string; tone?: 'teal' | 'crimson' | 'bone'; onConfirm: () => void; disabled?: boolean; hint?: string; ms?: number }) {
  const [p, setP] = useState(0); const raf = useRef(0); const t0 = useRef(0); const holding = useRef(false)
  const calm = useCalm(); const dur = calm ? ms : ms
  const stop = useCallback(() => { holding.current = false; cancelAnimationFrame(raf.current); setP(0) }, [])
  const start = useCallback(() => {
    if (disabled || holding.current) return
    holding.current = true; t0.current = performance.now()
    const step = (n: number) => {
      const v = Math.min(1, (n - t0.current) / dur); setP(v)
      if (v >= 1) { holding.current = false; onConfirm(); setTimeout(() => setP(0), 500); return }
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }, [disabled, dur, onConfirm])
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  const R = 13, C = 2 * Math.PI * R
  const col = { teal: '#3FA7A0', crimson: '#C1121F', bone: '#ECE9E2' }[t]
  return (
    <button disabled={disabled} aria-label={`${label}. Press and hold to confirm.`} aria-describedby={hint ? undefined : undefined}
      onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start() } }}
      onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') stop() }} onBlur={stop}
      className="group relative inline-flex items-center gap-3 h-11 pl-3 pr-5 border border-line-2 rounded-[3px] text-[13px] hover:border-bone/50 transition-colors duration-500 disabled:opacity-35 disabled:pointer-events-none select-none touch-none">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" />
        <circle cx="16" cy="16" r={R} fill="none" stroke={col} strokeWidth="1.5" strokeDasharray={C} strokeDashoffset={C * (1 - p)} transform="rotate(-90 16 16)" />
        <path d="M11 16.5l3.500 3.500 7-7.500" fill="none" stroke={col} strokeWidth="1.5" opacity={p >= 1 ? 1 : 0.35} />
      </svg>
      <span className="flex flex-col items-start leading-tight"><span>{label}</span><span className="text-[10px] text-mute tracking-wide">Hold to confirm</span></span>
    </button>
  )
}

/* ---------- Skeleton / states ---------- */
export const Skel = ({ w = '100%', h = 12, className }: { w?: string | number; h?: number; className?: string }) => <div className={cx('skel', className)} style={{ width: w, height: h }} />
export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return <div role="status" aria-label="Loading" className="flex flex-col gap-4 py-2">{Array.from({ length: rows }, (_, i) => <div key={i} className="flex gap-6 items-center"><Skel w={72} /><Skel w={`${40 + ((i * 17) % 35)}%`} /><Skel w={56} className="ml-auto" /></div>)}</div>
}
type StateKind = 'empty' | 'error' | 'denied'
const STATE_COPY: Record<StateKind, { t: string; d: string; a: string }> = {
  empty: { t: 'Nothing recorded yet', d: 'This view fills as operations run. Load the sample engagement to see the loop with representative data.', a: 'Load sample engagement' },
  error: { t: 'This view could not be loaded', d: 'The request to the REDOPS API timed out after 8 seconds. No data was changed. Request ID req_7f3a91c2.', a: 'Retry' },
  denied: { t: 'Your role does not include this view', d: 'Access to this area requires the Admin or Owner role. Ask an Owner in your organisation to adjust your membership.', a: 'Request access' },
}
export function StateBlock({ kind, onAction, action }: { kind: StateKind; onAction?: () => void; action?: string }) {
  const c = STATE_COPY[kind]
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className="flex flex-col items-start gap-5 py-24 max-w-[440px]">
      <span className={cx('label', kind === 'error' && '!text-crimson-ink', kind === 'denied' && '!text-amber')}>{kind === 'denied' ? '403 · Permission' : kind === 'error' ? 'Error' : 'Empty'}</span>
      <h2 className="display text-[40px]">{c.t}</h2>
      <p className="text-[14px] text-mute leading-relaxed">{c.d}</p>
      <Button variant="ghost" onClick={onAction}>{action ?? c.a}</Button>
    </div>
  )
}

/** Screen wrapper: header + load/empty/error/denied handling. Force with ?state=loading|empty|error|denied */
export function Screen({ eyebrow, title, aside, children, skeleton }: { eyebrow: string; title: ReactNode; aside?: ReactNode; children: ReactNode; skeleton?: ReactNode }) {
  const [sp, setSp] = useSearchParams(); const forced = sp.get('state')
  const [booting, setBooting] = useState(true)
  useEffect(() => { const t = setTimeout(() => setBooting(false), 650); return () => clearTimeout(t) }, [])
  const clear = () => { setSp((prev) => { const next = new URLSearchParams(prev); next.delete('state'); return next }) }
  const state = forced === 'loading' || booting ? 'loading' : forced
  return (
    <div className="px-6 md:px-12 pt-10 pb-24 max-w-[1440px]">
      <header className="flex items-end justify-between gap-8 mb-10">
        <div><p className="label mb-4">{eyebrow}</p><h1 className="display text-[48px] md:text-[64px]">{title}</h1></div>
        {aside && <div className="hidden md:block">{aside}</div>}
      </header>
      {state === 'loading' ? (skeleton ?? <SkeletonRows rows={8} />)
        : state === 'empty' || state === 'error' || state === 'denied' ? <StateBlock kind={state as StateKind} onAction={clear} />
        : <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE_OUT }}>{children}</motion.div>}
    </div>
  )
}

/* ---------- Slide-over / modal ---------- */
export function SlideOver({ open, onClose, title, eyebrow, children }: { open: boolean; onClose: () => void; title: string; eyebrow?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); return () => { window.removeEventListener('keydown', k); prev?.focus() }
  }, [open, onClose])
  return (
    <AnimatePresence>{open && (
      <>
        <motion.div className="fixed inset-0 bg-black/60 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
        <motion.aside ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
          initial={{ x: 48, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 48, opacity: 0 }} transition={{ duration: 0.7, ease: EASE_OUT }}
          className="fixed right-0 top-0 bottom-0 w-full md:w-[520px] z-[71] bg-g1 border-l border-line-2 p-8 overflow-y-auto outline-none">
          <div className="flex items-start justify-between mb-8">
            <div>{eyebrow && <p className="label mb-3">{eyebrow}</p>}<h2 className="display text-[36px]">{title}</h2></div>
            <button onClick={onClose} aria-label="Close" className="text-mute hover:text-bone p-1"><Icon name="x" /></button>
          </div>
          {children}
        </motion.aside>
      </>
    )}</AnimatePresence>
  )
}

/* ---------- Toasts ---------- */
const ToastCtx = createContext<(m: string, t?: Tone) => void>(() => {})
export const useToast = () => useContext(ToastCtx)
export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<{ id: number; m: string; t: Tone }[]>([])
  const push = useCallback((m: string, t: Tone = 'neutral') => {
    const id = Date.now() + Math.random(); setList((l) => [...l, { id, m, t }]); setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 4500)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        <AnimatePresence>{list.map((x) => (
          <motion.div key={x.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}
            className="matte px-4 py-3 text-[13px] rounded-[3px] min-w-[280px] flex items-center gap-3"><i className={cx('size-1.5 rounded-full', x.t === 'teal' ? 'bg-teal' : x.t === 'crimson' ? 'bg-crimson' : x.t === 'amber' ? 'bg-amber' : 'bg-bone')} />{x.m}</motion.div>
        ))}</AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- Dense keyboard-navigable table ---------- */
export type Col<T> = { key: string; head: string; cell: (r: T) => ReactNode; w?: string; align?: 'right' }
export function DataTable<T extends { id: string }>({ cols, rows, onOpen, activeId, label }: { cols: Col<T>[]; rows: T[]; onOpen?: (r: T) => void; activeId?: string; label: string }) {
  const grid = cols.map((c) => c.w ?? '1fr').join(' ')
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: React.KeyboardEvent, i: number) => {
    const rs = ref.current?.querySelectorAll<HTMLElement>('[data-row]'); if (!rs) return
    if (e.key === 'ArrowDown') { e.preventDefault(); rs[Math.min(i + 1, rs.length - 1)].focus() }
    if (e.key === 'ArrowUp') { e.preventDefault(); rs[Math.max(i - 1, 0)].focus() }
    if (e.key === 'Enter') onOpen?.(rows[i])
  }
  return (
    <div ref={ref} role="table" aria-label={label} className="text-[13px] overflow-x-auto">
      <div className="min-w-[720px]">
        <div role="row" className="grid sticky top-0 z-10 bg-ink/95 hair-b py-3 gap-4" style={{ gridTemplateColumns: grid }}>
          {cols.map((c) => <div role="columnheader" key={c.key} className={cx('label', c.align === 'right' && 'text-right')}>{c.head}</div>)}
        </div>
        {rows.map((r, i) => (
          <div role="row" data-row tabIndex={0} data-active={activeId === r.id} key={r.id} onKeyDown={(e) => move(e, i)} onClick={() => onOpen?.(r)}
            className="row-draw grid items-center gap-4 py-3.5 hair-b cursor-default hover:bg-white/[0.015] focus-visible:bg-white/[0.03]" style={{ gridTemplateColumns: grid }}>
            {cols.map((c) => <div role="cell" key={c.key} className={cx('truncate', c.align === 'right' && 'text-right')}>{c.cell(r)}</div>)}
          </div>
        ))}
      </div>
    </div>
  )
}
export const Mono = ({ children, className }: { children: ReactNode; className?: string }) => <span className={cx('font-mono text-[12px] num', className)}>{children}</span>
