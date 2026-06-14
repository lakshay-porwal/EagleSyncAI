const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Jobs", "Internships", "Hackathons", "Competitions", "Certifications", "Scholarships"],
    required: true,
  },
  title: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  link: { type: String, trim: true },
  reward: { type: String, trim: true },
  tags: [String],
  isActive: { type: Boolean, default: true },
});

opportunitySchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model("Opportunity", opportunitySchema);
