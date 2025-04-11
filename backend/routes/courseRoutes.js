const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Create a course
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get courses by level
router.get('/level/:level', async (req, res) => {
  try {
    const level = req.params.level;
    const courses = await Course.find({ level });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
