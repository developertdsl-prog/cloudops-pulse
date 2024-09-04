const test = require('node:test');
const assert = require('node:assert');
const { calculateBlastRadius } = require('../services/topologyMapper');

test('Topology Mapper: correctly identifies upstream blast radius', () => {
  const allServices = [
    { serviceId: 'svc-db', dependencies: [] },
    { serviceId: 'svc-auth', dependencies: ['svc-db'] },
    { serviceId: 'svc-gateway', dependencies: ['svc-auth'] },
    { serviceId: 'svc-analytics', dependencies: [] }
  ];

  const blast = calculateBlastRadius('svc-db', allServices);
  assert.strictEqual(blast.includes('svc-auth'), true);
  assert.strictEqual(blast.includes('svc-gateway'), true);
  assert.strictEqual(blast.includes('svc-analytics'), false);
  assert.strictEqual(blast.length, 2);
});
