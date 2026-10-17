const express = require('express');
const router = express.Router();
const { getAllDrivers, getDriverById, getVerificationLogs, logVerification } = require('../controllers/driverController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/verification-logs', getVerificationLogs);
router.post('/verify', logVerification);
router.get('/', getAllDrivers);
router.get('/:id', getDriverById);

module.exports = router;
