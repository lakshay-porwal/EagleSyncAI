const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");

// GET /api/opportunities
router.get("/", async (req, res, next) => {
  try {
    const { type, difficulty } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    const opportunities = await Opportunity.find(query).sort({ _id: -1 });
    res.json({ opportunities });
  } catch (err) {
    next(err);
  }
});

// POST /api/opportunities/seed — Run once to populate DB
router.post("/seed", async (req, res, next) => {
  try {
    const count = await Opportunity.countDocuments();
    if (count > 0) {
      return res.json({ message: `DB already has ${count} opportunities. Skipping seed.` });
    }

    const opportunities = require("../seeds/opportunities");
    await Opportunity.insertMany(opportunities);
    res.json({ message: `Seeded ${opportunities.length} opportunities successfully` });
  } catch (err) {
    next(err);
  }
});

const authMiddleware = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const { runApplyAgent } = require("../agents/applyAgent");

// GET /api/opportunities/applications
router.get("/applications", authMiddleware, async (req, res, next) => {
  try {
    const apps = await Application.find({ userId: req.user._id })
      .populate("opportunityId")
      .sort({ appliedAt: -1 });
    res.json({ applications: apps });
  } catch (err) {
    next(err);
  }
});

// POST /api/opportunities/auto-apply
router.post("/auto-apply", authMiddleware, async (req, res, next) => {
  try {
    const { steps, results } = await runApplyAgent(req.user._id, req.io);
    res.json({ steps, results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
