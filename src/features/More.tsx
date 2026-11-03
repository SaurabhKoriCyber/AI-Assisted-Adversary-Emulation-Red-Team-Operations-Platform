import { useEffect, useState } from 'react'
import { Badge, Button, Chip, DataTable, Field, Mono, Screen, Tabs, cx, inputCls, useToast, Count } from '@/components/ui'
import { AUDIT, EVENTS, GAP_SUGGEST, HASH_ITEMS, STREAM_POOL, TEAM, TECHNIQUES, type Evt } from '@/data/mock'
import { Icon } from '@/components/ui/Icon'

/* ---------------- Planner ---------------- */
export function Planner() {
  const [sel, setSel] = useState<string[]>(['T1003.001', 'T1550.002']); const [dry, setDry] = useState(false); const toast = useToast()
  const picks = TECHNIQUES.filter((t) => sel.includes(t.id))
  return (
    <Screen eyebrow="Emulation Planner" title={<>Choose the techniques,<br /><span className="italic text-bone/60">preview the run</span></>}>
      <div className="grid grid-cols-12 gap-x-12 gap-y-10">
        <section className="col-span-12 lg:col-span-5" aria-label="Technique library">
          <p className="label mb-4">Technique library</p>
          <ul className="max-h-[520px] overflow-y-auto">{TECHNIQUES.slice(0, 24).map((t) => {
            const on = sel.includes(t.id)
            return <li key={t.id}><button onClick={() => { setDry(false); setSel(on ? sel.filter((x) => x !== t.id) : [...sel, t.id]) }} aria-pressed={on} data-active={on}
              className="row-draw w-full text-left py-3 hair-b flex items-center gap-4"><span className={cx('size-3.5 border', on ? 'bg-crimson border-crimson' : 'border-line-2')} /><Mono className="w-20 text-mute">{t.id}</Mono><span className="text-[13px]">{t.name}</span></button></li>
          })}</ul>
        </section>
        <section className="col-span-12 lg:col-span-7" aria-label="Plan">
          <p className="label mb-4">Mapped tests · {picks.length}</p>
          {picks.map((t) => <div key={t.id} className="grid grid-cols-[84px_1fr] gap-4 py-4 hair-b text-[13px]"><Mono className="text-crimson-ink">{t.id}</Mono><div><p>{t.name}</p><Mono className="text-mute block mt-1">{t.atomic}</Mono><Mono className="text-mute block">{t.caldera}</Mono></div></div>)}
          {!picks.length && <p className="text-mute text-[14px] py-6">No techniques selected. Pick from the library to build a plan.</p>}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <Field id="win" label="Schedule window"><input id="win" className={inputCls} defaultValue="15 Apr 2025 09:00 – 13:00 UTC" /></Field>
            <Field id="run" label="Runner" hint="Customer-hosted runner inside the signed scope."><select id="run" className={inputCls}><option>rn-eu-02 · Frankfurt</option><option>rn-eu-03 · Dublin</option></select></Field>
          </div>
          <div className="mt-8 flex gap-3"><Button disabled={!picks.length} onClick={() => setDry(true)}>Dry-run preview</Button><Button variant="primary" disabled={!dry} onClick={() => toast('Plan submitted. 2 approvals requested (mock).', 'amber')}>Submit for approval</Button></div>
          {dry && <pre className="mt-6 matte p-5 rounded-[4px] font-mono text-[12px] leading-relaxed text-mute overflow-x-auto">{`DRY RUN · nothing executed\n${picks.map((t) => `✓ scope   ${t.id}  target in ENG-0087 §2.1\n✓ roe     ${t.id}  allowed (§4.3)\n• approval ${t.id}  required before dispatch`).join('\n')}\nkill switch: armed · window: open`}</pre>}
        </section>
      </div>
    </Screen>
  )
}

/* ---------------- Telemetry ---------------- */
export function Telemetry() {
  const [rows, setRows] = useState<Evt[]>(EVENTS); const [sel, setSel] = useState<Evt>(EVENTS[2]); const [live, setLive] = useState(true)
  useEffect(() => {
    if (!live) return; let i = 0
    const t = setInterval(() => { const p = STREAM_POOL[i++ % STREAM_POOL.length]; const d = new Date(); setRows((r) => [{ ...p, id: `s${Date.now()}`, ts: d.toISOString().slice(11, 23) }, ...r].slice(0, 40)) }, 2600)
    return () => clearInterval(t)
  }, [live])
  const missed = rows.filter((r) => r.match === 'missed' && r.tech)
  const seen = new Set<string>()
  return (
    <Screen eyebrow="Telemetry & Detections · live" title={<>The stream,<br /><span className="italic text-bone/60">and what it missed</span></>}
      aside={<Button onClick={() => setLive(!live)}><Icon name={live ? 'pause' : 'play'} size={14} />{live ? 'Pause stream' : 'Resume stream'}</Button>}>
      <div className="grid grid-cols-12 gap-x-10 gap-y-10">
        <section className="col-span-12 lg:col-span-7" aria-label="Event stream" aria-live="off">
          <div role="log" className="font-mono text-[12px]">{rows.map((r) => (
            <button key={r.id} onClick={() => setSel(r)} data-active={sel.id === r.id}
              className={cx('row-draw tick-in w-full grid grid-cols-[96px_104px_1fr_auto] gap-3 py-2.5 hair-b text-left items-center', r.match === 'missed' && 'bg-crimson/[0.05]')}>
              <span className="text-mute num">{r.ts}</span><span>{r.host}</span><span className="truncate text-mute">{r.msg}</span>
              {r.match ? <span className={r.match === 'matched' ? 'text-teal' : 'text-crimson-ink'}>{r.match === 'matched' ? 'matched' : 'missed'}</span> : <span />}
            </button>))}</div>
        </section>
        <aside className="col-span-12 lg:col-span-5 flex flex-col gap-10">
          <div className="matte rounded-[4px] p-6" aria-label="Event inspector"><p className="label mb-4">Event inspector</p>
            <Mono className="block text-bone mb-4">{sel.host} · {sel.src}</Mono><p className="text-[14px] mb-5 break-words">{sel.msg}</p>
            <dl className="grid grid-cols-2 gap-4 text-[12px]"><div><dt className="label mb-1">Technique</dt><dd className="font-mono">{sel.tech ?? 'Unmapped'}</dd></div><div><dt className="label mb-1">Rule result</dt><dd className={sel.match === 'missed' ? 'text-crimson-ink' : sel.match ? 'text-teal' : 'text-mute'}>{sel.match ?? 'Not evaluated'}</dd></div></dl></div>
          <div><p className="label mb-4 !text-crimson-ink">Missed detections · suggested rule gaps</p>
            {missed.filter((m) => !seen.has(m.tech!) && seen.add(m.tech!)).map((m) => (
              <div key={m.tech} className="py-4 hair-b"><Mono className="text-crimson-ink">{m.tech}</Mono><p className="text-[13px] mt-1">{GAP_SUGGEST[m.tech!] ?? 'Telemetry present with no matching rule. Review field mappings.'}</p></div>))}</div>
        </aside>
      </div>
    </Screen>
  )
}

/* ---------------- Evidence (real SHA-256 chain computed in-browser) ---------------- */
async function sha(s: string) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('') }
export function Evidence() {
  const [hashes, setHashes] = useState<string[]>([]); const [tamper, setTamper] = useState(false)
  useEffect(() => { (async () => { let prev = '0'.repeat(64); const out: string[] = []
    for (const it of HASH_ITEMS) { const body = `${it.id}|${it.name}|${it.size}|${it.ts}`; const h = await sha(prev + body); out.push(h); prev = h }
    setHashes(out) })() }, [])
  // Verify: recompute with optional tampering of item 3 and compare
  const [broken, setBroken] = useState<number | null>(null)
  useEffect(() => { (async () => { let prev = '0'.repeat(64)
    for (let i = 0; i < HASH_ITEMS.length; i++) { const it = HASH_ITEMS[i]; const name = tamper && i === 2 ? it.name + '.edited' : it.name
      const h = await sha(prev + `${it.id}|${name}|${it.size}|${it.ts}`); if (hashes[i] && h !== hashes[i]) { setBroken(i); return } prev = h }
    setBroken(null) })() }, [tamper, hashes])
  return (
    <Screen eyebrow="Evidence Vault · ENG-0087" title={<>Sealed, linked,<br /><span className="italic text-bone/60">verifiable</span></>}
      aside={<div className="flex items-center gap-4">{broken === null ? <Badge tone="teal" dot>chain intact</Badge> : <Badge tone="crimson" dot>break at ev-000{broken + 1}</Badge>}<Button onClick={() => setTamper(!tamper)}>{tamper ? 'Restore' : 'Simulate tampering'}</Button></div>}>
      <div className="grid grid-cols-12 gap-x-12 gap-y-12">
        <section className="col-span-12 lg:col-span-8" aria-label="Hash chain">
          <p className="label mb-4">Hash chain · SHA-256, each link includes the previous hash</p>
          {HASH_ITEMS.map((it, i) => (
            <div key={it.id} className={cx('py-5 hair-b grid grid-cols-[72px_1fr] gap-4', broken !== null && i >= broken && 'bg-crimson/[0.05]')}>
              <Mono className="text-mute">{it.id}</Mono>
              <div><div className="flex justify-between gap-4"><span className="text-[14px] truncate">{it.name}</span><span className="label">{it.kind} · {it.size}</span></div>
                <Mono className="block text-mute mt-2 break-all">prev {i ? hashes[i - 1]?.slice(0, 16) : '0000000000000000'}…</Mono>
                <Mono className={cx('block mt-1 break-all', broken !== null && i >= broken ? 'text-crimson-ink' : 'text-teal')}>{hashes[i] ? hashes[i].slice(0, 48) + '…' : 'computing…'}</Mono></div>
            </div>))}
        </section>
        <aside className="col-span-12 lg:col-span-4" aria-label="Chain of custody"><p className="label mb-6">Chain of custody</p>
          <ol className="relative border-l border-line-2 ml-1 pl-6 flex flex-col gap-6">{HASH_ITEMS.map((it) => <li key={it.id} className="relative"><i className="absolute -left-[29px] top-1.5 size-1.5 bg-bone" /><Mono className="text-mute">{it.ts}</Mono><p className="text-[13px] mt-1">{it.id} captured by {it.actor}</p></li>)}</ol>
          <p className="text-[12px] text-mute mt-8">Hashes are computed in your browser from the fixture records to demonstrate verification. Production hashing runs server-side.</p></aside>
      </div>
    </Screen>
  )
}

/* ---------------- Reports ---------------- */
export function Reports() {
  const [kind, setKind] = useState('exec'); const [inc, setInc] = useState({ sum: true, cov: true, gaps: true, evid: false })
  const keys = [['sum', 'Summary'], ['cov', 'Coverage by tactic'], ['gaps', 'Open gaps and fixes'], ['evid', 'Evidence appendix']] as const
  return (
    <Screen eyebrow="Reports" title={<>Built from the<br /><span className="italic text-bone/60">same evidence</span></>} aside={<Button variant="primary" onClick={() => window.print()}>Export PDF</Button>}>
      <div className="grid grid-cols-12 gap-x-12 gap-y-10">
        <section className="col-span-12 lg:col-span-5">
          <Tabs value={kind} onChange={setKind} items={[{ id: 'exec', label: 'Executive' }, { id: 'tech', label: 'Technical' }]} />
          <fieldset className="mt-8"><legend className="label mb-4">Sections</legend>{keys.map(([k, l]) => (
            <label key={k} className="flex items-center gap-4 py-3 hair-b text-[14px] cursor-pointer"><input type="checkbox" className="accent-[#C1121F] size-4" checked={inc[k]} onChange={() => setInc({ ...inc, [k]: !inc[k] })} />{l}</label>))}</fieldset>
          <div className="mt-8"><Field id="ttl" label="Report title"><input id="ttl" className={inputCls} defaultValue="Purple team assessment · Q2 2025" /></Field></div>
        </section>
        <section className="col-span-12 lg:col-span-7 flex justify-center">
          <div className="print-area bg-white text-[#111] w-full max-w-[520px] aspect-[1/1.414] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,.9)] overflow-hidden" aria-label="A4 preview">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#666]">REDOPS · {kind === 'exec' ? 'Executive' : 'Technical'} report · ENG-0087</p>
            <h3 className="mt-6 text-[30px] leading-[1.02] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Purple team assessment, Q2 2025</h3>
            {inc.sum && <p className="mt-6 text-[11px] leading-relaxed text-[#333]">Of 31 techniques emulated against Northwind Financial, 68.4% produced a detection. Nine techniques generated telemetry without an alert. Four are rated high priority.</p>}
            {inc.cov && <div className="mt-6 flex flex-col gap-1.5">{[['Credential Access', 75], ['Lateral Movement', 50], ['Execution', 75], ['Persistence', 50]].map(([n, v]) => <div key={n as string} className="grid grid-cols-[110px_1fr_30px] gap-2 items-center text-[9px]"><span>{n}</span><i className="h-1 bg-[#ddd] relative"><i className="absolute inset-y-0 left-0 bg-[#2a8a83]" style={{ width: `${v}%` }} /></i><span className="font-mono">{v}%</span></div>)}</div>}
            {inc.gaps && <div className="mt-6 text-[10px]"><p className="font-semibold mb-1">Open gaps</p>{['T1550.002 Pass the Hash', 'T1558.003 Kerberoasting', 'T1570 Lateral Tool Transfer'].map((g) => <p key={g} className="font-mono py-1 border-t border-[#ddd]">{g}</p>)}</div>}
            {inc.evid && kind === 'tech' && <div className="mt-6 text-[9px] font-mono text-[#555]">{HASH_ITEMS.slice(0, 3).map((h) => <p key={h.id}>{h.id} {h.name}</p>)}</div>}
            {inc.evid && kind === 'exec' && <p className="mt-6 text-[9px] text-[#777]">Evidence appendix is available in the technical report.</p>}
          </div>
        </section>
      </div>
    </Screen>
  )
}

/* ---------------- Admin screens ---------------- */
export function Billing() {
  const use = [['Seats', 5, 10], ['Engagements', 3, 5], ['Runners', 2, 3], ['Telemetry retention (days)', 90, 90]]
  return (
    <Screen eyebrow="Billing & usage" title={<>Team plan,<br /><span className="italic text-bone/60">test mode</span></>}>
      <div className="grid grid-cols-12 gap-x-12 gap-y-10">
        <section className="col-span-12 lg:col-span-7">{use.map(([l, v, m]) => (<div key={l as string} className="py-5 hair-b"><div className="flex justify-between text-[14px] mb-3"><span>{l}</span><Mono>{v} / {m}</Mono></div><i className="block h-px bg-line-2 relative"><i className="absolute inset-y-0 left-0 h-px bg-bone" style={{ width: `${((v as number) / (m as number)) * 100}%` }} /></i></div>))}</section>
        <aside className="col-span-12 lg:col-span-4 lg:col-start-9"><p className="label mb-3">Next invoice · 01 May</p><p className="display text-[64px] num">€1,490</p><p className="text-[13px] text-mute mt-2">Billing runs in Stripe test mode. No real charges are made.</p></aside>
      </div>
    </Screen>
  )
}
export function Team() {
  return (
    <Screen eyebrow="Team & roles" title={<>Who may do<br /><span className="italic text-bone/60">what</span></>}>
      <DataTable label="Members" rows={TEAM} cols={[
        { key: 'n', head: 'Member', w: '1.4fr', cell: (u) => u.name }, { key: 'e', head: 'Email', w: '2fr', cell: (u) => <Mono className="text-mute">{u.email}</Mono> },
        { key: 'r', head: 'Role', w: '1.2fr', cell: (u) => <Badge tone={u.role === 'Owner' ? 'bone' : 'neutral'}>{u.role}</Badge> },
        { key: 'm', head: 'MFA', w: '120px', cell: (u) => u.mfa ? <Badge tone="teal">enrolled</Badge> : <Badge tone="amber">required</Badge> }]} />
      <p className="text-[13px] text-mute mt-8 max-w-[560px]">Approvers and Admins must enrol MFA. The person who requests a high-risk action cannot approve it.</p>
    </Screen>
  )
}
export function Integrations() {
  const list = [['Caldera', 'Emulation engine', 'connected', 'v5.0.0 · rn-eu-02'], ['Atomic Red Team', 'Emulation library', 'connected', 'Atomics index 2025-04-02'], ['Splunk Enterprise', 'SIEM', 'connected', 'HEC · 214 rules'], ['CrowdStrike Falcon', 'EDR', 'degraded', 'Rate limited · retry in 4 min'], ['Jira', 'Ticketing', 'not connected', 'Gap tickets']]
  return (
    <Screen eyebrow="Integrations" title={<>Engines and<br /><span className="italic text-bone/60">sources</span></>}>
      {list.map(([n, k, s, d]) => <div key={n} className="row-draw grid grid-cols-[1.4fr_1fr_1.6fr_auto] gap-4 py-5 hair-b items-center text-[14px]"><span>{n}</span><span className="text-mute">{k}</span><Mono className="text-mute">{d}</Mono><Badge tone={s === 'connected' ? 'teal' : s === 'degraded' ? 'amber' : 'neutral'} dot>{s}</Badge></div>)}
    </Screen>
  )
}
export function Audit() {
  return (
    <Screen eyebrow="Audit log · append-only" title={<>Every decision,<br /><span className="italic text-bone/60">recorded</span></>}>
      <DataTable label="Audit log" rows={AUDIT} cols={[{ key: 't', head: 'Timestamp (UTC)', w: '180px', cell: (a) => <Mono className="text-mute">{a.ts}</Mono> }, { key: 'a', head: 'Actor', w: '1fr', cell: (a) => a.actor },
        { key: 'x', head: 'Action', w: '1.3fr', cell: (a) => <Mono>{a.action}</Mono> }, { key: 'o', head: 'Object', w: '2fr', cell: (a) => <Mono className="text-mute">{a.obj}</Mono> }, { key: 'i', head: 'Source', w: '130px', cell: (a) => <Mono className="text-mute">{a.ip}</Mono> }]} />
    </Screen>
  )
}
export function Settings() {
  const toast = useToast(); const [name, setName] = useState('Northwind Financial'); const err = name.trim().length < 3 ? 'Use at least 3 characters.' : undefined
  return (
    <Screen eyebrow="Settings" title={<>Organisation<br /><span className="italic text-bone/60">and safeguards</span></>}>
      <form className="max-w-[520px] flex flex-col gap-8" onSubmit={(e) => { e.preventDefault(); toast('Settings saved (mock).', 'teal') }}>
        <Field id="org" label="Organisation name" error={err}><input id="org" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!err} aria-describedby={err ? 'org-e' : undefined} /></Field>
        <Field id="ret" label="Telemetry retention" hint="Plan allows up to 90 days."><select id="ret" className={inputCls} defaultValue="90"><option value="30">30 days</option><option value="90">90 days</option></select></Field>
        <div className="hair-t pt-6"><p className="label mb-3">Kill switch · ENG-0087</p><p className="text-[13px] text-mute mb-4">Stops all queued and running jobs for this engagement within seconds.</p><Button type="button" onClick={() => toast('Kill switch armed (mock).', 'crimson')}>Arm kill switch</Button></div>
        <Button variant="primary" type="submit" disabled={!!err}>Save changes</Button>
      </form>
    </Screen>
  )
}
export { Count, Chip }
