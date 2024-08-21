const AlertRule = require('../models/AlertRule');

const listAlertRules = async (req, res, next) => {
  try {
    const rules = await AlertRule.find().sort({ createdAt: -1 });
    res.json({ success: true, count: rules.length, data: rules });
  } catch (error) {
    next(error);
  }
};

const createAlertRule = async (req, res, next) => {
  try {
    const { ruleId, name, serviceId, metricType, comparator, thresholdValue, durationMinutes, severity } = req.body;
    const rule = await AlertRule.create({
      ruleId: ruleId || `RULE-${Date.now().toString().slice(-4)}`,
      name,
      serviceId,
      metricType,
      comparator: comparator || 'GREATER_THAN',
      thresholdValue,
      durationMinutes: durationMinutes || 5,
      severity: severity || 'P2_HIGH'
    });
    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    next(error);
  }
};

module.exports = { listAlertRules, createAlertRule };
