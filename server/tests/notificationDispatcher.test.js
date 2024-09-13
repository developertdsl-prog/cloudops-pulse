const test = require('node:test');
const assert = require('node:assert');
const { dispatchIncidentAlert } = require('../services/notificationDispatcher');

test('Notification Dispatcher: generates cryptographically signed alert dispatch payload', async () => {
  const mockIncident = {
    incidentId: 'INC-TEST-001',
    serviceId: 'svc-payment-core',
    severity: 'P1_CRITICAL',
    title: 'Database connection exhaustion',
    status: 'TRIGGERED'
  };

  const dispatch = await dispatchIncidentAlert(mockIncident);
  assert.strictEqual(dispatch.dispatched, true);
  assert.ok(dispatch.signature);
  assert.strictEqual(typeof dispatch.signature, 'string');
  assert.strictEqual(dispatch.payload.incidentId, 'INC-TEST-001');
});
