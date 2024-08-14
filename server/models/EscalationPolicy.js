const mongoose = require('mongoose');

const EscalationPolicySchema = new mongoose.Schema({
  policyId: {
    type: String,
    required: true,
    unique: true
  },
  serviceTier: {
    type: String,
    required: true
  },
  escalationDelayMinutes: {
    type: Number,
    default: 10
  },
  primaryResponderEmail: {
    type: String,
    required: true
  },
  secondaryResponderEmail: {
    type: String,
    required: true
  },
  slackChannel: {
    type: String,
    default: '#sre-incidents'
  }
}, { timestamps: true });

module.exports = mongoose.model('EscalationPolicy', EscalationPolicySchema);
