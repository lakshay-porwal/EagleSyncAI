const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  id: { type: String },
  sender: { type: String, enum: ["user", "ai"] },
  content: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  messages: [messageSchema],
  updatedAt: { type: Date, default: Date.now },
});

chatHistorySchema.index({ userId: 1 });

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
