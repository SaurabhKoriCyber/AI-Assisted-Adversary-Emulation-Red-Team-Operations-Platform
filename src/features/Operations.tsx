import { Link, useNavigate, useParams } from 'react-router'
import { Badge, DataTable, Mono, Screen, StatusChip, Count } from '@/components/ui'
import { OPERATIONS, STAGES } from '@/data/mock'

export function OperationsList() {
  const nav = useNavigate()
  return (
    <Screen eyebrow="Operations" title={<>Every run,<br /><span className="italic text-bone/60">on the record</span></>}>
      <DataTable label="Operations" rows={OPERATIONS} onOpen={(o) => nav(`/app/operations/${o.id}`)}
        cols={[
          { key: 'c', head: 'Code', w: '90px', cell: (o) => <Mono className="text-mute">{o.code}</Mono> },
          { key: 'n', head: 'Operation', w: '2.2fr', cell: (o) => o.name },
          { key: 'e', head: 'Engine', w: '1fr', cell: (o) => <span className="text-mute">{o.engine}</span> },
          { key: 't', head: 'Detected', w: '90px', align: 'right', cell: (o) => <Mono>{o.detected}/{o.techniques}</Mono> },
          { key: 's', head: 'Status', w: '170px', cell: (o) => <StatusChip status={o.status} /> },
        ]} />
    </Screen>
  )
}
export function OperationDetail() {
  const { id } = useParams(); const o = OPERATIONS.find((x) => x.id === id) ?? OPERATIONS[0]
  return (
    <Screen eyebrow={`Operations / ${o.code}`} title={o.name} aside={<StatusChip status={o.status} />}>
      <div className="grid grid-cols-12 gap-x-12 gap-y-14">
        <section className="col-span-12 lg:col-span-8" aria-label="Loop timeline">
          <p className="label mb-6">Loop timeline</p>
          <ol className="relative">
            {STAGES.map((s, i) => { const done = i < o.stage || o.status === 'completed'; const cur = i === o.stage && o.status !== 'completed'
              return (
                <li key={s} className="grid grid-cols-[48px_1fr_auto] gap-4 py-6 hair-b items-baseline">
                  <Mono className="text-mute">0{i + 1}</Mono>
                  <div><p className={`display text-[32px] ${!done && !cur ? 'text-mute/60' : ''}`}>{s}</p>
                    <p className="text-[13px] text-mute mt-1">{['Technique dispatched to runner rn-eu-02 after approval', 'Sysmon and Security events bound to this operation', 'Matched against 214 active Sigma rules', 'Artefacts hashed and chained', 'Executive and technical report generated'][i]}</p></div>
                  <Badge tone={done ? 'teal' : cur ? 'bone' : 'neutral'} dot>{done ? 'complete' : cur ? 'in progress' : 'pending'}</Badge>
                </li>) })}
          </ol>
        </section>
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-10" aria-label="Scope and rules of engagement">
          <div><p className="label mb-4">Result</p><Count to={o.detected} className="display text-[88px]" /><span className="display text-[40px] text-mute"> / {o.techniques}</span><p className="text-[13px] text-mute mt-1">techniques detected</p></div>
          <div className="matte rounded-[4px] p-6 text-[13px] flex flex-col gap-4">
            <p className="label">Scope · ENG-0087</p>
            <div><p className="text-mute">In scope</p><Mono>10.20.4.0/24 · 10.20.8.0/24</Mono></div>
            <div><p className="text-mute">Out of scope</p><Mono>10.20.1.0/24 (production payments)</Mono></div>
            <div><p className="text-mute">Window</p><Mono>{o.window}</Mono></div>
            <div><p className="text-mute">Rules of engagement</p><p>No destructive impact techniques. No data leaves the tenant. Kill switch armed and tested 13 Apr.</p></div>
            <div><p className="text-mute">Lead</p><p>{o.lead}</p></div>
          </div>
          <Link to="/app/evidence" className="text-[13px] text-mute hover:text-bone">View evidence for {o.code} →</Link>
        </aside>
      </div>
    </Screen>
  )
}
