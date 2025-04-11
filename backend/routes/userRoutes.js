const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const userController = require('../controller/userController');

router.get('/profile', authenticateToken, userController.getProfile);

module.exports = router;