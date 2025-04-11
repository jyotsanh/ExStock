const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], required: true },
  platform: { type: String, enum: ['YouTube', 'Website', 'Offline', 'Other'], default: 'Other' },
  link: { type: String },
  duration: { type: String },
  instructor: { type: String },
  tags: [String],

 
  introduction: { type: String },
  description: { type: String },
  references: [{ type: String }],  
  quiz: [
    {
      question: String,
      options: [String],
      answer: String,
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
