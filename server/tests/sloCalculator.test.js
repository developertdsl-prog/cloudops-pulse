const test = require('node:test');
const assert = require('node:assert');
const { calculateSloStatus } = require('../services/sloCalculator');

test('SLO Calculator: computes 99.9% compliance and remaining error budget', () => {
  const status = calculateSloStatus(99.9, 999, 1000);
  assert.strictEqual(status.sliPercent, 99.9);
  assert.strictEqual(status.isCompliant, true);
  assert.strictEqual(status.errorBudgetPercent, 0.1);
});

test('SLO Calculator: accurately calculates error budget burn rate', () => {
  const status = calculateSloStatus(99.9, 980, 1000);
  assert.strictEqual(status.isCompliant, false);
  assert.strictEqual(status.remainingErrorBudgetPercent, 0);
  assert.ok(status.burnRate > 1.0);
});
