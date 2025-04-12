const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controller/userController');


router.get('/profile/:id', authenticateToken, getUserProfile);


module.exports = router;
