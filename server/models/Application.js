const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity", required: true },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["Submitted", "Reviewing", "Shortlisted", "Accepted"], default: "Submitted" },
  coverLetter: { type: String },
});

applicationSchema.index({ userId: 1, opportunityId: 1 });

module.exports = mongoose.model("Application", applicationSchema);
