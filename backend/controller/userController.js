const UserService = require('../services/userService');
const User = require('../models/users');
const Course = require('../models/course');
const Trade = require('../models/trade')

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

const getUserPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by userId field, not _id
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found." });

    // Fetch trades by user._id (since in Trade schema user is ObjectId)
    const trades = await Trade.find({ user: user._id }).sort({ timestamp: -1 });

    if (trades.length === 0) {
      return res.json({
        virtualCoins: user.virtualCoins,
        portfolio: [],
        transactionHistory: [],
      });
    }

    const holdings = {};

    trades.forEach(trade => {
      const { symbol, quantity, action, price, timestamp } = trade;

      if (!holdings[symbol]) {
        holdings[symbol] = {
          symbol,
          quantity: 0,
          totalCost: 0,
          lastTradeDate: timestamp
        };
      }

      if (action === "buy") {
        holdings[symbol].quantity += quantity;
        holdings[symbol].totalCost += price * quantity;
      } else if (action === "sell") {
        holdings[symbol].quantity -= quantity;
        holdings[symbol].totalCost -= price * quantity;
      }

      holdings[symbol].lastTradeDate = timestamp;
    });

    const portfolio = Object.values(holdings)
      .filter(h => h.quantity > 0)
      .map(h => ({
        symbol: h.symbol,
        quantity: h.quantity,
        avgBuyPrice: (h.totalCost / h.quantity).toFixed(2),
        totalInvested: h.totalCost.toFixed(2),
        lastTradeDate: h.lastTradeDate,
      }));

    const transactionHistory = trades.map(t => ({
      symbol: t.symbol,
      action: t.action,
      quantity: t.quantity,
      price: t.price,
      timestamp: t.timestamp
    }));

    return res.json({
      virtualCoins: user.virtualCoins,
      portfolio,
      transactionHistory
    });

  } catch (error) {
    console.error("Error getting portfolio:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserProfile,
  addCourseToUser,
  getUserPortfolio,
};
