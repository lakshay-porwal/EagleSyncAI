const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
  phone: { type: String, trim: true },
  education: { type: String, trim: true },
  careerGoals: { type: String, trim: true },
  currentRole: { type: String, trim: true },
  targetRole: { type: String, default: "SDE", trim: true },
  projects: { type: [String], default: [] },
  resumeName: { type: String, trim: true },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date },
  onboardingComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
