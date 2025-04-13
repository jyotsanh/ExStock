const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: { type: String, enum: ['user', 'bot'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

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
  ],
  conversations: {
    type: [messageSchema],
    default: [],
    select: false 
  }
}, { timestamps: true });


userSchema.index({ userId: 1, 'conversations.timestamp': -1 });

const User = mongoose.model('User', userSchema);
module.exports = User;