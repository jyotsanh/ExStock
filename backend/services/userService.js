const User = require('../models/users');

const UserService = {
  async findByEmail(email) {
    return await User.findOne({ email });
  },

  async findByUsername(username) {
    return await User.findOne({ username });
  },

  async findByEmailOrUsername(emailOrUsername) {
    return await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });
  },

  async findByUserId(userId) {
    return await User.findOne({ userId });
  },

  async create(userData) {
    console.log('\n--- START UserService.create ---');
    console.log('Full userData object:', userData);
    console.log('Type of userData:', typeof userData);
    console.log('Keys in userData:', Object.keys(userData));
    
    if (!userData.userId) {
      console.error(' userId is missing in userData');
      throw new Error('userId is required');
    }
  
    console.log('Creating user with userId:', userData.userId);
    
    const user = new User({
      userId: userData.userId,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      premium: userData.premium || false,
      balance: userData.balance || 10000,
    });
  
    console.log('User object before save:', user);
    
    await user.save();
    
    console.log('User created successfully:', user);
    console.log('--- END UserService.create ---\n');
    
    return user;
  }
};

module.exports = UserService;
