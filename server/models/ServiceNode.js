const mongoose = require('mongoose');

const ServiceNodeSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  tier: {
    type: String,
    enum: ['TIER_0_CORE', 'TIER_1_CRITICAL', 'TIER_2_SUPPORTING'],
    default: 'TIER_1_CRITICAL'
  },
  environment: {
    type: String,
    default: 'production'
  },
  clusterZone: {
    type: String,
    default: 'us-east-1a'
  },
  replicaCount: {
    type: Number,
    default: 3,
    min: 1
  },
  healthStatus: {
    type: String,
    enum: ['HEALTHY', 'DEGRADED', 'OUTAGE', 'MAINTENANCE'],
    default: 'HEALTHY',
    index: true
  },
  sloTargetPercent: {
    type: Number,
    default: 99.9
  },
  dependencies: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('ServiceNode', ServiceNodeSchema);
