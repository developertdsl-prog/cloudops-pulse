const express = require('express');
const router = express.Router();
const authApiKey = require('../middleware/authApiKey');
const rateLimiter = require('../middleware/rateLimiter');
const { ingestMetrics, getMetricsSummary } = require('../controllers/metricController');

router.use(authApiKey);
router.post('/ingest', rateLimiter({ windowMs: 60000, max: 500 }), ingestMetrics);
router.get('/summary', getMetricsSummary);

module.exports = router;
