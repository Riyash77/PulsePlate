const express = require('express');
const router = express.Router();
const { getAllRoutes, getRouteById, getRouteETA } = require('../controllers/routeController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', getAllRoutes);
router.get('/:id/eta', getRouteETA);
router.get('/:id', getRouteById);

module.exports = router;
