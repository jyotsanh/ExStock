const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getUserProfile, addCourseToUser } = require('../controller/userController');
const { getUserPortfolio } = require("../controller/userController");

router.get("/:userId/portfolio", getUserPortfolio);


router.get('/profile/:id', authenticateToken, getUserProfile);
router.post('/:userId/add-course', authenticateToken, addCourseToUser);



module.exports = router;
