const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  stepNumber: Number,
  type: {
    type: String,
    enum: ["thinking", "tool_call", "tool_result", "decision"],
  },
  content: String,
  toolName: String,
  timestamp: { type: Date, default: Date.now },
});

const agentLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  agentName: { type: String, required: true },
  trigger: { type: String },
  steps: [stepSchema],
  outcome: { type: String },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

agentLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("AgentLog", agentLogSchema);
