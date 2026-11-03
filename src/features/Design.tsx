import { useState } from 'react'
import { Badge, Button, Chip, Count, DataTable, Field, HoldButton, Mono, SkeletonRows, SlideOver, StateBlock, StatusChip, Tabs, Tooltip, inputCls, useToast } from '@/components/ui'
import { Icon, type IconName } from '@/components/ui/Icon'
import { color } from '@/design/tokens'

const icons: IconName[] = ['loop', 'command', 'ops', 'path', 'matrix', 'planner', 'approval', 'telemetry', 'vault', 'report', 'billing', 'team', 'plug', 'audit', 'settings', 'search', 'lock', 'hash', 'alert', 'filter']
const S = ({ t, children }: { t: string; children: React.ReactNode }) => <section className="py-12 hair-t"><p className="label mb-8">{t}</p>{children}</section>
export default function Design() {
  const [tab, setTab] = useState('a'); const [so, setSo] = useState(false); const toast = useToast()
  return (
    <div className="px-6 md:px-12 py-16 max-w-[1200px]">
      <h1 className="display text-[96px] mb-4">Design system</h1><p className="text-mute max-w-[520px] mb-12">Tokens and components in every state. Accent crimson marks active and gap; teal marks detected only; amber marks warnings only.</p>
      <S t="Colour">{<div className="grid grid-cols-5 gap-4">{Object.entries(color).filter(([k]) => k !== 'line').map(([k, v]) => <div key={k}><i className="block h-16 border border-line-2" style={{ background: v }} /><Mono className="block mt-2">{k}</Mono><Mono className="text-mute">{v}</Mono></div>)}</div>}</S>
      <S t="Type"><p className="display text-[96px]">Close the loop</p><p className="text-[16px] mt-4">Inter Tight, interface text at 14 and 16.</p><Mono className="block mt-2">JetBrains Mono · T1059.001 · sha256 9f2c41…a41e · 08:14:02.118</Mono></S>
      <S t="Buttons">{<div className="flex flex-wrap gap-4"><Button variant="primary" magnetic>Primary</Button><Button>Ghost</Button><Button variant="quiet">Quiet</Button><Button disabled>Disabled</Button><Button size="sm">Small</Button></div>}</S>
      <S t="Approval hold-to-confirm"><div className="flex gap-4"><HoldButton label="Approve" onConfirm={() => toast("Confirmed (demo).", "teal")} /><HoldButton label="Deny" tone="crimson" onConfirm={() => toast("Denied (demo).", "crimson")} /><HoldButton label="Unavailable" disabled onConfirm={() => {}} /></div></S>
      <S t="Badges, chips, status"><div className="flex flex-wrap gap-3 items-center"><Badge>neutral</Badge><Badge tone="teal" dot>detected</Badge><Badge tone="crimson" dot>gap</Badge><Badge tone="amber" dot>warning</Badge><Chip>Filter</Chip><Chip active>Active</Chip>{(['queued', 'running', 'awaiting approval', 'completed', 'failed', 'blocked'] as const).map((s) => <StatusChip key={s} status={s} />)}</div></S>
      <S t="Tabs and tooltip"><Tabs value={tab} onChange={setTab} items={[{ id: 'a', label: 'Overview' }, { id: 'b', label: 'Timeline' }, { id: 'c', label: 'Evidence' }]} /><div className="mt-6"><Tooltip text="Tooltips appear on hover and focus"><Button size="sm">Hover or focus me</Button></Tooltip></div></S>
      <S t="Form fields"><div className="grid md:grid-cols-3 gap-6"><Field id="d1" label="Default"><input id="d1" className={inputCls} placeholder="Value" /></Field><Field id="d2" label="With error" error="Scope must be a valid CIDR range."><input id="d2" aria-invalid="true" className={inputCls} defaultValue="10.20.4.0/33" /></Field><Field id="d3" label="Disabled"><input id="d3" disabled className={inputCls + ' opacity-40'} /></Field></div></S>
      <S t="Numbers"><Count to={68.4} decimals={1} suffix="%" className="display text-[72px]" /></S>
      <S t="Table"><DataTable label="Sample" rows={[{ id: '1', a: 'T1003.001', b: 'LSASS Memory' }, { id: '2', a: 'T1059.001', b: 'PowerShell' }]} cols={[{ key: 'a', head: 'ID', w: '140px', cell: (r) => <Mono>{r.a}</Mono> }, { key: 'b', head: 'Technique', cell: (r) => r.b }]} /></S>
      <S t="Overlays"><div className="flex gap-4"><Button onClick={() => setSo(true)}>Open slide-over</Button><Button onClick={() => toast('Evidence ev-0006 sealed.', 'teal')}>Show toast</Button></div><SlideOver open={so} onClose={() => setSo(false)} title="Slide-over" eyebrow="Component"><p className="text-mute text-[14px]">Focus is trapped to the dialog. Escape closes it and returns focus.</p></SlideOver></S>
      <S t="Skeleton (loading)"><SkeletonRows rows={4} /></S>
      <S t="Empty / error / permission denied"><div className="grid md:grid-cols-3 gap-8"><StateBlock kind="empty" /><StateBlock kind="error" /><StateBlock kind="denied" /></div></S>
      <S t="Iconography · 1.5px stroke"><div className="grid grid-cols-10 gap-6 text-bone">{icons.map((i) => <Tooltip key={i} text={i}><span tabIndex={0}><Icon name={i} size={24} /></span></Tooltip>)}</div></S>
    </div>
  )
}
