const test = require('node:test');
const assert = require('node:assert');
const { validateIncidentTransition } = require('../services/incidentStateMachine');

test('Incident State Machine: validates legal lifecycle progression', () => {
  assert.strictEqual(validateIncidentTransition('TRIGGERED', 'ACKNOWLEDGED'), true);
  assert.strictEqual(validateIncidentTransition('ACKNOWLEDGED', 'INVESTIGATING'), true);
  assert.strictEqual(validateIncidentTransition('INVESTIGATING', 'MITIGATED'), true);
  assert.strictEqual(validateIncidentTransition('MITIGATED', 'RESOLVED'), true);
  assert.strictEqual(validateIncidentTransition('RESOLVED', 'CLOSED'), true);
});

test('Incident State Machine: guards against illegal backward state jumps', () => {
  assert.throws(() => {
    validateIncidentTransition('TRIGGERED', 'MITIGATED');
  }, /Illegal incident state mutation/);

  assert.throws(() => {
    validateIncidentTransition('CLOSED', 'TRIGGERED');
  }, /Illegal incident state mutation/);
});
