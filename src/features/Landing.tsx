import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button, HoldButton, useToast } from '@/components/ui'
import { Logo } from '@/components/ui/Icon'
import { Poster, canRender3D } from '@/components/three/Poster'
import { EASE_OUT, useCalm, useInView, useMedia } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)
const Scene = lazy(() => import('@/components/three/Scene'))

const STORY = [
  { k: 'Emulate', t: 'Run the technique. Not a guess.', d: ['REDOPS drives Caldera and Atomic Red Team inside a signed scope.', 'Every sensitive step waits for a named human to approve it.'], m: ['T1059.001', 'PowerShell · WKS-FIN-0142'] },
  { k: 'Telemetry', t: 'Read what the host actually said.', d: ['Sysmon, Security and EDR events stream in while the technique runs.', 'Each event is bound to the operation that caused it.'], m: ['4,812 events', 'Last 60 min · 14 hosts'] },
  { k: 'Detect', t: 'Check the rule, not the dashboard.', d: ['Every technique is matched against your detections.', 'Telemetry without an alert is named as a gap, with a suggested rule.'], m: ['68.4% covered', '9 open gaps'] },
  { k: 'Evidence', t: 'Seal each artefact into a chain.', d: ['Logs and screenshots are hashed with SHA-256 and linked to the one before.', 'Chain of custody is recorded and cannot be rewritten.'], m: ['sha256 9f2c…a41e', 'ev-0002 · linked'] },
  { k: 'Report', t: 'Close the gap. Prove the fix.', d: ['Executive and technical reports are built from the same evidence.', 'Re-run the technique and the loop closes.'], m: ['OP-2416', '11 of 18 detected'] },
]

function Lines({ lines, id }: { lines: string[]; id: string }) {
  return <>{lines.map((l, i) => (
    <span key={id + i} className="mask-line"><motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '-110%' }} transition={{ duration: 0.8, delay: i * 0.08, ease: EASE_OUT }}>{l}</motion.span></span>
  ))}</>
}

function readIntroFlag() {
  try {
    return typeof window !== 'undefined' && window.sessionStorage && !window.sessionStorage.getItem('redops-intro')
  } catch {
    return false
  }
}

function writeIntroFlag() {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) window.sessionStorage.setItem('redops-intro', '1')
  } catch {
    // Ignore storage failures in locked-down browsers.
  }
}

export default function Landing() {
  const calm = useCalm()
  const stage = useRef({ value: 0 })
  const [idx, setIdx] = useState(0)
  const [prog, setProg] = useState(0)
  const [intro, setIntro] = useState(() => !calm && readIntroFlag())
  const [ok3d] = useState(canRender3D)
  const wide = useMedia('(min-width: 900px)')
  const [stageRef, inView] = useInView<HTMLDivElement>('200px')
  const pin = useRef<HTMLDivElement>(null)
  const toast = useToast()

  useEffect(() => { if (!intro) return; const t = setTimeout(() => { setIntro(false); writeIntroFlag() }, 2600); return () => clearTimeout(t) }, [intro])

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: !calm })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    const st = ScrollTrigger.create({
      trigger: pin.current, start: 'top top', end: '+=420%', pin: true, scrub: true,
      onUpdate: (s) => { const v = s.progress * 4.999; stage.current.value = v; setIdx(Math.floor(v)); setProg(s.progress) },
    })
    return () => { st.kill(); gsap.ticker.remove(tick); lenis.destroy() }
  }, [calm])

  const s = STORY[idx]
  return (
    <div className="relative bg-ink">
      {/* intro curtain */}
      <AnimatePresence>{intro && (
        <motion.div className="fixed inset-0 z-[95] bg-ink flex flex-col items-center justify-center gap-8" exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}>
          <motion.i className="block h-px w-[min(320px,60vw)] bg-bone/60 origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: EASE_OUT }} />
          <span className="mask-line"><motion.span className="block display text-[44px] tracking-[0.02em]" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.7, ease: EASE_OUT }}>REDOPS</motion.span></span>
        </motion.div>
      )}</AnimatePresence>

      {/* 3D stage (fixed) */}
      <div ref={stageRef} className="fixed inset-0 z-0" aria-hidden={!ok3d ? undefined : true}>
        {ok3d ? (
          <Suspense fallback={null}>
            <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: intro ? 0 : 1 }} transition={{ duration: 1.6, delay: 0.3, ease: EASE_OUT }}>
              <Scene stage={stage} active={inView && !intro} offsetX={wide ? 1.3 : 0} />
            </motion.div>
          </Suspense>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"><Poster className="w-[min(70vw,640px)] opacity-90 md:translate-x-[18vw]" /></div>
        )}
        {/* light sweep on entrance */}
        {!calm && !intro && <motion.div className="absolute inset-y-0 w-1/3 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,233,226,.07), transparent)', transform: 'skewX(-18deg)' }} initial={{ left: '-40%' }} animate={{ left: '120%' }} transition={{ duration: 2.2, delay: 0.4, ease: [0.65, 0, 0.35, 1] }} />}
        {/* static light shafts, hero only */}
        <div className="absolute inset-0 pointer-events-none opacity-60" style={{ background: 'conic-gradient(from 200deg at 80% -10%, transparent 0 8%, rgba(236,233,226,.05) 10%, transparent 14%, rgba(236,233,226,.035) 18%, transparent 24%)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent md:via-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-20">
        <Link to="/" className="flex items-center gap-3 display text-[24px] tracking-[0.04em]"><Logo size={20} />REDOPS</Link>
        <nav className="flex items-center gap-2" aria-label="Primary">
          <Link to="/access" className="text-[13px] text-mute hover:text-bone px-3 py-2 transition-colors duration-500">Sign in</Link>
          <Link to="/access?step=request"><Button variant="primary" size="sm" magnetic>Request access</Button></Link>
        </nav>
      </header>

      <main className="relative z-10">
        {/* HERO */}
        <section className="min-h-screen flex flex-col justify-end px-6 md:px-12 pb-16 pt-32">
          <motion.p className="label mb-8" initial={{ opacity: 0 }} animate={{ opacity: intro ? 0 : 1 }} transition={{ duration: 0.9, delay: 0.6 }}>Purple team operations platform</motion.p>
          <h1 className="display text-[clamp(56px,10.5vw,176px)] max-w-[11ch]">
            {['Prove your', 'defenses.'].map((l, i) => <span key={l} className="mask-line"><motion.span className="block" initial={{ y: '105%' }} animate={{ y: intro ? '105%' : 0 }} transition={{ duration: 1.1, delay: 0.3 + i * 0.12, ease: EASE_OUT }}>{l}</motion.span></span>)}
            <span className="mask-line italic text-bone/60"><motion.span className="block" initial={{ y: '105%' }} animate={{ y: intro ? '105%' : 0 }} transition={{ duration: 1.1, delay: 0.55, ease: EASE_OUT }}>Close the loop.</motion.span></span>
          </h1>
          <div className="mt-14 flex flex-wrap items-end justify-between gap-10">
            <p className="max-w-[420px] text-[16px] leading-relaxed text-mute">Emulate the adversary, collect the telemetry, check the detection, capture the evidence, report the gap. REDOPS runs Caldera and Atomic Red Team behind human approval.</p>
            <div className="flex items-center gap-3">
              <Link to="/access?step=request"><Button variant="primary" magnetic>Request access</Button></Link>
              <Link to="/app"><Button variant="ghost" magnetic>View the console</Button></Link>
            </div>
          </div>
          <dl className="mt-16 grid grid-cols-3 max-w-[640px] hair-t pt-6 gap-6">
            {[['1,284', 'techniques validated'], ['41 s', 'median time to detection'], ['0', 'actions without approval']].map(([a, b]) => <div key={b}><dt className="display text-[32px] num">{a}</dt><dd className="label mt-2 !tracking-[0.12em]">{b}</dd></div>)}
          </dl>
        </section>

        {/* PINNED STORY */}
        <section ref={pin} aria-label="The detection-validation loop" className="h-screen relative flex items-center px-6 md:px-12">
          <div className="max-w-[560px] w-full">
            <div className="flex items-baseline gap-4 mb-8"><span className="font-mono text-[12px] text-crimson-ink num">0{idx + 1} / 05</span><span className="label">{s.k}</span></div>
            <h2 className="display text-[clamp(40px,5.6vw,84px)] mb-8 min-h-[2.1em]" aria-live="polite">
              <AnimatePresence mode="wait"><motion.span key={idx} className="block" exit={{ transition: { duration: 0.35 } }}><Lines id={`t${idx}`} lines={[s.t]} /></motion.span></AnimatePresence>
            </h2>
            <div className="text-[16px] leading-relaxed text-mute min-h-[96px]">
              <AnimatePresence mode="wait"><motion.div key={idx} exit={{ transition: { duration: 0.3 } }}><Lines id={`d${idx}`} lines={s.d} /></motion.div></AnimatePresence>
            </div>
            <div className="mt-10 hair-t pt-5 flex gap-6 font-mono text-[12px] num"><span className="text-bone">{s.m[0]}</span><span className="text-mute">{s.m[1]}</span></div>
          </div>
          {/* section index replaces scrollbar */}
          <nav aria-label="Loop stages" className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 items-end">
            {STORY.map((x, i) => <span key={x.k} className={`flex items-center gap-3 label transition-colors duration-700 ${i === idx ? '!text-bone' : ''}`}>{x.k}<i className="block h-px bg-current transition-all duration-700" style={{ width: i === idx ? 32 : 12 }} /></span>)}
            <i className="block w-px h-16 bg-line-2 relative mt-2 self-end"><i className="absolute top-0 left-0 w-px bg-crimson" style={{ height: `${prog * 100}%` }} /></i>
          </nav>
        </section>

        {/* HUMAN IN THE LOOP */}
        <section className="min-h-screen flex items-center px-6 md:px-12 py-32">
          <div className="grid md:grid-cols-12 gap-12 w-full">
            <div className="md:col-span-6 md:col-start-1">
              <p className="label mb-6">Human in the loop</p>
              <h2 className="display text-[clamp(44px,6vw,96px)]">Nothing runs until a person says so.</h2>
              <p className="text-mute text-[16px] leading-relaxed mt-8 max-w-[460px]">Each sensitive action arrives with its target, blast radius and rollback. The person who requests it cannot approve it. Scope and rules of engagement are checked on the server before any job starts.</p>
            </div>
            <div className="md:col-span-5 md:col-start-8 matte p-8 rounded-[4px] self-center">
              <div className="flex justify-between mb-6"><span className="label">apr-9031 · T1003.001</span><span className="label !text-amber">High risk</span></div>
              <p className="display text-[32px] mb-3">Dump LSASS process memory</p>
              <p className="font-mono text-[12px] text-mute mb-8">WKS-FIN-0142.corp.northwind.example · expires 14:32 UTC</p>
              <HoldButton label="Approve" onConfirm={() => toast('Approval recorded and written to the audit log (demo).', 'teal')} />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="min-h-[80vh] flex flex-col justify-center px-6 md:px-12">
          <h2 className="display text-[clamp(56px,11vw,180px)] max-w-[12ch]">Close the loop.</h2>
          <div className="mt-12 flex gap-3"><Link to="/access?step=request"><Button variant="primary" magnetic>Request access</Button></Link><Link to="/access"><Button magnetic>Sign in</Button></Link></div>
        </section>
        <footer className="px-6 md:px-12 py-10 hair-t flex justify-between label"><span>REDOPS</span><span>Authorised testing only. Scope enforced server-side.</span></footer>
      </main>
    </div>
  )
}
