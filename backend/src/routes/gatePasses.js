const express = require('express');
const router = express.Router();
const { getGatePasses, createGatePass, reviewGatePass } = require('../controllers/gatePassController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', getGatePasses);
router.post('/', authorize('DRIVER'), createGatePass);
router.patch('/:id/review', authorize('AO'), reviewGatePass);

module.exports = router;
