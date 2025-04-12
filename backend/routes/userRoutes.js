const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getUserProfile, addCourseToUser } = require('../controller/userController');


router.get('/profile/:id', authenticateToken, getUserProfile);
router.post('/:userId/add-course', authenticateToken, addCourseToUser);


module.exports = router;
