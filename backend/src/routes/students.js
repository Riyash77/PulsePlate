const express = require('express');
const router = express.Router();
const { getStudentProfile, selectBus, updateFcmToken, getStudentNotifications } = require('../controllers/studentController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);
router.use(authorize('STUDENT'));

router.get('/profile', getStudentProfile);
router.patch('/select-bus', selectBus);
router.patch('/fcm-token', updateFcmToken);
router.get('/notifications', getStudentNotifications);
router.get('/my-notifications', getStudentNotifications);

module.exports = router;
