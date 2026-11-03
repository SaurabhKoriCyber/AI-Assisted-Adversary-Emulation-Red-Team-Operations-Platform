import { useCallback, useEffect, useMemo, useState } from 'react'
import { BaseEdge, Handle, Position, ReactFlow, ReactFlowProvider, useReactFlow, type Edge, type EdgeProps, type Node, type NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Button, Chip, Mono, Screen, cx } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'

type HostData = { host: string; role: string; layer: number; state: 'foothold' | 'owned' | 'blocked' | 'target'; active: boolean; dim: boolean }
const HOSTS: { id: string; host: string; role: string; x: number; y: number; layer: number; state: HostData['state'] }[] = [
  { id: 'n0', host: 'WKS-FIN-0142', role: 'Finance workstation', x: 0, y: 200, layer: 0, state: 'foothold' },
  { id: 'n1', host: 'SRV-FS-02', role: 'File server', x: 360, y: 60, layer: 1, state: 'owned' },
  { id: 'n2', host: 'SRV-SQL-04', role: 'SQL tier', x: 360, y: 340, layer: 1, state: 'owned' },
  { id: 'n3', host: 'DC-01', role: 'Domain controller', x: 740, y: 200, layer: 2, state: 'target' },
  { id: 'n4', host: 'BKP-NAS-01', role: 'Backup appliance', x: 1100, y: 80, layer: 3, state: 'blocked' },
]
const CHAIN = [
  { id: 'e0', s: 'n0', t: 'n1', tech: 'T1550.002', tactic: 'Lateral Movement', label: 'Pass the Hash', ok: false },
  { id: 'e1', s: 'n0', t: 'n2', tech: 'T1021.001', tactic: 'Lateral Movement', label: 'Remote Desktop', ok: true },
  { id: 'e2', s: 'n1', t: 'n3', tech: 'T1558.003', tactic: 'Credential Access', label: 'Kerberoasting', ok: false },
  { id: 'e3', s: 'n2', t: 'n3', tech: 'T1003.001', tactic: 'Credential Access', label: 'LSASS Memory', ok: true },
  { id: 'e4', s: 'n3', t: 'n4', tech: 'T1490', tactic: 'Impact', label: 'Inhibit Recovery', ok: true },
]
const ORDER = ['e0', 'e2', 'e1', 'e3', 'e4']

function HostNode({ data }: NodeProps<Node<HostData>>) {
  const d = data
  return (
    <div className={cx('w-[200px] rounded-[4px] p-4 transition-all duration-700 ease-[var(--ease-out)] border backdrop-blur-0',
      d.active ? 'border-crimson/80 bg-g2 shadow-[0_0_0_1px_rgba(193,18,31,.4),0_30px_50px_-20px_rgba(193,18,31,.35)]' : 'border-line-2 bg-g1',
      d.dim && 'opacity-25', d.layer > 1 && !d.active && 'opacity-90')}
      style={{ transform: `scale(${1 - d.layer * 0.04})`, boxShadow: d.active ? undefined : 'inset 0 1px 0 rgba(255,255,255,.07), 0 30px 40px -24px rgba(0,0,0,.9)', background: d.active ? undefined : 'linear-gradient(180deg,#171a20,#0d0f12)' }}>
      <Handle type="target" position={Position.Left} /><Handle type="source" position={Position.Right} />
      <p className="label mb-2">{d.state}</p>
      <p className="font-mono text-[13px]">{d.host}</p><p className="text-[12px] text-mute mt-1">{d.role}</p>
      <i className={cx('absolute top-0 left-4 right-4 h-px', d.state === 'blocked' ? 'bg-amber' : d.active ? 'bg-crimson' : 'bg-white/20')} />
    </div>
  )
}
function TraceEdge({ id, sourceX, sourceY, targetX, targetY, data }: EdgeProps) {
  const mx = (sourceX + targetX) / 2
  const path = `M${sourceX},${sourceY} C${mx},${sourceY} ${mx},${targetY} ${targetX},${targetY}`
  const d = data as { active: boolean; dim: boolean; ok: boolean; label: string }
  const col = d.ok ? '#3FA7A0' : '#C1121F'
  return (
    <g style={{ opacity: d.dim ? 0.15 : 1, transition: 'opacity .7s' }}>
      <BaseEdge id={id} path={path} style={{ stroke: d.active ? col : 'rgba(255,255,255,.14)', strokeWidth: d.active ? 1.5 : 1 }} />
      {d.active && <circle r="3" fill={col} style={{ filter: `drop-shadow(0 0 6px ${col})` }}><animateMotion dur="1.6s" repeatCount="indefinite" path={path} keyTimes="0;1" keySplines="0.65 0 0.35 1" calcMode="spline" /></circle>}
      <text x={mx} y={(sourceY + targetY) / 2 - 10} textAnchor="middle" className="fill-[#8A8D93]" style={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}>{d.label}</text>
    </g>
  )
}
const nodeTypes = { host: HostNode }; const edgeTypes = { trace: TraceEdge }

function Graph() {
  const { setCenter, fitView } = useReactFlow()
  const [step, setStep] = useState(-1); const [play, setPlay] = useState(false); const [tactic, setTactic] = useState<string | null>(null)
  const activeIds = step < 0 ? [] : ORDER.slice(0, step + 1)
  const current = step >= 0 ? CHAIN.find((c) => c.id === ORDER[step]) : null
  useEffect(() => { if (!play) return; const t = setInterval(() => setStep((s) => { if (s >= ORDER.length - 1) { setPlay(false); return s } return s + 1 }), 2200); return () => clearInterval(t) }, [play])
  useEffect(() => {
    if (!current) { fitView({ duration: 900, padding: 0.2 }); return }
    const n = HOSTS.find((h) => h.id === current.t)!
    setCenter(n.x + 100, n.y + 40, { zoom: 1, duration: 1100 }) // camera glide
  }, [current, setCenter, fitView])
  const nodes: Node<HostData>[] = useMemo(() => HOSTS.map((h) => ({
    id: h.id, type: 'host', position: { x: h.x, y: h.y }, draggable: false,
    data: { host: h.host, role: h.role, layer: h.layer, state: h.state, active: !!current && (current.s === h.id || current.t === h.id), dim: !!tactic && !CHAIN.some((c) => c.tactic === tactic && (c.s === h.id || c.t === h.id)) },
  })), [current, tactic])
  const edges: Edge[] = useMemo(() => CHAIN.map((c) => ({ id: c.id, source: c.s, target: c.t, type: 'trace', data: { active: activeIds.includes(c.id) && (!current || c.id === current.id), dim: !!tactic && c.tactic !== tactic, ok: c.ok, label: `${c.tech}` } })), [activeIds, current, tactic])
  const next = useCallback(() => setStep((s) => Math.min(s + 1, ORDER.length - 1)), [])
  return (
    <div className="grid grid-cols-12 gap-x-10 gap-y-6">
      <div className="col-span-12 flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={() => { if (step >= ORDER.length - 1) setStep(0); setPlay((p) => !p); if (step < 0) setStep(0) }}><Icon name={play ? 'pause' : 'play'} size={14} />{play ? 'Pause' : 'Play chain'}</Button>
        <Button onClick={next} disabled={step >= ORDER.length - 1}>Step</Button><Button variant="quiet" onClick={() => { setPlay(false); setStep(-1) }}>Reset</Button>
        <span className="mx-3 w-px h-5 bg-line-2" />
        {['Lateral Movement', 'Credential Access', 'Impact'].map((t) => <Chip key={t} active={tactic === t} onClick={() => setTactic(tactic === t ? null : t)}>{t}</Chip>)}
      </div>
      <div className="col-span-12 lg:col-span-9 h-[560px] rounded-[4px] border border-line relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 100%, #14171c, #07080a 70%)' }}>
        <div className="absolute inset-x-0 bottom-0 h-1/2 opacity-40 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)', backgroundSize: '48px 48px', transform: 'perspective(500px) rotateX(62deg)', transformOrigin: 'bottom' }} />
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView fitViewOptions={{ padding: 0.2 }} minZoom={0.3} maxZoom={1.5} proOptions={{ hideAttribution: true }} nodesConnectable={false} />
      </div>
      <aside className="col-span-12 lg:col-span-3" aria-live="polite">
        <p className="label mb-4">Technique chain</p>
        <ol>{ORDER.map((id, i) => { const c = CHAIN.find((x) => x.id === id)!; return (
          <li key={id}><button onClick={() => { setPlay(false); setStep(i) }} data-active={i === step} className={cx('row-draw w-full text-left py-3 hair-b flex justify-between gap-3', i > step && 'opacity-50')}>
            <span><Mono className="text-mute">{String(i + 1).padStart(2, '0')} · {c.tech}</Mono><span className="block text-[13px]">{c.label}</span></span>
            <span className={cx('label self-center', c.ok ? '!text-teal' : '!text-crimson-ink')}>{i <= step ? (c.ok ? 'detected' : 'gap') : ''}</span></button></li>
        ) })}</ol>
      </aside>
    </div>
  )
}
export default function AttackPath() {
  return <Screen eyebrow="Attack Path · OP-2419 replay" title={<>Follow the chain,<br /><span className="italic text-bone/60">host by host</span></>}><ReactFlowProvider><Graph /></ReactFlowProvider></Screen>
}
