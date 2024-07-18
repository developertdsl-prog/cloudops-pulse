const rateStore = new Map();

const rateLimiter = (options = { windowMs: 60000, max: 300 }) => {
  return (req, res, next) => {
    const identifier = req.header('X-API-Key') || req.ip;
    const now = Date.now();

    const record = rateStore.get(identifier) || { count: 0, resetAt: now + options.windowMs };

    if (now > record.resetAt) {
      record.count = 1;
      record.resetAt = now + options.windowMs;
    } else {
      record.count += 1;
    }

    rateStore.set(identifier, record);

    res.setHeader('X-RateLimit-Limit', options.max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - record.count));

    if (record.count > options.max) {
      return res.status(429).json({
        success: false,
        error: 'RateLimitExceeded',
        message: 'Telemetry ingestion threshold exceeded.'
      });
    }

    next();
  };
};

module.exports = rateLimiter;
