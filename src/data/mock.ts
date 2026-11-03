/**
 * MOCK DATA ADAPTER. Everything exported here is fixture data shaped like the planned API.
 * Replace with real API calls when the backend exists. Nothing here is live.
 */
export type CovStatus = 'detected' | 'gap' | 'untested'
export type Technique = {
  id: string; name: string; tactic: string; platform: string[]; source: string; status: CovStatus
  atomic: string; caldera: string; telemetry: string; rule: string; result: string
}
export const TACTICS = ['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 'Defense Evasion', 'Credential Access', 'Discovery', 'Lateral Movement', 'Collection', 'Exfiltration', 'Impact'] as const
export const PLATFORMS = ['Windows', 'Linux', 'macOS'] as const
export const SOURCES = ['Process Creation', 'Windows Event Log', 'Network Traffic', 'Registry', 'File Monitoring', 'Authentication'] as const

type Seed = [string, string, string, string[], string, number]
const seeds: Seed[] = [
  ['T1566.001', 'Spearphishing Attachment', 'Initial Access', ['Windows', 'macOS'], 'File Monitoring', 0],
  ['T1190', 'Exploit Public-Facing Application', 'Initial Access', ['Linux', 'Windows'], 'Network Traffic', 1],
  ['T1078', 'Valid Accounts', 'Initial Access', ['Windows', 'Linux'], 'Authentication', 0],
  ['T1133', 'External Remote Services', 'Initial Access', ['Windows', 'Linux'], 'Authentication', 2],
  ['T1059.001', 'PowerShell', 'Execution', ['Windows'], 'Process Creation', 0],
  ['T1059.003', 'Windows Command Shell', 'Execution', ['Windows'], 'Process Creation', 0],
  ['T1047', 'Windows Management Instrumentation', 'Execution', ['Windows'], 'Process Creation', 1],
  ['T1053.005', 'Scheduled Task', 'Execution', ['Windows'], 'Windows Event Log', 0],
  ['T1547.001', 'Registry Run Keys', 'Persistence', ['Windows'], 'Registry', 0],
  ['T1543.003', 'Windows Service', 'Persistence', ['Windows'], 'Windows Event Log', 1],
  ['T1136.001', 'Local Account', 'Persistence', ['Windows', 'Linux'], 'Authentication', 2],
  ['T1505.003', 'Web Shell', 'Persistence', ['Linux', 'Windows'], 'File Monitoring', 1],
  ['T1055.001', 'DLL Injection', 'Privilege Escalation', ['Windows'], 'Process Creation', 1],
  ['T1548.002', 'Bypass User Account Control', 'Privilege Escalation', ['Windows'], 'Registry', 0],
  ['T1068', 'Exploitation for Privilege Escalation', 'Privilege Escalation', ['Linux', 'Windows'], 'Process Creation', 2],
  ['T1134.001', 'Token Impersonation/Theft', 'Privilege Escalation', ['Windows'], 'Windows Event Log', 1],
  ['T1562.001', 'Disable or Modify Tools', 'Defense Evasion', ['Windows', 'Linux'], 'Registry', 0],
  ['T1070.001', 'Clear Windows Event Logs', 'Defense Evasion', ['Windows'], 'Windows Event Log', 0],
  ['T1027', 'Obfuscated Files or Information', 'Defense Evasion', ['Windows', 'Linux'], 'File Monitoring', 1],
  ['T1218.011', 'Rundll32', 'Defense Evasion', ['Windows'], 'Process Creation', 1],
  ['T1003.001', 'LSASS Memory', 'Credential Access', ['Windows'], 'Process Creation', 0],
  ['T1003.002', 'Security Account Manager', 'Credential Access', ['Windows'], 'Registry', 1],
  ['T1558.003', 'Kerberoasting', 'Credential Access', ['Windows'], 'Authentication', 1],
  ['T1110.003', 'Password Spraying', 'Credential Access', ['Windows', 'Linux'], 'Authentication', 0],
  ['T1087.002', 'Domain Account', 'Discovery', ['Windows'], 'Process Creation', 0],
  ['T1018', 'Remote System Discovery', 'Discovery', ['Windows', 'Linux'], 'Network Traffic', 2],
  ['T1082', 'System Information Discovery', 'Discovery', ['Windows', 'Linux', 'macOS'], 'Process Creation', 2],
  ['T1046', 'Network Service Discovery', 'Discovery', ['Linux', 'Windows'], 'Network Traffic', 0],
  ['T1021.002', 'SMB/Windows Admin Shares', 'Lateral Movement', ['Windows'], 'Network Traffic', 0],
  ['T1021.001', 'Remote Desktop Protocol', 'Lateral Movement', ['Windows'], 'Authentication', 0],
  ['T1550.002', 'Pass the Hash', 'Lateral Movement', ['Windows'], 'Authentication', 1],
  ['T1570', 'Lateral Tool Transfer', 'Lateral Movement', ['Windows', 'Linux'], 'File Monitoring', 1],
  ['T1005', 'Data from Local System', 'Collection', ['Windows', 'Linux', 'macOS'], 'File Monitoring', 2],
  ['T1560.001', 'Archive via Utility', 'Collection', ['Windows', 'Linux'], 'Process Creation', 1],
  ['T1113', 'Screen Capture', 'Collection', ['Windows', 'macOS'], 'Process Creation', 2],
  ['T1041', 'Exfiltration Over C2 Channel', 'Exfiltration', ['Windows', 'Linux'], 'Network Traffic', 0],
  ['T1048.003', 'Exfil Over Unencrypted Protocol', 'Exfiltration', ['Linux', 'Windows'], 'Network Traffic', 1],
  ['T1567.002', 'Exfiltration to Cloud Storage', 'Exfiltration', ['Windows', 'Linux'], 'Network Traffic', 2],
  ['T1486', 'Data Encrypted for Impact', 'Impact', ['Windows', 'Linux'], 'File Monitoring', 1],
  ['T1490', 'Inhibit System Recovery', 'Impact', ['Windows'], 'Process Creation', 0],
  ['T1489', 'Service Stop', 'Impact', ['Windows', 'Linux'], 'Windows Event Log', 2],
]
const st: CovStatus[] = ['detected', 'gap', 'untested']
export const TECHNIQUES: Technique[] = seeds.map(([id, name, tactic, platform, source, s], i) => {
  const status = st[s]
  return {
    id, name, tactic, platform, source, status,
    atomic: `Atomic Red Team ${id} · test #${(i % 4) + 1}`,
    caldera: `Caldera ability · ${name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
    telemetry: source === 'Process Creation' ? 'Sysmon EID 1, Security 4688' : source === 'Authentication' ? 'Security 4624/4625/4768' : source === 'Registry' ? 'Sysmon EID 12/13' : source === 'File Monitoring' ? 'Sysmon EID 11, EDR file events' : source === 'Network Traffic' ? 'Zeek conn.log, EDR network' : 'Security 7045, 4698',
    rule: status === 'untested' ? 'Not evaluated' : `sigma/${tactic.toLowerCase().replace(/ /g, '_')}/${id.toLowerCase().replace('.', '_')}`,
    result: status === 'detected' ? 'Alert fired in 11s' : status === 'gap' ? 'Telemetry present, no alert' : 'No test executed',
  }
})
export const coverage = () => {
  const d = TECHNIQUES.filter((t) => t.status === 'detected').length
  const g = TECHNIQUES.filter((t) => t.status === 'gap').length
  const u = TECHNIQUES.length - d - g
  return { detected: d, gap: g, untested: u, pct: (d / (d + g)) * 100, total: TECHNIQUES.length }
}

export type Operation = { id: string; code: string; name: string; status: 'queued' | 'running' | 'awaiting approval' | 'completed' | 'failed' | 'blocked'; engine: 'Caldera' | 'Atomic Red Team'; lead: string; techniques: number; detected: number; window: string; stage: number }
export const OPERATIONS: Operation[] = [
  { id: 'op-2419', code: 'OP-2419', name: 'Finance segment credential theft', status: 'running', engine: 'Caldera', lead: 'M. Okafor', techniques: 14, detected: 9, window: '14 Apr 08:00 – 18:00 UTC', stage: 2 },
  { id: 'op-2418', code: 'OP-2418', name: 'Domain controller lateral movement', status: 'awaiting approval', engine: 'Caldera', lead: 'S. Lindqvist', techniques: 9, detected: 0, window: '15 Apr 09:00 – 13:00 UTC', stage: 0 },
  { id: 'op-2416', code: 'OP-2416', name: 'Ransomware precursor chain', status: 'completed', engine: 'Atomic Red Team', lead: 'M. Okafor', techniques: 18, detected: 11, window: '09 Apr 07:00 – 19:00 UTC', stage: 4 },
  { id: 'op-2412', code: 'OP-2412', name: 'Linux web tier persistence', status: 'completed', engine: 'Atomic Red Team', lead: 'R. Banerjee', techniques: 7, detected: 4, window: '02 Apr 10:00 – 15:00 UTC', stage: 4 },
  { id: 'op-2420', code: 'OP-2420', name: 'Exfiltration over cloud storage', status: 'queued', engine: 'Atomic Red Team', lead: 'R. Banerjee', techniques: 5, detected: 0, window: '17 Apr 08:00 – 12:00 UTC', stage: 0 },
  { id: 'op-2409', code: 'OP-2409', name: 'Kerberos abuse baseline', status: 'failed', engine: 'Caldera', lead: 'S. Lindqvist', techniques: 6, detected: 2, window: '28 Mar 09:00 – 14:00 UTC', stage: 1 },
]
export const STAGES = ['Emulate', 'Telemetry', 'Detect', 'Evidence', 'Report'] as const

export type Approval = { id: string; action: string; tech: string; target: string; risk: 'low' | 'medium' | 'high'; blast: string; rollback: string; requester: string; op: string; expires: string; note: string }
export const APPROVALS: Approval[] = [
  { id: 'apr-9031', action: 'Dump LSASS process memory', tech: 'T1003.001', target: 'WKS-FIN-0142.corp.northwind.example', risk: 'high', blast: '1 host · no lateral reach · EDR in monitor mode', rollback: 'Delete dump artefact; no persistent change', requester: 'M. Okafor', op: 'OP-2419', expires: '14:32 UTC', note: 'Engagement window open until 18:00. Target in signed scope (ENG-0087 §2.1).' },
  { id: 'apr-9030', action: 'Authenticate via pass-the-hash to file server', tech: 'T1550.002', target: 'SRV-FS-02.corp.northwind.example', risk: 'high', blast: '1 host · reads share inventory only', rollback: 'Session expires on logoff; no accounts created', requester: 'S. Lindqvist', op: 'OP-2418', expires: '15:10 UTC', note: 'Requires second Approver. Requester cannot approve.' },
  { id: 'apr-9028', action: 'Create scheduled task for persistence', tech: 'T1053.005', target: 'WKS-FIN-0142.corp.northwind.example', risk: 'medium', blast: '1 host · task named REDOPS-TEST-0028', rollback: 'schtasks /delete scripted and verified', requester: 'M. Okafor', op: 'OP-2419', expires: '16:00 UTC', note: 'Technique allowed under rules of engagement §4.3.' },
  { id: 'apr-9027', action: 'Enumerate domain accounts', tech: 'T1087.002', target: 'DC-01.corp.northwind.example', risk: 'low', blast: 'Read-only LDAP queries', rollback: 'Not required', requester: 'R. Banerjee', op: 'OP-2420', expires: '17:45 UTC', note: 'Read-only action.' },
]
export const CURRENT_USER = 'S. Lindqvist'

export type Evt = { id: string; ts: string; host: string; src: string; msg: string; tech?: string; match?: 'matched' | 'missed' }
export const EVENTS: Evt[] = [
  { id: 'e1', ts: '08:14:02.118', host: 'WKS-FIN-0142', src: 'Sysmon 1', msg: 'powershell.exe -enc JABzAD0ATgBlAHcA…', tech: 'T1059.001', match: 'matched' },
  { id: 'e2', ts: '08:14:09.440', host: 'WKS-FIN-0142', src: 'Sysmon 10', msg: 'rundll32.exe opened lsass.exe GrantedAccess 0x1FFFFF', tech: 'T1003.001', match: 'matched' },
  { id: 'e3', ts: '08:15:31.902', host: 'SRV-FS-02', src: 'Security 4624', msg: 'Logon type 3 NTLM from 10.20.4.31, account svc_backup', tech: 'T1550.002', match: 'missed' },
  { id: 'e4', ts: '08:15:44.017', host: 'SRV-FS-02', src: 'Sysmon 3', msg: 'SMB connection 10.20.4.31 → 10.20.8.12:445', tech: 'T1021.002', match: 'matched' },
  { id: 'e5', ts: '08:16:20.771', host: 'DC-01', src: 'Security 4769', msg: 'Kerberos TGS requested, RC4 (0x17), SPN MSSQLSvc/SQL-04', tech: 'T1558.003', match: 'missed' },
  { id: 'e6', ts: '08:17:02.250', host: 'SRV-SQL-04', src: 'Sysmon 13', msg: 'Registry value set HKLM\\…\\Run\\Updater', tech: 'T1547.001', match: 'matched' },
  { id: 'e7', ts: '08:17:49.634', host: 'WKS-FIN-0142', src: 'Security 4698', msg: 'Scheduled task created: REDOPS-TEST-0028', tech: 'T1053.005' },
]
export const STREAM_POOL: Omit<Evt, 'id' | 'ts'>[] = [
  { host: 'WKS-FIN-0142', src: 'Sysmon 1', msg: 'cmd.exe /c whoami /groups', tech: 'T1059.003', match: 'matched' },
  { host: 'SRV-FS-02', src: 'Sysmon 11', msg: 'File created C:\\Windows\\Temp\\svc.tmp', tech: 'T1570', match: 'missed' },
  { host: 'DC-01', src: 'Security 4662', msg: 'Directory object read by CORP\\m.okafor-test', tech: 'T1087.002', match: 'matched' },
  { host: 'SRV-SQL-04', src: 'Sysmon 3', msg: 'Outbound 10.20.8.40 → 203.0.113.17:443', tech: 'T1041', match: 'missed' },
  { host: 'WKS-HR-0031', src: 'Sysmon 1', msg: 'wmic /node:SRV-FS-02 process list', tech: 'T1047' },
]
export const GAP_SUGGEST: Record<string, string> = {
  'T1550.002': 'Alert on 4624 logon type 3 with NTLM where source host is a workstation and account is a service principal.',
  'T1558.003': 'Alert on 4769 where TicketEncryptionType = 0x17 for non-machine accounts, thresholded by 5 per minute.',
  'T1570': 'Alert on executable creation under Windows\\Temp on file servers within 60s of an inbound SMB session.',
  'T1041': 'Alert on first-seen outbound TLS from SQL tier to external ASN, excluding patch mirrors.',
}

export const HASH_ITEMS = [
  { id: 'ev-0001', name: 'lsass_access_sysmon10.json', kind: 'Log', size: '14.2 KB', actor: 'telemetry-worker', ts: '2025-04-14T08:14:10Z', op: 'OP-2419' },
  { id: 'ev-0002', name: 'wks-fin-0142_powershell_enc.png', kind: 'Screenshot', size: '218 KB', actor: 'M. Okafor', ts: '2025-04-14T08:14:41Z', op: 'OP-2419' },
  { id: 'ev-0003', name: 'srv-fs-02_4624_ntlm.evtx', kind: 'Log', size: '1.8 MB', actor: 'telemetry-worker', ts: '2025-04-14T08:16:02Z', op: 'OP-2418' },
  { id: 'ev-0004', name: 'dc-01_4769_rc4_tickets.json', kind: 'Log', size: '22.9 KB', actor: 'telemetry-worker', ts: '2025-04-14T08:16:44Z', op: 'OP-2419' },
  { id: 'ev-0005', name: 'rule_gap_T1550_002_review.pdf', kind: 'Document', size: '96 KB', actor: 'R. Banerjee', ts: '2025-04-14T09:02:19Z', op: 'OP-2418' },
]
export const AUDIT = [
  { id: 'a1', ts: '2025-04-14 09:41:07', actor: 'S. Lindqvist', action: 'approval.denied', obj: 'apr-9026 · T1486', ip: '198.51.100.24' },
  { id: 'a2', ts: '2025-04-14 09:12:55', actor: 'M. Okafor', action: 'approval.requested', obj: 'apr-9031 · T1003.001', ip: '198.51.100.31' },
  { id: 'a3', ts: '2025-04-14 08:58:30', actor: 'system', action: 'execution.dispatched', obj: 'OP-2419 · runner rn-eu-02', ip: 'internal' },
  { id: 'a4', ts: '2025-04-14 08:14:41', actor: 'M. Okafor', action: 'evidence.written', obj: 'ev-0002 · sha256 9f2c…a41e', ip: '198.51.100.31' },
  { id: 'a5', ts: '2025-04-13 17:03:12', actor: 'A. Reyes', action: 'role.changed', obj: 'R. Banerjee → Detection Engineer', ip: '203.0.113.9' },
  { id: 'a6', ts: '2025-04-13 11:20:48', actor: 'A. Reyes', action: 'killswitch.armed', obj: 'ENG-0087 · scope test', ip: '203.0.113.9' },
]
export const TEAM = [
  { id: 'u1', name: 'Amara Reyes', email: 'a.reyes@northwind.example', role: 'Owner', mfa: true },
  { id: 'u2', name: 'Sofia Lindqvist', email: 's.lindqvist@northwind.example', role: 'Approver', mfa: true },
  { id: 'u3', name: 'Michael Okafor', email: 'm.okafor@northwind.example', role: 'Red Operator', mfa: true },
  { id: 'u4', name: 'Rohan Banerjee', email: 'r.banerjee@northwind.example', role: 'Detection Engineer', mfa: false },
  { id: 'u5', name: 'Elise Marchetti', email: 'e.marchetti@northwind.example', role: 'Auditor', mfa: true },
]
export const TREND = ['Jan', 'Feb', 'Mar', 'Apr'].flatMap((m, mi) => [0, 1, 2].map((w, wi) => ({ w: `${m} W${w + 1}`, coverage: 41 + (mi * 3 + wi) * 3.1 + (wi === 1 ? 1.2 : 0), gaps: 28 - (mi * 3 + wi) * 1.6 })))
