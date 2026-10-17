const express = require('express');
const router = express.Router();
const { getAttendanceLogs, getTodayAttendance, logAttendance } = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/today', getTodayAttendance);
router.get('/', getAttendanceLogs);
router.post('/', logAttendance); // Called by AI module

module.exports = router;
