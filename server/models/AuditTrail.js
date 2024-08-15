const mongoose = require('mongoose');

const AuditTrailSchema = new mongoose.Schema({
  incidentId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true
  },
  previousState: String,
  newState: String,
  actor: {
    type: String,
    default: 'SYSTEM_MONITOR'
  },
  comment: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: false });

module.exports = mongoose.model('AuditTrail', AuditTrailSchema);
