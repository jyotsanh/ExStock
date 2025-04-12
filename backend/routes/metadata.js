const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Course = require('../models/course');


router.get('/user-metadata/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId })
      .populate('coursesTaken.course');

    if (!user) return res.status(404).json({ error: 'User not found' });

    const metadata = {
      name: user.username,
      courses: user.coursesTaken.map(item => ({
        level: item.course.level,
        title: item.course.title,
        score: item.score || 0,
      }))
    };

    res.json(metadata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
