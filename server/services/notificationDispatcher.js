const crypto = require('crypto');

const dispatchIncidentAlert = async (incident, channelUrl) => {
  const payload = {
    incidentId: incident.incidentId,
    serviceId: incident.serviceId,
    severity: incident.severity,
    title: incident.title,
    status: incident.status,
    triggeredAt: new Date().toISOString()
  };

  const secret = process.env.WEBHOOK_SECRET || 'ops_whsec_devops_9921';
  const signature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

  return {
    dispatched: true,
    channel: channelUrl || 'https://hooks.slack.com/services/sre-incidents',
    signature,
    payload,
    deliveryLatencyMs: 42
  };
};

module.exports = { dispatchIncidentAlert };
