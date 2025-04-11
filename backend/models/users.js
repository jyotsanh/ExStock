const users = [];

class User {
  static async create({ userId, email, username, password }) {
    const user = {
      userId,
      email,
      username,
      password,
      premium: false,              
      virtualCoins: 10000          
    };
    users.push(user);
    return user;
  }

  static async findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static async findByUsername(username) {
    return users.find(user => user.username === username);
  }

  static async findById(userId) {
    return users.find(user => user.userId === userId);
  }

  static async findByEmailOrUsername(emailOrUsername) {
    return users.find(user => 
      user.email === emailOrUsername || user.username === emailOrUsername
    );
  }

  static async addCoins(userId, amount) {
    const user = await this.findById(userId);
    if (!user) return null;
    if (!user.premium) return { error: 'Only premium users can add coins' };

    user.virtualCoins += amount;
    return user;
  }
}

module.exports = User;
