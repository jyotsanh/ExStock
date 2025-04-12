const User = require('../models/users');

class UserService {
  static async create({ email, username, password }) {
    const user = new User({ email, username, password });
    await user.save();
    return user;
  }

  static async findByEmail(email) {
    const user = await User.findOne({ email });
    this._resetDailyLimit(user);
    return user;
  }

  static async findByUsername(username) {
    const user = await User.findOne({ username });
    this._resetDailyLimit(user);
    return user;
  }

  static async findById(userId) {
    const user = await User.findOne({ userId });
    this._resetDailyLimit(user);
    return user;
  }

  static async findByEmailOrUsername(identifier) {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });
    this._resetDailyLimit(user);
    return user;
  }

  static async addCoins(userId, amount) {
    const user = await this.findById(userId);
    if (!user) return null;
    if (!user.premium) return { error: 'Only premium users can add coins' };

    user.virtualCoins += amount;
    await user.save();
    return user;
  }

  static async _resetDailyLimit(user) {
    if (!user) return;

    const now = new Date();
    const lastReset = new Date(user.lastLimitReset);
    const nowDate = now.toDateString();
    const lastResetDate = lastReset.toDateString();

    if (nowDate !== lastResetDate) {
      user.limit = 20;
      user.lastLimitReset = now;
      await user.save();
    }
  }
}

module.exports = UserService;