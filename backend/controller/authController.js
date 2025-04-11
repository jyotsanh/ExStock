const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');

const authController = {
  async signup(req, res) {
    try {
      const { email, username, password, confirmPassword } = req.body;

      if (!email || !username || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      const emailExists = await User.findByEmail(email);
      const usernameExists = await User.findByUsername(username);

      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      if (usernameExists) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, username, password: hashedPassword });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.status(201).json({ 
        message: 'User created successfully',
        token,
        user: { id: user.id, email: user.email, username: user.username }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  async login(req, res) {
    try {
      const { emailOrUsername, password } = req.body;

      if (!emailOrUsername || !password) {
        return res.status(400).json({ message: 'Email/username and password are required' });
      }

      const user = await User.findByEmailOrUsername(emailOrUsername);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      res.json({ 
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, username: user.username }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController;