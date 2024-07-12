const mongoose = require('mongoose');

const AlertRuleSchema = new mongoose.Schema({
  ruleId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  serviceId: {
    type: String,
    required: true,
    index: true
  },
  metricType: {
    type: String,
    enum: ['LATENCY_P95', 'ERROR_RATE', 'CPU_USAGE', 'MEMORY_USAGE', 'RPS_DROP'],
    required: true
  },
  comparator: {
    type: String,
    enum: ['GREATER_THAN', 'LESS_THAN', 'EQUAL'],
    default: 'GREATER_THAN'
  },
  thresholdValue: {
    type: Number,
    required: true
  },
  durationMinutes: {
    type: Number,
    default: 5
  },
  severity: {
    type: String,
    enum: ['P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW'],
    default: 'P2_HIGH'
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('AlertRule', AlertRuleSchema);
