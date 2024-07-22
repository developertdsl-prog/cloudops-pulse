const ServiceNode = require('../models/ServiceNode');
const { calculateBlastRadius } = require('../services/topologyMapper');

const listServices = async (req, res, next) => {
  try {
    const services = await ServiceNode.find().sort({ tier: 1, name: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

const registerService = async (req, res, next) => {
  try {
    const { serviceId, name, tier, environment, replicaCount, sloTargetPercent, dependencies } = req.body;
    if (!serviceId || !name) {
      return res.status(400).json({ success: false, error: 'ValidationError', message: 'serviceId and name required.' });
    }

    const node = await ServiceNode.create({
      serviceId,
      name,
      tier: tier || 'TIER_1_CRITICAL',
      environment: environment || 'production',
      replicaCount: replicaCount || 3,
      sloTargetPercent: sloTargetPercent || 99.9,
      dependencies: dependencies || []
    });

    res.status(201).json({ success: true, data: node });
  } catch (error) {
    next(error);
  }
};

const getServiceTopology = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allServices = await ServiceNode.find();
    const service = allServices.find(s => s.serviceId === id);

    if (!service) {
      return res.status(404).json({ success: false, error: 'NotFound', message: `Service ${id} not found.` });
    }

    const blastRadius = calculateBlastRadius(id, allServices);

    res.json({
      success: true,
      data: {
        service,
        downstreamDependencies: service.dependencies,
        upstreamImpactedServices: blastRadius,
        blastRadiusCount: blastRadius.length
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { listServices, registerService, getServiceTopology };
