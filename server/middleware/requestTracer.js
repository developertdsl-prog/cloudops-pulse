const crypto = require('crypto');

const requestTracer = (req, res, next) => {
  const traceId = req.header('X-Trace-ID') || `trace_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  req.traceId = traceId;
  res.setHeader('X-Trace-ID', traceId);
  next();
};

module.exports = requestTracer;
