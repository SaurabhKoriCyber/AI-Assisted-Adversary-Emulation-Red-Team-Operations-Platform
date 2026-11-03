import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge, HoldButton, Mono, Screen, Button, useToast } from '@/components/ui'
import { EASE_OUT, useMedia } from '@/lib/motion'
import { useAuth } from '@/lib/auth'

const riskTone = { high: 'crimson', medium: 'amber', low: 'neutral' } as const

type ApiApproval = {
  id: string
  engagement_id: string
  requester_id: string
  action: string
  technique_id: string
  target: string
  risk: 'low' | 'medium' | 'high'
  blast_radius: string
  rollback: string
  expires_at: string
  status: string
  decision_note: string | null
}

export default function Approvals() {
  const [list, setList] = useState<ApiApproval[]>([])
  const [sel, setSel] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const toast = useToast(); const mobile = useMedia('(max-width: 767px)')
  const { apiFetch, profile } = useAuth()
  const a = list.find((x) => x.id === sel) ?? list[0]

  useEffect(() => {
    if (!profile?.organizations.length) {
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    apiFetch<{ items: ApiApproval[]; next_cursor: string | null }>('/v1/approvals?status=pending')
      .then(({ items }) => { if (active) { setList(items); setSel(items[0]?.id ?? null); setLoadError('') } })
      .catch((error: unknown) => { if (active) setLoadError(error instanceof Error ? error.message : 'Unable to load approvals.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [apiFetch, profile?.organizations])

  const resolve = async (verb: 'approved' | 'denied' | 'modified') => {
    if (!a) return
    try {
      await apiFetch(`/v1/approvals/${a.id}/decision`, {
        method: 'POST',
        body: JSON.stringify({ decision: verb, note: verb === 'modified' ? 'Scope modification requested by approver.' : null }),
      })
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Decision could not be recorded.', 'crimson')
      return
    }
    toast(`${a.id} ${verb}. Decision recorded in the audit log.`, verb === 'approved' ? 'teal' : verb === 'denied' ? 'crimson' : 'amber')
    const rest = list.filter((x) => x.id !== a.id); setList(rest); if (rest[0]) setSel(rest[0].id)
  }
  const self = a?.requester_id === profile?.id
  return (
    <Screen eyebrow={mobile ? 'Approvals · mobile' : 'Approval Queue · human in the loop'} title={<>{loading ? '…' : list.length} awaiting<br /><span className="italic text-bone/60">your decision</span></>}>
      {loadError ? <p role="alert" className="text-[14px] text-crimson-ink">{loadError}</p> : loading ? <p role="status" className="text-[14px] text-mute">Loading approval queue…</p> : !a ? <div className="py-20"><p className="display text-[40px]">Queue clear.</p><p className="text-mute text-[14px] mt-3">No actions are waiting. New requests appear here with their risk summary.</p></div> : (
        <div className="grid grid-cols-12 gap-x-12 gap-y-10">
          <ul className="col-span-12 md:col-span-4" aria-label="Requests">
            {list.map((x) => (
              <li key={x.id}><button onClick={() => setSel(x.id)} aria-current={x.id === a.id} data-active={x.id === a.id}
                className="row-draw w-full text-left py-4 hair-b flex justify-between gap-4">
                <span><Mono className="text-mute">{x.id.slice(0, 8)} · {x.technique_id}</Mono><span className={`block text-[14px] mt-1 ${x.id === a.id ? 'text-bone' : 'text-mute'}`}>{x.action}</span></span>
                <Badge tone={riskTone[x.risk]}>{x.risk}</Badge></button></li>
            ))}
          </ul>
          <AnimatePresence mode="wait">
            <motion.article key={a.id} className="col-span-12 md:col-span-8 matte rounded-[4px] p-8 md:p-10" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
              <div className="flex justify-between items-start mb-8"><Mono className="text-mute">{a.id} · engagement {a.engagement_id.slice(0, 8)} · requester {a.requester_id.slice(0, 8)}</Mono><Badge tone={riskTone[a.risk]} dot>{a.risk} risk</Badge></div>
              <h2 className="display text-[44px] md:text-[56px] mb-3">{a.action}</h2>
              <Mono className="text-crimson-ink">{a.technique_id}</Mono>
              <dl className="mt-10 grid md:grid-cols-2 gap-x-10 gap-y-7 text-[14px]">
                {[['Target', a.target], ['Blast radius', a.blast_radius], ['Rollback', a.rollback], ['Expires', new Date(a.expires_at).toLocaleString()], ['Scope check', 'Target validated against the engagement IP scope.']].map(([k, v]) => (
                  <div key={k} className={`hair-t pt-4 ${k === 'Scope check' ? 'md:col-span-2' : ''}`}><dt className="label mb-2">{k}</dt><dd className={k === 'Target' ? 'font-mono text-[13px]' : ''}>{v}</dd></div>
                ))}
              </dl>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <HoldButton label="Approve" tone="teal" onConfirm={() => void resolve('approved')} disabled={self} />
                <HoldButton label="Deny" tone="crimson" onConfirm={() => void resolve('denied')} disabled={self} />
                <Button onClick={() => void resolve('modified')} disabled={self}>Modify scope</Button>
              </div>
              {self && <p role="note" className="mt-6 text-[13px] text-amber">Separation of duties: you requested this action, so you cannot approve or modify it. Another Approver must decide.</p>}
            </motion.article>
          </AnimatePresence>
        </div>
      )}
    </Screen>
  )
}
