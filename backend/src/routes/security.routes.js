const express = require('express');
const { createIncident, getIncidents, createVulnerability, getVulnerabilities } = require('../controllers/security.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/incidents', roleMiddleware(['ADMIN', 'COORDINATOR']), createIncident);
router.get('/incidents', getIncidents);

router.post('/vulnerabilities', roleMiddleware(['ADMIN', 'COORDINATOR']), createVulnerability);
router.get('/vulnerabilities', getVulnerabilities);

module.exports = router;
