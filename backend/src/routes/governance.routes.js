const express = require('express');
const { createContract, getContracts } = require('../controllers/governance.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/contracts', roleMiddleware(['ADMIN', 'COORDINATOR']), createContract);
router.get('/contracts', getContracts);

module.exports = router;
