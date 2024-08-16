const crypto = require('crypto');
const Incident = require('../models/Incident');
const ServiceNode = require('../models/ServiceNode');
const AuditTrail = require('../models/AuditTrail');
const { validateIncidentTransition } = require('../services/incidentStateMachine');
const { dispatchIncidentAlert } = require('../services/notificationDispatcher');
const { calculateBlastRadius } = require('../services/topologyMapper');

const listIncidents = async (req, res, next) => {
  try {
    const { status, severity } = req.query;
    const query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;

    const incidents = await Incident.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    next(error);
  }
};

const triggerIncident = async (req, res, next) => {
  try {
    const { serviceId, title, severity = 'P2_HIGH', rootCauseNotes } = req.body;
    if (!serviceId || !title) {
      return res.status(400).json({ success: false, error: 'ValidationError', message: 'serviceId and title required.' });
    }

    const allServices = await ServiceNode.find();
    const impacted = calculateBlastRadius(serviceId, allServices);
    const incidentId = `INC-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    const incident = await Incident.create({
      incidentId,
      serviceId,
      title,
      severity,
      status: 'TRIGGERED',
      rootCauseNotes: rootCauseNotes || 'Automated metric anomaly alert trigger',
      impactedDependencies: impacted
    });

    await ServiceNode.findOneAndUpdate({ serviceId }, { healthStatus: 'DEGRADED' });

    await AuditTrail.create({
      incidentId,
      action: 'INCIDENT_TRIGGERED',
      newState: 'TRIGGERED',
      comment: `Severity ${severity} declared for ${serviceId}`
    });

    setImmediate(async () => {
      try { await dispatchIncidentAlert(incident); } catch (e) { console.error(e); }
    });

    res.status(201).json({ success: true, data: incident });
  } catch (error) {
    next(error);
  }
};

const acknowledgeIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const incident = await Incident.findOne({ incidentId: id });

    if (!incident) return res.status(404).json({ success: false, error: 'NotFound' });

    validateIncidentTransition(incident.status, 'ACKNOWLEDGED');
    const oldStatus = incident.status;
    incident.status = 'ACKNOWLEDGED';
    incident.acknowledgedAt = new Date();
    await incident.save();

    await AuditTrail.create({
      incidentId: id,
      action: 'STATUS_TRANSITION',
      previousState: oldStatus,
      newState: 'ACKNOWLEDGED'
    });

    res.json({ success: true, data: incident });
  } catch (error) {
    next(error);
  }
};

const resolveIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rootCauseNotes } = req.body;
    const incident = await Incident.findOne({ incidentId: id });

    if (!incident) return res.status(404).json({ success: false, error: 'NotFound' });

    validateIncidentTransition(incident.status, 'RESOLVED');
    const oldStatus = incident.status;
    incident.status = 'RESOLVED';
    incident.resolvedAt = new Date();
    if (rootCauseNotes) incident.rootCauseNotes = rootCauseNotes;
    await incident.save();

    await ServiceNode.findOneAndUpdate({ serviceId: incident.serviceId }, { healthStatus: 'HEALTHY' });

    await AuditTrail.create({
      incidentId: id,
      action: 'INCIDENT_RESOLVED',
      previousState: oldStatus,
      newState: 'RESOLVED',
      comment: rootCauseNotes || 'Remediation completed.'
    });

    res.json({ success: true, message: 'Incident resolved.', data: incident });
  } catch (error) {
    next(error);
  }
};

module.exports = { listIncidents, triggerIncident, acknowledgeIncident, resolveIncident };
