const express = require('express');
const { createServer, getServers, updateServerStatus } = require('../controllers/infra.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/servers', roleMiddleware(['ADMIN', 'COORDINATOR']), createServer);
router.get('/servers', getServers);
router.put('/servers/:id/status', roleMiddleware(['ADMIN', 'COORDINATOR', 'TECHNICIAN']), updateServerStatus);

module.exports = router;
