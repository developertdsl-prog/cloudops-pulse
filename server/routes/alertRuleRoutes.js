const express = require('express');
const router = express.Router();
const authApiKey = require('../middleware/authApiKey');
const { listAlertRules, createAlertRule } = require('../controllers/alertRuleController');

router.use(authApiKey);
router.get('/', listAlertRules);
router.post('/', createAlertRule);

module.exports = router;
