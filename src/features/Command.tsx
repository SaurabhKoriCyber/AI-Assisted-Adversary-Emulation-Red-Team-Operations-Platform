import { Link } from 'react-router'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RTip, XAxis, YAxis } from 'recharts'
import { Count, Mono, Screen, StatusChip, Badge, Skel } from '@/components/ui'
import { Icon } from '@/components/ui/Icon'
import { APPROVALS, HASH_ITEMS, OPERATIONS, STAGES, TECHNIQUES, TREND, coverage } from '@/data/mock'

const loopHealth = [92, 88, 68, 100, 54]

export default function Command() {
  const c = coverage(); const gaps = TECHNIQUES.filter((t) => t.status === 'gap').slice(0, 5)
  return (
    <Screen eyebrow="Command Center · 14 Apr 2025" title={<>Loop health,<br /><span className="italic text-bone/60">as of 09:42 UTC</span></>}
      skeleton={<div className="grid grid-cols-12 gap-8"><Skel className="col-span-7" h={320} /><Skel className="col-span-4 col-start-9" h={320} /></div>}>
      <div className="grid grid-cols-12 gap-x-8 gap-y-16">
        {/* Coverage hero figure */}
        <section className="col-span-12 lg:col-span-7" aria-label="Detection coverage">
          <p className="label mb-4">Detection coverage · tested techniques</p>
          <div className="flex items-baseline gap-2"><Count to={c.pct} decimals={1} className="display text-[clamp(96px,14vw,200px)]" /><span className="display text-[48px] text-mute">%</span></div>
          <div className="flex gap-10 mt-6 text-[13px]">
            <span className="flex items-center gap-2"><i className="size-2 bg-teal" /><Mono>{c.detected}</Mono> detected</span>
            <span className="flex items-center gap-2"><i className="size-2 bg-crimson" /><Mono>{c.gap}</Mono> open gaps</span>
            <span className="flex items-center gap-2"><i className="size-2 bg-g3 border border-line-2" /><Mono>{c.untested}</Mono> untested</span>
          </div>
          <div className="h-[200px] mt-10 -ml-3" role="img" aria-label="Coverage trend rising from 41 percent in January to 76 percent in April">
            <ResponsiveContainer>
              <AreaChart data={TREND}>
                <defs><linearGradient id="cv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3FA7A0" stopOpacity={0.22} /><stop offset="1" stopColor="#3FA7A0" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="rgba(255,255,255,.05)" vertical={false} />
                <XAxis dataKey="w" tick={{ fill: '#8A8D93', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{ fill: '#8A8D93', fontSize: 10 }} axisLine={false} tickLine={false} width={36} domain={[30, 80]} />
                <RTip contentStyle={{ background: '#14171C', border: '1px solid rgba(255,255,255,.12)', borderRadius: 3, fontSize: 12 }} cursor={{ stroke: 'rgba(255,255,255,.2)' }} />
                <Area type="monotone" dataKey="coverage" stroke="#3FA7A0" strokeWidth={1.5} fill="url(#cv)" animationDuration={1600} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Pending approvals: narrow editorial column */}
        <aside className="col-span-12 lg:col-span-4 lg:col-start-9" aria-label="Pending approvals">
          <div className="flex justify-between items-baseline mb-6"><p className="label">Awaiting your approval</p><Link to="/app/approvals" className="text-[12px] text-mute hover:text-bone flex items-center gap-1">Queue <Icon name="arrow" size={14} /></Link></div>
          <Count to={APPROVALS.length} className="display text-[96px] block mb-6" />
          <ul>{APPROVALS.slice(0, 3).map((a) => (
            <li key={a.id} className="row-draw py-4 hair-b"><Link to="/app/approvals" className="flex items-start justify-between gap-4">
              <span><span className="block text-[14px]">{a.action}</span><Mono className="text-mute">{a.tech} · {a.target.split('.')[0]}</Mono></span>
              <Badge tone={a.risk === 'high' ? 'crimson' : a.risk === 'medium' ? 'amber' : 'neutral'}>{a.risk}</Badge></Link></li>
          ))}</ul>
        </aside>

        {/* Loop strip */}
        <section className="col-span-12" aria-label="Loop stages">
          <p className="label mb-6">Closed loop · current operation OP-2419</p>
          <ol className="grid grid-cols-5 hair-t">
            {STAGES.map((s, i) => (
              <li key={s} className="pt-5 pr-6 relative">
                <i className="absolute top-0 left-0 h-px bg-crimson" style={{ width: `${loopHealth[i]}%` }} />
                <span className="font-mono text-[11px] text-mute">0{i + 1}</span>
                <p className="display text-[28px] mt-2">{s}</p>
                <Mono className="text-mute"><Count to={loopHealth[i]} suffix="%" /> complete</Mono>
              </li>
            ))}
          </ol>
        </section>

        <section className="col-span-12 lg:col-span-7" aria-label="Active operations">
          <p className="label mb-4">Active operations</p>
          {OPERATIONS.filter((o) => ['running', 'awaiting approval', 'queued'].includes(o.status)).map((o) => (
            <Link key={o.id} to={`/app/operations/${o.id}`} className="row-draw grid grid-cols-[84px_1fr_auto] gap-4 items-center py-4 hair-b">
              <Mono className="text-mute">{o.code}</Mono><span className="text-[14px]">{o.name}</span><StatusChip status={o.status} />
            </Link>
          ))}
        </section>
        <section className="col-span-12 lg:col-span-4 lg:col-start-9" aria-label="Open gaps">
          <p className="label mb-4">Open gaps</p>
          {gaps.map((g) => <div key={g.id} className="py-3 hair-b flex justify-between gap-3 text-[13px]"><span>{g.name}</span><Mono className="text-crimson-ink">{g.id}</Mono></div>)}
        </section>
        <section className="col-span-12" aria-label="Recent evidence">
          <p className="label mb-4">Recent evidence</p>
          <div className="grid md:grid-cols-3 gap-x-8">{HASH_ITEMS.slice(0, 3).map((e) => <div key={e.id} className="py-4 hair-t"><Mono className="text-mute">{e.id} · {e.kind}</Mono><p className="text-[14px] mt-1 truncate">{e.name}</p><Mono className="text-mute">{e.ts}</Mono></div>)}</div>
        </section>
      </div>
    </Screen>
  )
}
