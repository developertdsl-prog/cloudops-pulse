const MetricSnapshot = require('../models/MetricSnapshot');
const ServiceNode = require('../models/ServiceNode');
const { detectMetricAnomaly } = require('../services/anomalyDetector');

const ingestMetrics = async (req, res, next) => {
  try {
    const { serviceId, rps, latencyP50Ms, latencyP95Ms, latencyP99Ms, errorRatePercent, cpuUsagePercent, memoryUsagePercent } = req.body;

    if (!serviceId) {
      return res.status(400).json({ success: false, error: 'ValidationError', message: 'serviceId required.' });
    }

    const snapshot = await MetricSnapshot.create({
      serviceId,
      rps: rps || 100,
      latencyP50Ms: latencyP50Ms || 50,
      latencyP95Ms: latencyP95Ms || 120,
      latencyP99Ms: latencyP99Ms || 300,
      errorRatePercent: errorRatePercent || 0.05,
      cpuUsagePercent: cpuUsagePercent || 45,
      memoryUsagePercent: memoryUsagePercent || 60,
      timestamp: new Date()
    });

    const recentHistory = await MetricSnapshot.find({ serviceId })
      .sort({ timestamp: -1 })
      .skip(1)
      .limit(10);

    const anomalyEval = detectMetricAnomaly(snapshot, recentHistory);

    if (anomalyEval.hasAnomaly && snapshot.errorRatePercent > 5.0) {
      await ServiceNode.findOneAndUpdate({ serviceId }, { healthStatus: 'DEGRADED' });
    }

    res.status(201).json({
      success: true,
      data: snapshot,
      anomalyEvaluation: anomalyEval
    });
  } catch (error) {
    next(error);
  }
};

const getMetricsSummary = async (req, res, next) => {
  try {
    const services = await ServiceNode.find();
    const serviceIds = services.map(s => s.serviceId);

    const latestSnapshots = await Promise.all(
      serviceIds.map(id => MetricSnapshot.findOne({ serviceId: id }).sort({ timestamp: -1 }))
    );

    const validSnapshots = latestSnapshots.filter(Boolean);
    const totalRps = validSnapshots.reduce((acc, s) => acc + s.rps, 0);
    const avgLatency = validSnapshots.length > 0 
      ? Math.round(validSnapshots.reduce((acc, s) => acc + s.latencyP95Ms, 0) / validSnapshots.length) 
      : 0;
    const avgErrorRate = validSnapshots.length > 0
      ? parseFloat((validSnapshots.reduce((acc, s) => acc + s.errorRatePercent, 0) / validSnapshots.length).toFixed(2))
      : 0;

    res.json({
      success: true,
      data: {
        totalServices: services.length,
        healthyServices: services.filter(s => s.healthStatus === 'HEALTHY').length,
        degradedServices: services.filter(s => s.healthStatus !== 'HEALTHY').length,
        clusterTotalRps: totalRps,
        clusterAvgLatencyP95Ms: avgLatency,
        clusterAvgErrorRatePercent: avgErrorRate
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { ingestMetrics, getMetricsSummary };
