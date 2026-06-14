const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true, trim: true },
  recipient: { type: String, trim: true },
  issuer: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ["Certificate", "Hackathon", "Internship", "Achievement"],
    required: true,
  },
  txHash: { type: String },
  status: {
    type: String,
    enum: ["Verified", "Pending", "Failed"],
    default: "Verified",
  },
  date: { type: String },
});

credentialSchema.index({ userId: 1 });

module.exports = mongoose.model("Credential", credentialSchema);
