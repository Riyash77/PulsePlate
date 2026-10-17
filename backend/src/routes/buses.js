const express = require('express');
const router = express.Router();
const { getAllBuses, getBusById, getBusStatusSummary, updateBusStatus, getTodayRankings } = require('../controllers/busController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/summary', getBusStatusSummary);
router.get('/rankings/today', getTodayRankings);
router.get('/', getAllBuses);
router.get('/:id', getBusById);
router.patch('/:id/status', authorize('AO', 'ADMIN'), updateBusStatus);

module.exports = router;
