# 🔴 REDOPS

### Closed-Loop Detection Validation for Purple Teams

> **Emulate. Verify. Fix. Retest.**

REDOPS is an AI-assisted platform that answers one question with evidence:

**"Did our defenses actually detect this technique, and if not, what rule would fix it?"**

It runs controlled adversary-emulation tests in **authorized lab environments**, proves whether each one was detected by correlating security telemetry back to the exact execution, proposes and *validates* detection rules for the gaps, and then retests to confirm the fix.

![status](https://img.shields.io/badge/status-pre--alpha-orange)
![focus](https://img.shields.io/badge/focus-detection%20validation-red)
![license](https://img.shields.io/badge/license-proprietary-lightgrey)

---

## ⚠️ Ownership & Usage Notice

**© 2026 Saurabh Kori. All Rights Reserved.**

This project and its source code are **proprietary**. Copying, cloning, redistributing, modifying, republishing, commercializing, or using substantial portions of it in another project is prohibited without prior written permission from the author. Viewing the repository does not grant any right to reuse it. See [License](#-license--copyright).

---

## 📌 Project Status

REDOPS is in **pre-alpha design and early development**. This README separates what exists from what is planned, so nothing here should be read as a shipped feature unless marked ✅.

| Area | Status |
|---|---|
| Architecture & ADRs | 🚧 In progress |
| Milestone 1: vertical slice (see [Roadmap](#-roadmap)) | 🔜 Next |
| Everything else | 📝 Planned |

---

## 🎯 The Problem

Organizations buy detection tools and write detection rules, but rarely know which attacker behaviors they would actually catch. Existing approaches each cover only part of the picture:

| Approach | What it does well | What's missing |
|---|---|---|
| Emulation engines (MITRE Caldera, Atomic Red Team) | Execute techniques | No judgment on whether defenders saw them |
| Purple-team trackers (VECTR) | Track results and metrics | Verdicts are entered manually; no automated proof |
| Commercial BAS platforms | Continuous validation at scale | Closed, costly, limited transparency into *why* a test was missed |
| Autonomous pentest tools | Prove exploitability | Focus on vulnerabilities, not detection coverage |

## 💡 What REDOPS Does Differently

REDOPS closes the loop that these tools leave open:

```text
   ┌──────────────┐     ┌───────────────┐     ┌───────────────┐
   │ 1. EMULATE   │────▶│ 2. CORRELATE  │────▶│ 3. VERDICT    │
   │ run approved │     │ match telemetry│    │ detected /    │
   │ test in lab  │     │ to run ID      │    │ partial/missed│
   └──────────────┘     └───────────────┘     └───────┬───────┘
          ▲                                           │ gap
          │                                           ▼
   ┌──────┴───────┐     ┌───────────────┐     ┌───────────────┐
   │ 6. RETEST    │◀────│ 5. VALIDATE   │◀────│ 4. PROPOSE    │
   │ confirm fix  │     │ rule vs. real │     │ candidate     │
   │              │     │ telemetry     │     │ Sigma rule    │
   └──────────────┘     └───────────────┘     └───────────────┘
                       (human approval gates steps 1 and 6)
```

1. **Proof, not claims.** Every execution carries a unique run ID. Telemetry is matched back to it by host, time window, and process lineage, so a verdict links to the exact events behind it.
2. **Gaps become fixes.** For missed techniques, REDOPS drafts a candidate [Sigma](https://github.com/SigmaHQ/sigma) rule.
3. **AI is checked, not trusted.** A proposed rule must pass deterministic validation: it has to fire on the recorded telemetry from the missed run, and it is tested against a benign baseline corpus to estimate false positives. Technique IDs are validated against official ATT&CK data, never taken from the model's word.
4. **Fixes are verified.** After a rule is deployed, the same test is rerun to confirm the gap is closed.

---

## 🔑 Core Capabilities

| Capability | Description |
|---|---|
| **Operations** | Scope, Rules of Engagement, authorized targets, approvals, timeline |
| **Executor abstraction** | Runs tests through existing engines (Atomic Red Team, Caldera). REDOPS does not author offensive tooling |
| **Run-ID correlation** | Ties each execution to its telemetry for ground-truth verdicts |
| **Verdict engine** | `DETECTED` · `PARTIAL` · `MISSED` · `INCONCLUSIVE` with linked evidence and time-to-detect |
| **ATT&CK coverage** | Technique-level coverage map exportable to ATT&CK Navigator |
| **AI detection analysis** | Gap explanation and Sigma-rule proposals with validation results |
| **Retest workflow** | Before/after comparison per technique |
| **Reporting** | Technical and executive reports generated from evidence |

---

## 🛡️ Safety Model

REDOPS handles sensitive data and runs controlled offensive tests, so safety is **enforced in code, not in prompts**. An AI model can suggest; it can never authorize.

| Control | How it works |
|---|---|
| **Scope allowlist** | Targets are checked against the operation's authorized scope at the execution layer. Out-of-scope execution is rejected before reaching any executor |
| **Technique allowlist** | Each operation permits only explicitly approved techniques |
| **Signed human approval** | Executions require an approval record by an authorized user; AI output cannot create one |
| **Kill switch** | One action halts all running executions for an operation |
| **Lab-only guardrails** | Targets must be registered as lab assets; production-tagged assets are blocked by default |
| **Tamper-evident audit log** | Append-only, hash-chained record of approvals, executions, and AI decisions |
| **Untrusted-data handling** | Logs, telemetry, and target-derived text are treated as untrusted input to any LLM, to mitigate prompt injection |
| **No unsupervised actions** | AI components are advisory and cannot trigger execution |

The platform itself is treated as a high-value target. See [`docs/threat-model.md`](docs/threat-model.md) and [`SECURITY.md`](SECURITY.md).

---

## 🏗️ Architecture

```text
                    ┌────────────────────────┐
                    │      Web UI (Next.js)  │
                    └───────────┬────────────┘
                                │ REST / WebSocket
                    ┌───────────▼────────────┐
                    │     API (FastAPI)      │
                    │ AuthN/Z · Policy Engine│◀── scope, technique allowlist,
                    └───────────┬────────────┘     approvals, kill switch
                                │
         ┌──────────────────────┼───────────────────────┐
         ▼                      ▼                       ▼
 ┌───────────────┐    ┌──────────────────┐    ┌──────────────────┐
 │ Executor      │    │ Telemetry        │    │ AI Services      │
 │ Adapters      │    │ Ingestion &      │    │ (advisory only)  │
 │ Atomic/Caldera│    │ Correlation      │    │ ATT&CK mapping   │
 └──────┬────────┘    └────────┬─────────┘    │ Gap analysis     │
        │                      │              │ Sigma proposals  │
        ▼                      ▼              │ Reporting        │
 ┌───────────────┐    ┌──────────────────┐    └────────┬─────────┘
 │ Isolated Lab  │───▶│ Detection Stack  │             │
 │ Win/Linux VMs │    │ Wazuh / Elastic  │             │
 └───────────────┘    └──────────────────┘             │
                                │                       │
                    ┌───────────▼───────────────────────▼───┐
                    │ PostgreSQL (operations, runs, verdicts,│
                    │ evidence index, audit log, job queue)  │
                    └────────────────────────────────────────┘
```

### Design principles

- **Wrap, don't reinvent.** Emulation is delegated to proven open-source engines through an adapter interface.
- **Deterministic core, AI at the edges.** Scope checks, correlation, verdicts, and rule validation are deterministic and testable. AI explains, drafts, and summarizes.
- **Start small.** The MVP runs on PostgreSQL alone. Heavier stores (Redis, OpenSearch) are added only when measurements justify them.
- **Model-agnostic.** A provider abstraction supports hosted APIs and local models, since many security teams cannot send telemetry to the cloud.

### Core data model

```text
Operation ─┬─ Scope / ROE
           ├─ Target (lab assets)
           └─ Run ─┬─ Technique (ATT&CK ID, validated)
                   ├─ Approval (who, when, signature)
                   ├─ Evidence (events, logs, artifacts)
                   ├─ Verdict (detected/partial/missed + time-to-detect)
                   └─ Finding ─▶ RuleProposal ─▶ Validation ─▶ Retest
AuditLog (append-only, hash-chained, spans all of the above)
```

### AI components

AI is used where it adds value and kept advisory throughout:

| Component | Role | Guardrail |
|---|---|---|
| ATT&CK mapper | Maps observed activity to techniques | IDs verified against official ATT&CK STIX data |
| Detection analyst | Explains why a technique was missed | Cites the specific evidence it relied on |
| Rule proposer | Drafts candidate Sigma rules | Must pass replay and false-positive validation before review |
| Report writer | Summarizes operations | Generated only from stored evidence and verdicts |

---

## 📊 Example Operation View

```text
┌────────────────────────────────────────────────────────────────────┐
│ OPERATION: NIGHTFALL-01  (lab)                         ● COMPLETE │
│ Objective: Validate detection coverage for a simulated intrusion   │
├────────────────────────────────────────────────────────────────────┤
│ Technique                          Verdict      Time to detect     │
│ T1078    Valid Accounts            ✓ DETECTED   00:41              │
│ T1059.001 PowerShell               ✓ DETECTED   00:12              │
│ T1053.005 Scheduled Task           ✓ DETECTED   01:30              │
│ T1547.001 Registry Run Keys        ◐ PARTIAL    04:05              │
│ T1021.002 SMB/Admin Shares         ✗ MISSED     —                  │
│ T1003.001 LSASS Memory             ✗ MISSED     —                  │
├────────────────────────────────────────────────────────────────────┤
│ Coverage: 3/6 detected · 1 partial · 2 missed                      │
│ Candidate rules: 2 drafted → 1 passed validation → awaiting review │
└────────────────────────────────────────────────────────────────────┘
```

*Illustrative mock-up of the target UI.*

---

## ⚡ Quick Start

> **Target experience for Milestone 1.** These commands describe the intended workflow and will be live when the vertical slice ships.

### Prerequisites

Docker + Docker Compose, Python 3.11+, Node.js 20+, Git.

### One-command demo (planned)

```bash
git clone https://github.com/saurabh9555-k/REDOPS.git
cd REDOPS
cp .env.example .env      # set JWT_SECRET; AI provider is optional
make demo                 # starts the stack and loads sample operation data
```

Then open `http://localhost:3000` to explore a pre-loaded operation, including verdicts, evidence, and a generated report, **without running any live emulation**.

### Full lab setup (planned)

For live runs you need an isolated lab (never a production network):

```text
REDOPS ──▶ Isolated lab network ──┬─▶ Windows VM (Sysmon + Wazuh agent)
                                  └─▶ Linux VM  (Wazuh agent)
```

See [`docs/lab-setup.md`](docs/lab-setup.md) for the guide.

### Configuration

```env
APP_ENV=development
DATABASE_URL=postgresql://redops:redops@localhost:5432/redops
JWT_SECRET=                 # required; generate a long random value
AI_PROVIDER=                # optional: hosted or local model
AI_API_KEY=                 # optional
```

> Never commit `.env` or API keys.

---

## 🧰 Technology Stack

| Layer | MVP | Later (when needed) |
|---|---|---|
| Frontend | Next.js, TypeScript, Tailwind, React Flow, Recharts | |
| Backend | Python, FastAPI, Pydantic, WebSockets | |
| Data | PostgreSQL (data, queue, evidence index) | Redis, OpenSearch |
| Emulation | Atomic Red Team via executor adapter | Caldera adapter |
| Detection backend | Wazuh + Sysmon (first integration) | Elastic and others |
| Detection format | Sigma | Backend-specific conversions |
| AI | Provider-agnostic layer, local-model option | Orchestration framework if workflows grow |
| Deployment | Docker Compose | Kubernetes |

---

## 🚀 Roadmap

Delivery is organized as **vertical slices**, each a working end-to-end product increment.

### Milestone 1: First Verdict (vertical slice)

- [ ] Operation with scope and ROE
- [ ] Policy engine: scope allowlist, technique allowlist, approvals, kill switch
- [ ] Atomic Red Team executor adapter with run-ID tagging
- [ ] Wazuh/Sysmon telemetry ingestion
- [ ] Correlation engine and verdicts (detected / partial / missed)
- [ ] Hash-chained audit log
- [ ] ATT&CK Navigator export and PDF report
- [ ] `make demo` with sample data

### Milestone 2: Close the Loop

- [ ] AI gap analysis with cited evidence
- [ ] Sigma rule proposals
- [ ] Replay validation and benign-baseline false-positive check
- [ ] Retest workflow with before/after comparison

### Milestone 3: Team Scale

- [ ] Roles and RBAC, multi-operation dashboards
- [ ] Caldera adapter and additional detection backends
- [ ] Attack-path visualization
- [ ] Executive reporting and coverage trends over time

### Milestone 4: Hardening & Extensibility

- [ ] Plugin interface for executors and detection backends
- [ ] Redis / OpenSearch where benchmarks justify them
- [ ] Optional Kubernetes deployment
- [ ] Third-party security review of the platform

---

## 📏 Success Metrics

REDOPS is measured against labeled lab runs:

| Metric | Why it matters |
|---|---|
| **Correlation accuracy** | Verdicts must match known ground truth |
| **Time from run to verdict** | Determines whether iteration is practical |
| **Rule validation pass rate** | Share of AI-proposed Sigma rules that survive replay and false-positive checks |
| **Gap closure rate** | Share of missed techniques that pass on retest after a fix |
| **Reproducibility** | A saved operation produces the same verdicts when re-evaluated |

---

## 📁 Project Structure (planned)

```text
REDOPS/
├── frontend/              # Next.js UI
├── backend/
│   ├── api/               # FastAPI routes
│   ├── policy/            # Scope, approvals, kill switch
│   ├── executors/         # Atomic / Caldera adapters
│   ├── telemetry/         # Ingestion & correlation
│   ├── verdicts/          # Verdict engine
│   ├── ai/                # Advisory AI services
│   └── core/
├── detection/
│   ├── rules/             # Sigma rules
│   └── baselines/         # Benign telemetry corpora
├── database/
│   └── migrations/
├── docs/
│   ├── architecture/
│   ├── adr/               # Architecture Decision Records
│   ├── threat-model.md
│   ├── lab-setup.md
│   └── methodology/
├── docker/
├── tests/
├── SECURITY.md
└── README.md
```

---

## 📚 Documentation & Decisions

Key design choices are recorded as ADRs in [`docs/adr/`](docs/adr/):

| ADR | Decision |
|---|---|
| 001 | Wrap Caldera/Atomic Red Team instead of building a custom executor |
| 002 | PostgreSQL-only MVP; add OpenSearch when measurements justify it |
| 003 | Agent orchestration approach (state machine vs framework) |
| 004 | Safety enforcement architecture (policy engine, approvals, kill switch) |
| 005 | Telemetry correlation via run-ID tagging |
| 006 | First detection backend: Wazuh |

---

## 🧪 Intended Use

REDOPS is for:

- **Authorized purple-team exercises** with explicit permission
- **Detection engineering** and rule validation in controlled labs
- **Security research and training** in isolated environments
- **Defensive coverage measurement** against MITRE ATT&CK

## ⚠️ Responsible Use

REDOPS must only be used against systems for which you have **explicit written authorization**, and by design it is restricted to registered lab assets. Do not use it to compromise, disrupt, or gain unauthorized access to any system, network, account, or data. Users are solely responsible for compliance with applicable laws and agreements.

---

## 🤝 Third-Party Components

REDOPS integrates with or builds on open-source projects such as MITRE ATT&CK, Atomic Red Team, MITRE Caldera, and Sigma, each under its own license and terms. A full list with license notes will be maintained in `docs/third-party.md`. All trademarks belong to their respective owners.

---

## 📜 License & Copyright

This repository is **proprietary and not released under an open-source license**.

Copyright © 2026 **Saurabh Kori**. All rights reserved.

Unauthorized reproduction, copying, redistribution, modification, publication, or commercial use of this project's source code or substantial portions of its implementation is prohibited without prior written permission from the author. For permission requests, contact the author.

---

## 👤 Author

### Saurabh Kori

Cybersecurity Aspirant · Red Team & Offensive Security Enthusiast

`Red Teaming` · `Purple Teaming` · `Detection Engineering` · `Adversary Emulation` · `Cybersecurity Research`

---

### 🔴 REDOPS

**Turning security assumptions into measurable, evidence-backed, retestable results.**
