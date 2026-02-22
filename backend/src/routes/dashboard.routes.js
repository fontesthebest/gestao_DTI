const express = require('express');
const { getAdminStats } = require('../controllers/dashboard.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', roleMiddleware(['ADMIN', 'COORDINATOR']), getAdminStats);

module.exports = router;
