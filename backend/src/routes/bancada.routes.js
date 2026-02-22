const express = require('express');
const { createEquipment, getEquipments, createOS, updateOS, getOSList } = require('../controllers/bancada.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/equipment', roleMiddleware(['ADMIN', 'COORDINATOR', 'TECHNICIAN']), createEquipment);
router.get('/equipment', getEquipments);

router.post('/os', roleMiddleware(['ADMIN', 'COORDINATOR', 'TECHNICIAN']), createOS);
router.get('/os', getOSList);
router.put('/os/:id', roleMiddleware(['ADMIN', 'COORDINATOR', 'TECHNICIAN']), updateOS);

module.exports = router;
