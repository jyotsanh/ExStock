const express = require('express');
const router = express.Router();
const courseController = require('../controller/courseController');

router.post('/create', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/level/:level', courseController.getCoursesByLevel);
router.get('/:id', courseController.getCourseById);

module.exports = router;
