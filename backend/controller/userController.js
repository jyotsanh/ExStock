const UserService = require('../services/userService');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserService.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      userId: user._id,
      email: user.email,
      username: user.username,
      premium: user.premium,
      balance: user.virtualCoins
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserProfile };
