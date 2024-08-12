const INCIDENT_TRANSITIONS = {
  TRIGGERED: ['ACKNOWLEDGED', 'RESOLVED'],
  ACKNOWLEDGED: ['INVESTIGATING', 'RESOLVED'],
  INVESTIGATING: ['MITIGATED', 'RESOLVED'],
  MITIGATED: ['RESOLVED', 'INVESTIGATING'],
  RESOLVED: ['CLOSED', 'TRIGGERED'],
  CLOSED: []
};

const validateIncidentTransition = (currentStatus, targetStatus) => {
  const allowed = INCIDENT_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new Error(`Illegal incident state mutation from ${currentStatus} to ${targetStatus}`);
  }
  return true;
};

module.exports = { INCIDENT_TRANSITIONS, validateIncidentTransition };
