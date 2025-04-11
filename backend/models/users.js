const users = [];

class User {
  static async create({ email, username, password }) {
    const user = {
      id: Date.now().toString(),
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

  static async findById(id) {
    return users.find(user => user.id === id);
  }

  static async findByEmailOrUsername(emailOrUsername) {
    return users.find(user => 
      user.email === emailOrUsername || user.username === emailOrUsername
    );
  }
}

module.exports = User;