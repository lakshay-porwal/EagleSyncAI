const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["Technical", "HR", "Behavioral", "System Design"],
    required: true,
  },
  questions: [String],
  answers: [String],
  score: { type: Number, min: 0, max: 100 },
  feedback: { type: String },
  perAnswerFeedback: [String],
  improvementTips: [String],
  date: { type: Date, default: Date.now },
});

interviewSessionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
