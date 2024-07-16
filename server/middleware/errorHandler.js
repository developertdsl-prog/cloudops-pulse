const errorHandler = (err, req, res, next) => {
  console.error('[CloudOps Exception]', err);

  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      details
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'InternalServiceError',
    message: err.message || 'An unexpected telemetry processing exception occurred.',
    traceId: req.traceId
  });
};

module.exports = errorHandler;
