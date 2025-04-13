const User = require('../models/users');

const saveMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const { from, text } = req.body;

    // No token verification needed, but we should validate the input
    if (!userId || !from || !text) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    await User.updateOne(
      { userId },
      { $push: { conversations: { from, text } } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findOne({ userId })
      .select('+conversations')
      .slice('conversations', -limit);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.conversations);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  saveMessage,
  getConversation
};