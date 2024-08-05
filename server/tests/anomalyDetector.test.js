const test = require('node:test');
const assert = require('node:assert');
const { evaluateZScore, detectMetricAnomaly } = require('../services/anomalyDetector');

test('Anomaly Detector: accurately detects latency z-score outlier', () => {
  const history = [100, 105, 95, 110, 102, 98, 104];
  const normalEval = evaluateZScore(108, history);
  assert.strictEqual(normalEval.isAnomaly, false);

  const outlierEval = evaluateZScore(450, history);
  assert.strictEqual(outlierEval.isAnomaly, true);
  assert.ok(outlierEval.zScore > 2.5);
});

test('Anomaly Detector: detects multi-metric anomaly and aggregates reasons', () => {
  const currentSnapshot = {
    latencyP95Ms: 650,
    errorRatePercent: 6.2
  };
  const historical = [
    { latencyP95Ms: 120, errorRatePercent: 0.05 },
    { latencyP95Ms: 115, errorRatePercent: 0.02 },
    { latencyP95Ms: 125, errorRatePercent: 0.04 }
  ];

  const result = detectMetricAnomaly(currentSnapshot, historical);
  assert.strictEqual(result.hasAnomaly, true);
  assert.ok(result.reasons.length >= 2);
});
