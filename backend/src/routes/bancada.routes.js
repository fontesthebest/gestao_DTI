const express = require('express');
const {
    createEquipment,
    getEquipments,
    createET,
    updateET,
    deleteET,
    getETList
} = require('../controllers/bancada.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/equipment', roleMiddleware(['ADMIN', 'COORDINATOR', 'TECHNICIAN']), createEquipment);
router.get('/equipment', getEquipments);

// Substituindo OS por ET
router.post('/et', roleMiddleware(['ADMIN', 'COORDINATOR', 'TECHNICIAN']), createET);
router.get('/et', getETList);
router.put('/et/:id', roleMiddleware(['ADMIN', 'COORDINATOR', 'TECHNICIAN']), updateET);
router.delete('/et/:id', roleMiddleware(['ADMIN', 'COORDINATOR']), deleteET);

module.exports = router;
