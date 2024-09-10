const ServiceNode = require('../models/ServiceNode');
const MetricSnapshot = require('../models/MetricSnapshot');
const { calculateSloStatus } = require('../services/sloCalculator');

const getSloSummary = async (req, res, next) => {
  try {
    const services = await ServiceNode.find();
    const sloReports = await Promise.all(
      services.map(async (service) => {
        const snapshots = await MetricSnapshot.find({ serviceId: service.serviceId })
          .sort({ timestamp: -1 })
          .limit(60);

        const totalSnapshots = snapshots.length;
        const healthySnapshots = snapshots.filter(s => s.errorRatePercent < 1.0).length;

        const sloEval = calculateSloStatus(
          service.sloTargetPercent || 99.9,
          healthySnapshots,
          totalSnapshots
        );

        return {
          serviceId: service.serviceId,
          name: service.name,
          tier: service.tier,
          ...sloEval
        };
      })
    );

    res.json({ success: true, data: sloReports });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSloSummary };
