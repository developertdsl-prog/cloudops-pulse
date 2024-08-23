const mongoose = require('mongoose');
const ServiceNode = require('../models/ServiceNode');
const MetricSnapshot = require('../models/MetricSnapshot');
const Incident = require('../models/Incident');
const AlertRule = require('../models/AlertRule');

const seedTelemetry = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cloudops_db';
  await mongoose.connect(uri);
  console.log('[Seed] Connected to MongoDB...');

  await Promise.all([
    ServiceNode.deleteMany({}),
    MetricSnapshot.deleteMany({}),
    Incident.deleteMany({}),
    AlertRule.deleteMany({})
  ]);

  const services = await ServiceNode.create([
    {
      serviceId: 'svc-edge-gateway',
      name: 'API Edge Gateway Proxy',
      tier: 'TIER_0_CORE',
      replicaCount: 8,
      healthStatus: 'HEALTHY',
      sloTargetPercent: 99.99,
      dependencies: ['svc-auth-router', 'svc-payment-core', 'svc-order-dispatch']
    },
    {
      serviceId: 'svc-auth-router',
      name: 'Zero-Trust IAM & Token Router',
      tier: 'TIER_0_CORE',
      replicaCount: 4,
      healthStatus: 'HEALTHY',
      sloTargetPercent: 99.95,
      dependencies: ['svc-user-registry']
    },
    {
      serviceId: 'svc-payment-core',
      name: 'Multi-Rail Payment Engine',
      tier: 'TIER_0_CORE',
      replicaCount: 6,
      healthStatus: 'DEGRADED',
      sloTargetPercent: 99.99,
      dependencies: ['svc-ledger-db']
    },
    {
      serviceId: 'svc-order-dispatch',
      name: 'Fulfillment & Event Dispatcher',
      tier: 'TIER_1_CRITICAL',
      replicaCount: 4,
      healthStatus: 'HEALTHY',
      sloTargetPercent: 99.9,
      dependencies: []
    },
    {
      serviceId: 'svc-user-registry',
      name: 'User Identity Persistence Store',
      tier: 'TIER_1_CRITICAL',
      replicaCount: 3,
      healthStatus: 'HEALTHY',
      sloTargetPercent: 99.9,
      dependencies: []
    },
    {
      serviceId: 'svc-ledger-db',
      name: 'Double-Entry Ledger Coordinator',
      tier: 'TIER_0_CORE',
      replicaCount: 3,
      healthStatus: 'HEALTHY',
      sloTargetPercent: 99.99,
      dependencies: []
    }
  ]);

  const now = Date.now();
  const snapshots = [];
  services.forEach(svc => {
    for (let i = 0; i < 15; i++) {
      const isDegraded = svc.serviceId === 'svc-payment-core' && i < 3;
      snapshots.push({
        serviceId: svc.serviceId,
        timestamp: new Date(now - i * 60000),
        rps: isDegraded ? 840 : 1200 + Math.floor(Math.random() * 200),
        latencyP50Ms: isDegraded ? 340 : 45 + Math.floor(Math.random() * 10),
        latencyP95Ms: isDegraded ? 890 : 110 + Math.floor(Math.random() * 25),
        latencyP99Ms: isDegraded ? 1800 : 250 + Math.floor(Math.random() * 50),
        errorRatePercent: isDegraded ? 4.8 : 0.04,
        cpuUsagePercent: isDegraded ? 89 : 42,
        memoryUsagePercent: isDegraded ? 82 : 55
      });
    }
  });
  await MetricSnapshot.insertMany(snapshots);

  await Incident.create({
    incidentId: 'INC-9912-A1',
    serviceId: 'svc-payment-core',
    title: 'Upstream Latency Spike on Payment Core Settlement Worker',
    severity: 'P1_CRITICAL',
    status: 'INVESTIGATING',
    assignee: 'Primary On-Call SRE',
    rootCauseNotes: 'Investigating database connection pool saturation on ledger writer replica.',
    impactedDependencies: ['svc-edge-gateway']
  });

  await AlertRule.create([
    {
      ruleId: 'RULE-101',
      name: 'High P95 Latency Threshold',
      serviceId: 'svc-payment-core',
      metricType: 'LATENCY_P95',
      thresholdValue: 500,
      severity: 'P1_CRITICAL'
    },
    {
      ruleId: 'RULE-102',
      name: 'Elevated Error Rate Spikes',
      serviceId: 'svc-edge-gateway',
      metricType: 'ERROR_RATE',
      thresholdValue: 2.0,
      severity: 'P2_HIGH'
    }
  ]);

  console.log(`[Seed Complete] Inserted ${services.length} Microservices, ${snapshots.length} Snapshots, 1 Incident, 2 Alert Rules.`);
  await mongoose.disconnect();
};

if (require.main === module) {
  seedTelemetry().catch(console.error);
}

module.exports = seedTelemetry;
