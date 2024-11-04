const test = require('node:test');
const assert = require('node:assert');
const { calculateSloStatus } = require('../services/sloCalculator');
const { evaluateZScore } = require('../services/anomalyDetector');
const { validateIncidentTransition } = require('../services/incidentStateMachine');
const { calculateBlastRadius } = require('../services/topologyMapper');

test('E2E Incident Lifecycle: Anomaly Detection to Blast Radius and Remediation', () => {
  const historical = [90, 95, 100, 105, 98, 102];
  const anomaly = evaluateZScore(550, historical);
  assert.strictEqual(anomaly.isAnomaly, true);

  const slo = calculateSloStatus(99.9, 950, 1000);
  assert.strictEqual(slo.isCompliant, false);
  assert.ok(slo.burnRate > 1.0);

  const services = [
    { serviceId: 'svc-core', dependencies: [] },
    { serviceId: 'svc-api', dependencies: ['svc-core'] }
  ];
  const blast = calculateBlastRadius('svc-core', services);
  assert.strictEqual(blast.includes('svc-api'), true);

  let status = 'TRIGGERED';
  assert.strictEqual(validateIncidentTransition(status, 'ACKNOWLEDGED'), true);
  status = 'ACKNOWLEDGED';
  assert.strictEqual(validateIncidentTransition(status, 'INVESTIGATING'), true);
  status = 'INVESTIGATING';
  assert.strictEqual(validateIncidentTransition(status, 'RESOLVED'), true);
  status = 'RESOLVED';
  assert.strictEqual(status, 'RESOLVED');
});
