const express = require('express');
const router = express.Router();
const authApiKey = require('../middleware/authApiKey');
const { getSloSummary } = require('../controllers/sloController');

router.use(authApiKey);
router.get('/summary', getSloSummary);

module.exports = router;
