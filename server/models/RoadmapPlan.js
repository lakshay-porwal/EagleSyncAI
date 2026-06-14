const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  id: String,
  title: String,
  completed: { type: Boolean, default: false },
});

const weekSchema = new mongoose.Schema({
  id: String,
  title: String,
  completionPercent: { type: Number, default: 0 },
  tasks: [taskSchema],
});

const monthSchema = new mongoose.Schema({
  month: String,
  title: String,
  completed: { type: Boolean, default: false },
  completionPercent: { type: Number, default: 0 },
  weeks: [weekSchema],
});

const roadmapPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  months: [monthSchema],
  generatedAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

roadmapPlanSchema.index({ userId: 1 });

module.exports = mongoose.model("RoadmapPlan", roadmapPlanSchema);
