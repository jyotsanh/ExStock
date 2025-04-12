const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  premium: { type: Boolean, default: false },
  virtualCoins: { type: Number, default: 10000 },
  limit: { type: Number, default: 20 },
  lastLimitReset: { type: Date, default: Date.now },
  coursesTaken: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
      score: Number,              
      completedAt: Date            
    }
  ]
});


const User = mongoose.model('User', userSchema);
module.exports = User;
