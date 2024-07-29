# Changelog

All notable changes to **CloudOps-Pulse Observability Platform** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-27
### Added
- Complete React 18 Real-Time DevOps Observability Dashboard with Service Mesh topology.
- Interactive Incident escalation console with P1/P2 paging triggers and timeline tracking.
- Service Level Objective (SLO) error budget burn-rate calculator and visualization meter.
- Multi-stage Docker containerization and Docker Compose orchestration with Redis and Mongo.
- Full automated test suite verifying anomaly detection, blast radius, and incident state transitions.

## [0.3.0] - 2024-10-28
### Added
- Statistical anomaly detection service evaluating z-score deviation across rolling metrics windows.
- PagerDuty and Slack webhook notification dispatcher with HMAC tamper-protection.
- Microservice dependency graph builder identifying blast radius for degraded nodes.

## [0.2.0] - 2024-08-28
### Added
- Golden signals ingestion engine capturing P50/P95/P99 latency, RPS throughput, and error rates.
- Threshold-based AlertRule evaluator with automatic incident trigger mechanics.
- Strict 6-state Incident lifecycle state machine (TRIGGERED to RESOLVED).

## [0.1.0] - 2024-07-29
### Added
- Core MongoDB schema models: ServiceNode, MetricSnapshot, Incident, AlertRule.
- RESTful microservice registration and health monitoring endpoints.
- Mongoose connection pooling with replica-set failover configuration.
