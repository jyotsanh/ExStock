const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getUserProfile, addCourseToUser } = require('../controller/userController');
const { getUserPortfolio } = require("../controller/userController");
const { saveMessage, getConversation } = require("../controller/conversationController")

router.get("/:userId/portfolio", getUserPortfolio);


router.get('/profile/:id', authenticateToken, getUserProfile);
router.post('/:userId/add-course', authenticateToken, addCourseToUser);

router.post('/:userId/messages',  saveMessage);
router.get('/:userId/messages', getConversation);

module.exports = router;
