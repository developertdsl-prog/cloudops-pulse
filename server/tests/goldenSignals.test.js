const test = require('node:test');
const assert = require('node:assert');
const { GOLDEN_SIGNALS, SEVERITY_LEVELS } = require('../config/telemetryMetrics');

test('Golden Signals: verifies warning and critical threshold declarations', () => {
  assert.ok(GOLDEN_SIGNALS.LATENCY.p95WarningMs);
  assert.ok(GOLDEN_SIGNALS.ERRORS.criticalThresholdPct);
  assert.strictEqual(GOLDEN_SIGNALS.SATURATION.cpuCriticalPct, 85.0);

  assert.ok(SEVERITY_LEVELS.P1_CRITICAL);
  assert.strictEqual(SEVERITY_LEVELS.P1_CRITICAL.maxAcknowledgeMinutes, 5);
});
