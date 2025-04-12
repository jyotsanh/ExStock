const UserService = require('../services/userService');
const User = require('../models/users');
const Course = require('../models/course');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserService.findByUserId(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      userId: user.userId,
      email: user.email,
      username: user.username,
      premium: user.premium,
      balance: user.virtualCoins
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const addCourseToUser = async (req, res) => {
  const { userId } = req.params;
  const { courseId, score } = req.body;

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyTaken = user.coursesTaken.some(ct =>
      ct.course.toString() === courseId
    );
    if (alreadyTaken) {
      return res.status(400).json({ message: 'Course already taken by user' });
    }

    user.coursesTaken.push({
      course: courseId,
      score,
      completedAt: new Date()
    });

    await user.save();

    res.status(200).json({ message: 'Course added to user successfully', user });
  } catch (error) {
    console.error('Error adding course to user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  addCourseToUser,
};
