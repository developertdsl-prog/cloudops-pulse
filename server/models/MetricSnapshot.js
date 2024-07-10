const mongoose = require('mongoose');

const MetricSnapshotSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  rps: {
    type: Number,
    required: true,
    min: 0
  },
  latencyP50Ms: {
    type: Number,
    required: true
  },
  latencyP95Ms: {
    type: Number,
    required: true
  },
  latencyP99Ms: {
    type: Number,
    required: true
  },
  errorRatePercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  cpuUsagePercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  memoryUsagePercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, { timestamps: false });

MetricSnapshotSchema.index({ serviceId: 1, timestamp: -1 });

module.exports = mongoose.model('MetricSnapshot', MetricSnapshotSchema);
