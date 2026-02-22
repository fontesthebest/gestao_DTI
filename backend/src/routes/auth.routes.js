const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register); // Normally would be protected, but for demo/initial setup let's keep it open or protect by ADMIN
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;
