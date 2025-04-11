const users = [];

class User {
  static async create({ userId, email, username, password }) {
    const user = {
      userId,
      email,
      username,
      password
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
}

module.exports = User;