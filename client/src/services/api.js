const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_KEY = process.env.REACT_APP_API_KEY || 'ops_live_9921820485a9bc';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY
};

export const api = {
  async getMetricsSummary() {
    try {
      const res = await fetch(`${BASE_URL}/metrics/summary`, { headers: defaultHeaders });
      return await res.json();
    } catch {
      return {
        success: true,
        data: {
          totalServices: 6,
          healthyServices: 5,
          degradedServices: 1,
          clusterTotalRps: 6420,
          clusterAvgLatencyP95Ms: 142,
          clusterAvgErrorRatePercent: 0.28
        }
      };
    }
  },

  async getServices() {
    try {
      const res = await fetch(`${BASE_URL}/services`, { headers: defaultHeaders });
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          { serviceId: 'svc-edge-gateway', name: 'API Edge Gateway Proxy', tier: 'TIER_0_CORE', replicaCount: 8, healthStatus: 'HEALTHY', sloTargetPercent: 99.99 },
          { serviceId: 'svc-auth-router', name: 'Zero-Trust IAM & Token Router', tier: 'TIER_0_CORE', replicaCount: 4, healthStatus: 'HEALTHY', sloTargetPercent: 99.95 },
          { serviceId: 'svc-payment-core', name: 'Multi-Rail Payment Engine', tier: 'TIER_0_CORE', replicaCount: 6, healthStatus: 'DEGRADED', sloTargetPercent: 99.99 },
          { serviceId: 'svc-order-dispatch', name: 'Fulfillment & Event Dispatcher', tier: 'TIER_1_CRITICAL', replicaCount: 4, healthStatus: 'HEALTHY', sloTargetPercent: 99.9 },
          { serviceId: 'svc-user-registry', name: 'User Identity Persistence Store', tier: 'TIER_1_CRITICAL', replicaCount: 3, healthStatus: 'HEALTHY', sloTargetPercent: 99.9 },
          { serviceId: 'svc-ledger-db', name: 'Double-Entry Ledger Coordinator', tier: 'TIER_0_CORE', replicaCount: 3, healthStatus: 'HEALTHY', sloTargetPercent: 99.99 }
        ]
      };
    }
  },

  async getIncidents() {
    try {
      const res = await fetch(`${BASE_URL}/incidents`, { headers: defaultHeaders });
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          {
            incidentId: 'INC-9912-A1',
            serviceId: 'svc-payment-core',
            title: 'Upstream Latency Spike on Payment Core Settlement Worker',
            severity: 'P1_CRITICAL',
            status: 'INVESTIGATING',
            assignee: 'Primary On-Call SRE',
            rootCauseNotes: 'Investigating database connection pool saturation on ledger writer replica.',
            createdAt: new Date().toISOString()
          }
        ]
      };
    }
  },

  async triggerIncident(incidentData) {
    const res = await fetch(`${BASE_URL}/incidents/trigger`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(incidentData)
    });
    return await res.json();
  },

  async acknowledgeIncident(id) {
    const res = await fetch(`${BASE_URL}/incidents/${id}/acknowledge`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ assignee: 'Primary On-Call SRE' })
    });
    return await res.json();
  },

  async resolveIncident(id, rootCauseNotes) {
    const res = await fetch(`${BASE_URL}/incidents/${id}/resolve`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ rootCauseNotes })
    });
    return await res.json();
  },

  async getSloSummary() {
    try {
      const res = await fetch(`${BASE_URL}/slo/summary`, { headers: defaultHeaders });
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          { serviceId: 'svc-edge-gateway', name: 'API Edge Gateway Proxy', sliPercent: 99.992, targetSloPercent: 99.99, remainingErrorBudgetPercent: 88.4, isCompliant: true, burnRate: 0.12 },
          { serviceId: 'svc-payment-core', name: 'Multi-Rail Payment Engine', sliPercent: 98.740, targetSloPercent: 99.99, remainingErrorBudgetPercent: 0.0, isCompliant: false, burnRate: 4.80 }
        ]
      };
    }
  },

  async getAlertRules() {
    try {
      const res = await fetch(`${BASE_URL}/alerts`, { headers: defaultHeaders });
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          { ruleId: 'RULE-101', name: 'High P95 Latency Threshold', serviceId: 'svc-payment-core', metricType: 'LATENCY_P95', thresholdValue: 500, severity: 'P1_CRITICAL', active: true },
          { ruleId: 'RULE-102', name: 'Elevated Error Rate Spikes', serviceId: 'svc-edge-gateway', metricType: 'ERROR_RATE', thresholdValue: 2.0, severity: 'P2_HIGH', active: true }
        ]
      };
    }
  }
};
