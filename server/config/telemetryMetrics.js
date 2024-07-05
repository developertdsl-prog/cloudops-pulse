/**
 * Telemetry Metrics & Golden Signals Standards
 */
const GOLDEN_SIGNALS = {
  LATENCY: {
    unit: 'milliseconds',
    p50WarningMs: 150,
    p95WarningMs: 400,
    p99CriticalMs: 1000
  },
  TRAFFIC: {
    unit: 'requests_per_second',
    spikeMultiplierThreshold: 2.5
  },
  ERRORS: {
    unit: 'percentage',
    warningThresholdPct: 1.0,
    criticalThresholdPct: 5.0
  },
  SATURATION: {
    unit: 'percentage',
    cpuCriticalPct: 85.0,
    memoryCriticalPct: 90.0
  }
};

const SEVERITY_LEVELS = {
  P1_CRITICAL: { name: 'P1 - Outage / Critical Degraded', maxAcknowledgeMinutes: 5 },
  P2_HIGH: { name: 'P2 - Elevated Latency / Impaired', maxAcknowledgeMinutes: 15 },
  P3_MEDIUM: { name: 'P3 - Non-Critical Warning', maxAcknowledgeMinutes: 60 },
  P4_LOW: { name: 'P4 - Informational', maxAcknowledgeMinutes: 240 }
};

module.exports = { GOLDEN_SIGNALS, SEVERITY_LEVELS };
