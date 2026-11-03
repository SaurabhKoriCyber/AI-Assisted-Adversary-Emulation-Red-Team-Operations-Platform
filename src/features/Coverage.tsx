import { useMemo, useState } from 'react'
import { Badge, Chip, Mono, Screen, SlideOver, Button, cx } from '@/components/ui'
import { PLATFORMS, SOURCES, TACTICS, TECHNIQUES, coverage, type Technique, type CovStatus } from '@/data/mock'
import { Count } from '@/components/ui'

const sc: Record<CovStatus, string> = {
  detected: 'bg-teal/[0.16] border-teal/50 text-bone hover:bg-teal/30',
  gap: 'bg-crimson/[0.2] border-crimson/60 text-bone hover:bg-crimson/35',
  untested: 'bg-g2 border-line text-mute hover:border-line-2',
}
export default function Coverage() {
  const [tac, setTac] = useState<string | null>(null); const [plat, setPlat] = useState<string | null>(null); const [src, setSrc] = useState<string | null>(null)
  const [sel, setSel] = useState<Technique | null>(null)
  const c = coverage()
  const match = (t: Technique) => (!tac || t.tactic === tac) && (!plat || t.platform.includes(plat)) && (!src || t.source === src)
  const cols = useMemo(() => TACTICS.map((x) => ({ name: x, items: TECHNIQUES.filter((t) => t.tactic === x) })), [])
  const toggle = (cur: string | null, set: (v: string | null) => void, v: string) => set(cur === v ? null : v)
  return (
    <Screen eyebrow="ATT&CK Coverage · Enterprise v15" title={<>Where the<br /><span className="italic text-bone/60">surface is open</span></>}
      aside={<div className="text-right"><Count to={c.pct} decimals={1} suffix="%" className="display text-[72px]" /><p className="label mt-1">of tested techniques detected</p></div>}>
      <div className="flex flex-col gap-3 mb-10">
        {[['Tactic', TACTICS as readonly string[], tac, setTac], ['Platform', PLATFORMS as readonly string[], plat, setPlat], ['Data source', SOURCES as readonly string[], src, setSrc]].map(([label, opts, cur, set]) => (
          <div key={label as string} className="flex items-center gap-4 flex-wrap"><span className="label w-24">{label as string}</span>
            {(opts as string[]).map((o) => <Chip key={o} active={cur === o} onClick={() => toggle(cur as string | null, set as (v: string | null) => void, o)}>{o}</Chip>)}</div>
        ))}
      </div>
      <div className="flex gap-6 mb-6 text-[12px] text-mute" aria-label="Legend">
        <span className="flex items-center gap-2"><i className="size-2.5 bg-teal/60" />Detected</span><span className="flex items-center gap-2"><i className="size-2.5 bg-crimson/70" />Gap</span><span className="flex items-center gap-2"><i className="size-2.5 bg-g3 border border-line-2" />Untested</span>
      </div>
      <div className="overflow-x-auto pb-6" style={{ perspective: 1400 }}>
        <div className="grid gap-3 min-w-[1180px]" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0,1fr))`, transform: 'rotateX(6deg)', transformOrigin: '50% 0' }}>
          {cols.map((col) => (
            <div key={col.name} className="flex flex-col gap-2">
              <p className="label h-8 !tracking-[0.1em] leading-tight">{col.name}</p>
              {col.items.map((t) => {
                const on = match(t)
                return (
                  <button key={t.id} onClick={() => setSel(t)} aria-label={`${t.id} ${t.name}, ${t.status}`} disabled={!on}
                    className={cx('text-left border rounded-[3px] p-2.5 h-[76px] flex flex-col justify-between transition-[transform,background,border-color,opacity,box-shadow] duration-700 ease-[var(--ease-out)] hover:[transform:translateZ(28px)_translateY(-3px)] hover:shadow-[0_18px_30px_-14px_rgba(0,0,0,.9)] focus-visible:[transform:translateZ(28px)_translateY(-3px)]', sc[t.status], !on && 'opacity-[0.15] pointer-events-none')}>
                    <Mono className="text-[11px] opacity-90">{t.id}</Mono><span className="text-[11.5px] leading-tight line-clamp-2">{t.name}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <SlideOver open={!!sel} onClose={() => setSel(null)} title={sel?.name ?? ''} eyebrow={sel ? `${sel.id} · ${sel.tactic}` : ''}>
        {sel && (
          <div className="flex flex-col gap-7 text-[14px]">
            <Badge tone={sel.status === 'detected' ? 'teal' : sel.status === 'gap' ? 'crimson' : 'neutral'} dot>{sel.status}</Badge>
            {[['Emulation test', sel.atomic], ['Engine mapping', sel.caldera], ['Expected telemetry', sel.telemetry], ['Detection rule', sel.rule], ['Result', sel.result], ['Platforms', sel.platform.join(', ')]].map(([k, v]) => (
              <div key={k} className="hair-t pt-4"><p className="label mb-2">{k}</p><p className={k === 'Detection rule' || k === 'Engine mapping' ? 'font-mono text-[12.5px]' : ''}>{v}</p></div>
            ))}
            <div className="flex gap-3"><Button variant="primary">Add to planner</Button><Button>View evidence</Button></div>
          </div>
        )}
      </SlideOver>
    </Screen>
  )
}
