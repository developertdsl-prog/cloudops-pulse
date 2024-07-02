# 🛰️ CloudOps-Pulse — Distributed Microservices Telemetry, Service Mesh Observability & Incident Escalation Platform

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**CloudOps-Pulse** is an enterprise site reliability engineering (SRE) and observability platform designed to monitor distributed microservices architectures. It synthesizes the four Golden Signals (Latency, Traffic, Errors, Saturation), computes real-time Service Level Objective (SLO) error budgets, detects statistical anomalies over sliding time windows, and coordinates automated incident escalation with PagerDuty and Slack webhooks.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    Cluster["Kubernetes Nodes & Edge Gateways"] -->|"Telemetry Ingestion (RPS, Latency, Errors)"| IngestionEngine["Ingestion API / Express Pipeline"]
    
    subgraph Stream & Statistical Processing
        IngestionEngine --> AnomalyEngine["Anomaly Detector (Z-Score & Burst)"]
        IngestionEngine --> SloEngine["SLO & Error Budget Burn Rate Calculator"]
        IngestionEngine --> RuleEngine["Alert Rule Evaluator"]
    end

    subgraph Service Mesh & Dependency Topology
        AnomalyEngine --> Topology["Topology Mapper (Blast Radius Engine)"]
        Topology --> MeshState["Service Mesh Status Grid"]
    end

    subgraph Incident Governance
        RuleEngine -->|"Threshold Breached"| IncidentSM["Incident State Machine"]
        IncidentSM -->|"P1/P2 Escalation"| Dispatcher["Notification Dispatcher (Slack / PagerDuty)"]
        IncidentSM --> Timeline["Incident Audit Trail"]
    end

    subgraph Persistence Layer
        IngestionEngine --> TimeseriesDB[("MongoDB Timeseries Store")]
        IncidentSM --> TimeseriesDB
        Topology --> TimeseriesDB
    end
```

---

## ✨ Core Engineering Highlights

1. **Four Golden Signals Synthesis**
   - Continuously ingests request throughput (RPS), P50/P95/P99 latency distribution, error rates, and CPU/memory saturation metrics.
   - Computes weighted health scores across microservice dependencies.

2. **SLO & Error Budget Management**
   - Implements Google SRE standard Service Level Indicators (SLI) and Service Level Objectives (SLO, e.g. 99.9%).
   - Calculates real-time remaining error budget in minutes/requests with proactive burn rate alerts.

3. **Directed Topology & Blast Radius Analysis**
   - Traverses microservice dependency graphs to identify downstream cascading failure risks before outages spread.
   - Prevents circular dependency deadlocks and visualizes upstream bottleneck nodes.

4. **Incident Lifecycle State Machine**
   - Governs incident triage through a strict 6-state workflow: `TRIGGERED` -> `ACKNOWLEDGED` -> `INVESTIGATING` -> `MITIGATED` -> `RESOLVED` -> `CLOSED`.
   - Immutable audit trail tracking MTTA (Mean Time to Acknowledge) and MTTR (Mean Time to Resolve).

5. **Multi-Channel Notification Dispatcher**
   - Dispatches formatted incident alerts to Slack channels and PagerDuty endpoints with cryptographic HMAC validation and exponential retry backoff.

---

## 🧪 Automated Test Suite

CloudOps-Pulse includes comprehensive automated tests built using Node.js native test runner:

```bash
# Execute test suites
npm test

# Run tests with code coverage analysis
npm run test:coverage
```

### Test Coverage Highlights
- `server/tests/anomalyDetector.test.js` — Z-score deviation evaluation and sudden latency burst detection.
- `server/tests/sloCalculator.test.js` — Error budget consumption formulas and 99.9% SLO compliance calculations.
- `server/tests/incidentStateMachine.test.js` — State machine transition validations and invalid transition guards.
- `server/tests/topologyMapper.test.js` — Blast radius identification and downstream dependency traversal.
- `server/tests/notificationDispatcher.test.js` — PagerDuty/Slack payload formatting and HMAC signature checks.
- `server/tests/goldenSignals.test.js` — Latency percentile aggregation and traffic weighting math.
- `server/tests/e2eIncidentLifecycle.test.js` — Complete lifecycle: Telemetry degradation -> P1 incident -> Acknowledge -> Mitigate -> Resolve.

---

## 🚀 Quickstart & Installation

```bash
# 1. Clone repository
git clone https://github.com/developertdsl-prog/cloudops-pulse.git
cd cloudops-pulse

# 2. Install dependencies
npm install
cd client && npm install && cd ..

# 3. Configure environment
cp .env.example .env

# 4. Seed microservices catalog and historical telemetry
npm run seed

# 5. Start API development server
npm run dev
```

---

## 📄 License
Licensed under the [MIT License](LICENSE). Designed & Maintained by `developertdsl-prog` (<developer.tdsl@gmail.com>).
