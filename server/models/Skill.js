const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: Number,
    min: 0,
    max: 100,
    default: 50,
  },
  fullMark: {
    type: Number,
    default: 100,
  },
  assessedBy: {
    type: String,
    enum: ["user", "agent"],
    default: "user",
  },
  history: [
    {
      value: { type: Number },
      date: { type: Date, default: Date.now },
      assessedBy: { type: String },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

skillSchema.index({ userId: 1 });

module.exports = mongoose.model("Skill", skillSchema);
