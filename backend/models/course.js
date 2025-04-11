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

courseSchema.statics.calculateScore = function(course, userAnswers) {
  let score = 0;

  course.quiz.forEach((q, i) => {
    const userAnswer = userAnswers[i];
    if (
      userAnswer &&
      userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase()
    ) {
      score++;
    }
  });

  return score;
};

module.exports = mongoose.model('Course', courseSchema);
