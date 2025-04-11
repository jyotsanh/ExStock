const users = [];

class User {
  static async create({ userId, email, username, password }) {
    const now = new Date();
    const user = {
      userId,
      email,
      username,
      password,
      premium: false,
      virtualCoins: 10000,
      limit: 20,
      lastLimitReset: now
    };
    users.push(user);
    return user;
  }

  static async findByEmail(email) {
    const user = users.find(user => user.email === email);
    this._resetDailyLimit(user);
    return user;
  }

  static async findByUsername(username) {
    const user = users.find(user => user.username === username);
    this._resetDailyLimit(user);
    return user;
  }

  static async findById(userId) {
    const user = users.find(user => user.userId === userId);
    this._resetDailyLimit(user);
    return user;
  }

  static async findByEmailOrUsername(emailOrUsername) {
    const user = users.find(user =>
      user.email === emailOrUsername || user.username === emailOrUsername
    );
    this._resetDailyLimit(user);
    return user;
  }

  static async addCoins(userId, amount) {
    const user = await this.findById(userId);
    if (!user) return null;
    if (!user.premium) return { error: 'Only premium users can add coins' };

    user.virtualCoins += amount;
    return user;
  }

  static _resetDailyLimit(user) {
    if (!user) return;

    const now = new Date();
    const lastReset = new Date(user.lastLimitReset);

    const nowDate = now.toDateString();
    const lastResetDate = lastReset.toDateString();

    if (nowDate !== lastResetDate) {
      user.limit = 20;
      user.lastLimitReset = now;
    }
  }
}

module.exports = User;
