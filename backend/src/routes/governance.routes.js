const express = require('express');
const {
    createContract, getContracts, deleteContract,
    createProject, getProjects, deleteProject
} = require('../controllers/governance.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/contracts', roleMiddleware(['ADMIN', 'COORDINATOR']), createContract);
router.get('/contracts', getContracts);
router.delete('/contracts/:id', roleMiddleware(['ADMIN', 'COORDINATOR']), deleteContract);

router.post('/projects', roleMiddleware(['ADMIN', 'COORDINATOR']), createProject);
router.get('/projects', getProjects);
router.delete('/projects/:id', roleMiddleware(['ADMIN', 'COORDINATOR']), deleteProject);

module.exports = router;
