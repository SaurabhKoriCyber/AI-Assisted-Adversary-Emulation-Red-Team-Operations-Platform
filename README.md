# 🔴 REDOPS

### AI-Assisted Red Team Operations & Adversary Emulation Platform

> **Plan. Emulate. Validate. Improve.**

REDOPS is an AI-assisted cybersecurity platform built to support **Red Team and Purple Team operations in controlled and authorized environments**.

The platform brings offensive security planning, adversary emulation, attack-path analysis, MITRE ATT&CK mapping, telemetry correlation, evidence management, and detection validation into a unified workspace.

Rather than focusing only on executing security tools, REDOPS is designed around the **complete Red Team operation lifecycle** — from planning and reconnaissance to controlled attack simulation, detection analysis, reporting, and retesting.

---

## ⚠️ Project Ownership & Usage Notice

**© 2026 Saurabh Kori. All Rights Reserved.**

This project and its source code are **proprietary**.

> **Copying, cloning, redistributing, modifying, republishing, commercializing, or using substantial portions of this project or its source code in another project is prohibited without prior written permission from the author.**

Viewing and studying the repository does not grant permission to reuse, reproduce, or redistribute the implementation.

For permission to use, modify, distribute, or build upon this project, please contact the author.

**This repository is not licensed for unrestricted reuse.**

---

## 🎯 Vision

Modern Red Team operations are more than running offensive security tools.

A successful operation involves:

```text
Reconnaissance
      ↓
Operational Planning
      ↓
Attack-Path Analysis
      ↓
Adversary Emulation
      ↓
Telemetry Generation
      ↓
Detection Validation
      ↓
Evidence Collection
      ↓
Reporting
      ↓
Retesting
```

REDOPS aims to provide a single operational workspace for this entire workflow.

---

## 🧠 What REDOPS Does

REDOPS uses specialized AI-assisted workflows to help security professionals understand and manage controlled adversary-emulation exercises.

### 🔴 Red Team Operations

Plan and organize security operations around:

* Objectives
* Scope
* Rules of Engagement
* Authorized targets
* Attack paths
* MITRE ATT&CK techniques
* Operational evidence

### 🧠 AI-Assisted Analysis

Specialized agents can assist with:

* Attack-path analysis
* Security-event investigation
* Threat intelligence enrichment
* Technique identification
* Evidence organization
* Detection-gap analysis
* Report generation

### 🗺️ MITRE ATT&CK Integration

Map simulated adversary activity to the MITRE ATT&CK framework.

```text
Tactic
  │
  └── Technique
        │
        └── Evidence
              │
              └── Detection Result
```

This creates a clear relationship between **what was simulated, why it matters, and whether it was detected**.

---

## 🟣 Purple Team Validation

One of the core concepts of REDOPS is connecting offensive activity with defensive visibility.

```text
             🔴 RED TEAM
                  │
                  │ Simulated Action
                  ▼
            ┌─────────────┐
            │ Target Lab  │
            └──────┬──────┘
                   │
                   │ Telemetry
                   ▼
            ┌─────────────┐
            │ Detection   │
            │ Platform    │
            └──────┬──────┘
                   │
                   ▼
           Detection Analysis
                   │
             ┌─────┴─────┐
             ▼           ▼
          DETECTED      MISSED
             │           │
             └─────┬─────┘
                   ▼
             Purple Team
              Analysis
```

This allows an engagement to answer questions such as:

* Was the simulated technique detected?
* How quickly was it detected?
* Which telemetry supported the detection?
* Which techniques generated no useful alert?
* Where are the detection gaps?
* What should be retested?

---

## 🤖 Agent Architecture

REDOPS is designed around specialized security agents rather than a single general-purpose AI.

| Agent                 | Responsibility                                        |
| --------------------- | ----------------------------------------------------- |
| 🔎 Recon Agent        | Authorized asset and environment analysis             |
| 🧭 Attack-Path Agent  | Identifies potential adversary paths                  |
| 🧠 Intelligence Agent | Enriches indicators and security context              |
| 🗺️ ATT&CK Agent      | Maps activity to ATT&CK techniques                    |
| 🧪 Emulation Agent    | Assists with controlled adversary-emulation workflows |
| 📡 Telemetry Agent    | Correlates simulated actions with security events     |
| 🛡️ Detection Agent   | Evaluates defensive visibility                        |
| 📸 Evidence Agent     | Organizes operation evidence and timelines            |
| 📝 Reporting Agent    | Generates technical and executive reports             |

---

## 🖥️ Platform Modules

```text
REDOPS
│
├── Operations
├── Targets
├── Attack Paths
├── AI Agents
├── MITRE ATT&CK
├── Telemetry
├── Detection Validation
├── Evidence
├── Reports
└── Settings
```

### Operations

Create and manage individual Red Team engagements.

### Attack Paths

Visualize relationships between:

```text
Initial Access
      ↓
Execution
      ↓
Privilege Escalation
      ↓
Credential Access
      ↓
Discovery
      ↓
Lateral Movement
      ↓
Objective
```

### Evidence

Maintain an engagement timeline containing relevant events, observations, screenshots, logs, timestamps, and technique references.

### Detection Validation

Compare simulated activity with available defensive telemetry and document detection results.

---

## ⚡ Quick Start

### Prerequisites

Make sure the following are installed:

* **Git**
* **Docker Desktop**
* **Docker Compose**
* **Node.js 20+**
* **Python 3.11+**

### 1. Clone the repository

```bash
git clone https://github.com/saurabh9555-k/REDOPS.git
cd REDOPS
```

### 2. Configure environment variables

Create your local environment file:

```bash
cp .env.example .env
```

Then update the required configuration values:

```env
APP_ENV=development

DATABASE_URL=postgresql://redops:redops@localhost:5432/redops
REDIS_URL=redis://localhost:6379

AI_PROVIDER=
AI_API_KEY=

JWT_SECRET=
```

> Never commit `.env` or API keys to GitHub.

### 3. Start the infrastructure

```bash
docker compose up -d
```

This starts the local services required by REDOPS, such as:

```text
PostgreSQL
Redis
OpenSearch / Elasticsearch
```

### 4. Start the backend

```bash
cd backend

python -m venv .venv
```

**Windows:**

```bash
.venv\Scripts\activate
```

**Linux / macOS:**

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the API:

```bash
uvicorn api.main:app --reload
```

Backend API:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

### 6. Verify the installation

After startup, verify:

```text
Frontend       → http://localhost:3000
Backend API    → http://localhost:8000
API Docs       → http://localhost:8000/docs
Database       → PostgreSQL
Cache          → Redis
```

You should then be able to create a development operation, define an authorized target scope, and begin testing the REDOPS workflow inside your controlled environment.

---

## 🧪 Development Environment

For safe development and testing, use an isolated lab such as:

```text
┌──────────────────────────────────────┐
│          REDOPS DEV ENVIRONMENT      │
│                                      │
│  REDOPS Platform                    │
│          │                           │
│          ▼                           │
│  ┌──────────────┐                    │
│  │ Isolated Lab │                    │
│  └──────┬───────┘                    │
│         │                            │
│    ┌────┴─────┐                      │
│    ▼          ▼                      │
│ Windows VM   Linux VM                │
│                                      │
└──────────────────────────────────────┘
```

Only use targets for which you have explicit authorization.

---

## 📊 Example Operation View

```text
┌─────────────────────────────────────────────────────────┐
│ OPERATION: NIGHTFALL-01                    🔴 ACTIVE    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Objective                                               │
│ Validate detection coverage for simulated intrusion    │
│                                                         │
│ Techniques Evaluated              Detection             │
│                                                         │
│ T1078  Valid Accounts             ✓ DETECTED            │
│ T1059  Command & Scripting        ✓ DETECTED            │
│ T1021  Remote Services            ✗ MISSED              │
│                                                         │
│ Evidence Collected: 24                                  │
│ Detection Events:    17                                  │
│ Undetected Actions:  7                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Philosophy

REDOPS is designed around a **human-in-the-loop** model.

AI recommendations should assist security professionals rather than independently make high-impact decisions.

Operations should be governed by:

* Defined scope
* Rules of Engagement
* Authorized targets
* Human approval
* Auditability
* Evidence preservation

The platform is intended for **labs, training environments, authorized security assessments, and controlled adversary-emulation exercises**.

---

## 🛠️ Technology Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* React
* React Flow
* Recharts

### Backend

* Python
* FastAPI
* Pydantic
* WebSockets

### AI / Agents

* Agent orchestration framework
* LLM integration
* Tool-based workflows
* Structured agent state
* Human approval workflows

### Data

* PostgreSQL
* Redis
* Elasticsearch / OpenSearch

### Security

* MITRE ATT&CK
* Sigma-compatible detection concepts
* Security event telemetry
* IOC enrichment

### Deployment

* Docker
* Docker Compose
* Linux
* Optional Kubernetes deployment

---

## 🏗️ High-Level Architecture

```text
                         ┌─────────────────────┐
                         │    REDOPS UI        │
                         │  Command Center     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    API Gateway      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Red Team            │
                         │ Orchestrator        │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
         Recon Agent          Attack-Path Agent     Intel Agent
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Evidence & Context  │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                  Telemetry Layer       MITRE ATT&CK
                         │
                         ▼
                  Detection Analysis
                         │
                         ▼
                   Human Approval
                         │
                         ▼
                    Final Report
```

---

## 📁 Project Structure

```text
REDOPS/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── features/
│   └── lib/
│
├── backend/
│   ├── api/
│   ├── agents/
│   ├── models/
│   ├── services/
│   └── core/
│
├── agents/
│   ├── recon/
│   ├── attack_path/
│   ├── intelligence/
│   ├── attack_emulation/
│   ├── telemetry/
│   ├── detection/
│   └── reporting/
│
├── database/
│   ├── migrations/
│   └── schemas/
│
├── detection/
│   └── rules/
│
├── docs/
│   ├── architecture/
│   ├── operations/
│   └── methodology/
│
├── docker/
│
├── tests/
│
└── README.md
```

---

## 🚀 Development Roadmap

### Phase 1 — Foundation

* [ ] Authentication
* [ ] Dashboard
* [ ] Operations management
* [ ] Asset inventory
* [ ] Event ingestion
* [ ] Basic reporting

### Phase 2 — Red Team Intelligence

* [ ] Recon Agent
* [ ] Attack-Path Agent
* [ ] MITRE ATT&CK integration
* [ ] Evidence timeline
* [ ] Operation workspace

### Phase 3 — Purple Team

* [ ] Telemetry correlation
* [ ] Detection validation
* [ ] Detection-gap analysis
* [ ] Technique coverage visualization
* [ ] Retest workflow

### Phase 4 — Advanced Agentic Workflows

* [ ] Multi-agent orchestration
* [ ] Context-aware investigations
* [ ] AI-assisted operation planning
* [ ] Automated evidence organization
* [ ] Executive reporting
* [ ] Advanced operation analytics

---

## 🧪 Intended Use

REDOPS is designed for:

**Authorized Red Team Exercises**

Controlled adversary-emulation engagements conducted with explicit permission.

**Security Research**

Studying attack paths, detection engineering, and security telemetry in isolated environments.

**Cybersecurity Training**

Building practical Red Team and Purple Team skills using controlled lab infrastructure.

**Detection Validation**

Testing whether simulated offensive techniques generate the expected defensive visibility.

---

## ⚠️ Responsible Use

REDOPS must only be used against systems and environments for which you have explicit authorization.

Do not use the platform to compromise, disrupt, access, or maintain unauthorized access to systems, networks, accounts, or data.

The project is intended to support **responsible offensive-security research and authorized security operations**.

---

## 📜 License & Copyright

This repository is **proprietary and not released under an open-source license**.

Copyright © 2026 **Saurabh Kori**

All rights reserved.

Unauthorized reproduction, copying, redistribution, modification, publication, or commercial use of this project's source code or substantial portions of its implementation is prohibited without prior written permission from the author.

---

## 👤 Author

### Saurabh Kori

Cybersecurity Aspirant • Red Team & Offensive Security Enthusiast

**Focus Areas**

`Red Teaming` · `Offensive Security` · `Adversary Emulation` · `Purple Teaming` · `Threat Detection` · `Cybersecurity Research`

---

## ⭐ Project Status

> 🚧 **REDOPS is an actively developed project.**

The architecture, agents, interfaces, and capabilities may evolve significantly as development continues.

---

### 🔴 REDOPS

**Turning offensive security operations into measurable, explainable, and evidence-driven security exercises.**
