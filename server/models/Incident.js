const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  incidentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  serviceId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW'],
    default: 'P2_HIGH',
    index: true
  },
  status: {
    type: String,
    enum: ['TRIGGERED', 'ACKNOWLEDGED', 'INVESTIGATING', 'MITIGATED', 'RESOLVED', 'CLOSED'],
    default: 'TRIGGERED',
    index: true
  },
  assignee: {
    type: String,
    default: 'On-Call SRE Engineer'
  },
  rootCauseNotes: {
    type: String,
    default: ''
  },
  impactedDependencies: [{
    type: String
  }],
  acknowledgedAt: Date,
  resolvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Incident', IncidentSchema);
