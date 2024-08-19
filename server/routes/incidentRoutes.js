const express = require('express');
const router = express.Router();
const authApiKey = require('../middleware/authApiKey');
const { listIncidents, triggerIncident, acknowledgeIncident, resolveIncident } = require('../controllers/incidentController');

router.use(authApiKey);
router.get('/', listIncidents);
router.post('/trigger', triggerIncident);
router.post('/:id/acknowledge', acknowledgeIncident);
router.post('/:id/resolve', resolveIncident);

module.exports = router;
