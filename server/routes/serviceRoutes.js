const express = require('express');
const router = express.Router();
const authApiKey = require('../middleware/authApiKey');
const { listServices, registerService, getServiceTopology } = require('../controllers/serviceController');

router.use(authApiKey);
router.get('/', listServices);
router.post('/', registerService);
router.get('/:id/topology', getServiceTopology);

module.exports = router;
