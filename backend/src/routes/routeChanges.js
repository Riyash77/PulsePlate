const express = require('express');
const router = express.Router();
const { getRouteChanges, createRouteChange, reviewRouteChange } = require('../controllers/routeChangeController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', getRouteChanges);
router.post('/', authorize('DRIVER'), createRouteChange);
router.patch('/:id/review', authorize('AO'), reviewRouteChange);

module.exports = router;
