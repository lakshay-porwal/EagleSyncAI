const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Skill = require("../models/Skill");
const RoadmapPlan = require("../models/RoadmapPlan");
const ChatHistory = require("../models/ChatHistory");
const Credential = require("../models/Credential");
const InterviewSession = require("../models/InterviewSession");
const Application = require("../models/Application");
const { triggerConnectedAgents } = require("../utils/agentOrchestrator");
const { sendWhatsAppMessage } = require("../services/whatsappService");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/users/profile
router.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/profile
router.put("/profile", authMiddleware, async (req, res, next) => {
  try {
    const { name, phone, education, careerGoals, currentRole, targetCategory, targetRole, projects, resumeName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, education, careerGoals, currentRole, targetCategory, targetRole, projects, resumeName },
      { new: true, runValidators: true }
    ).select("-password");
    
    // Trigger background capability/career matching updates
    triggerConnectedAgents(req.user._id, req.io);

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/skills
router.get("/skills", authMiddleware, async (req, res, next) => {
  try {
    const skills = await Skill.find({ userId: req.user._id });
    res.json({ skills });
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/skills
router.put(
  "/skills",
  authMiddleware,
  [body("skills").isArray().withMessage("Skills must be an array"),
   body("skills.*.value").isInt({ min: 0, max: 100 }).withMessage("Skill value must be 0-100")],
  validate,
  async (req, res, next) => {
    try {
      const { skills } = req.body;
      const userId = req.user._id;

      for (const skill of skills) {
        await Skill.findOneAndUpdate(
          { userId, name: skill.name },
          {
            $set: { value: skill.value, assessedBy: "user", updatedAt: new Date() },
            $push: { history: { value: skill.value, date: new Date(), assessedBy: "user" } },
          },
          { upsert: true, new: true }
        );
      }

      const updated = await Skill.find({ userId });
      
      // Trigger background capability/career matching updates
      triggerConnectedAgents(userId, req.io);

      res.json({ skills: updated });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/users/roadmap
router.get("/roadmap", authMiddleware, async (req, res, next) => {
  try {
    const roadmap = await RoadmapPlan.findOne({ userId: req.user._id });
    res.json({ roadmap: roadmap || null });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/users/roadmap/toggle-task
router.patch("/roadmap/toggle-task", authMiddleware, async (req, res, next) => {
  try {
    const { monthIndex, weekIndex, taskId } = req.body;
    const roadmap = await RoadmapPlan.findOne({ userId: req.user._id });

    if (!roadmap) return res.status(404).json({ error: "Roadmap not found" });

    const task = roadmap.months[monthIndex]?.weeks[weekIndex]?.tasks?.find(
      (t) => t.id === taskId
    );
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.completed = !task.completed;

    // Recalc week completion %
    const week = roadmap.months[monthIndex].weeks[weekIndex];
    week.completionPercent = Math.round(
      (week.tasks.filter((t) => t.completed).length / week.tasks.length) * 100
    );

    // Recalc month completion %
    const month = roadmap.months[monthIndex];
    const allTasks = month.weeks.flatMap((w) => w.tasks);
    month.completionPercent = Math.round(
      (allTasks.filter((t) => t.completed).length / allTasks.length) * 100
    );
    month.completed = month.completionPercent === 100;

    roadmap.lastUpdated = new Date();
    roadmap.markModified("months"); // CRITICAL for nested array updates
    await roadmap.save();

    res.json({ roadmap });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/chat-history
router.get("/chat-history", authMiddleware, async (req, res, next) => {
  try {
    const doc = await ChatHistory.findOne({ userId: req.user._id });
    res.json({ messages: doc?.messages || [] });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/chat-history
router.post("/chat-history", authMiddleware, async (req, res, next) => {
  try {
    const { messages } = req.body;
    await ChatHistory.findOneAndUpdate(
      { userId: req.user._id },
      { $push: { messages: { $each: messages } }, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/credentials
router.get("/credentials", authMiddleware, async (req, res, next) => {
  try {
    const credentials = await Credential.find({ userId: req.user._id }).sort({ _id: -1 });
    res.json({ credentials });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/credentials
router.post(
  "/credentials",
  authMiddleware,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("issuer").trim().notEmpty().withMessage("Issuer is required"),
    body("type").isIn(["Certificate", "Hackathon", "Internship", "Achievement"]).withMessage("Invalid type"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, recipient, issuer, type } = req.body;
      const txHash =
        "0x" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 8);
      const date = new Date().toLocaleDateString("en-IN", {
        year: "numeric", month: "short", day: "numeric",
      });

      const credential = await Credential.create({
        userId: req.user._id,
        title,
        recipient: recipient || req.user.name,
        issuer,
        type,
        txHash,
        status: "Verified",
        date,
      });

      res.status(201).json({ credential });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/users/streak
router.get("/streak", authMiddleware, async (req, res) => {
  res.json({ streak: req.user.streak, lastActive: req.user.lastActive });
});

// PATCH /api/users/streak
router.patch("/streak", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { streak: req.body.streak, lastActive: new Date() },
      { new: true }
    ).select("-password");
    res.json({ streak: user.streak });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/complete-onboarding
router.post("/complete-onboarding", authMiddleware, async (req, res, next) => {
  try {
    const { skills, targetCategory, targetRole, careerGoals, education, currentRole } = req.body;
    const userId = req.user._id;

    // Save skills
    if (skills && skills.length > 0) {
      for (const skill of skills) {
        await Skill.findOneAndUpdate(
          { userId, name: skill.name },
          {
            $set: { value: skill.value, assessedBy: "user", updatedAt: new Date() },
            $push: { history: { value: skill.value, date: new Date(), assessedBy: "user" } },
          },
          { upsert: true, new: true }
        );
      }
    }

    // Update user
    await User.findByIdAndUpdate(userId, {
      targetCategory: targetCategory || "SDE",
      targetRole: targetRole || "SDE",
      careerGoals: careerGoals || "",
      education: education || "",
      currentRole: currentRole || "",
      onboardingComplete: true,
    });

    // Trigger background capability/career matching updates
    triggerConnectedAgents(userId, req.io);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/users/change-password
router.post(
  "/change-password",
  authMiddleware,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select("+password");

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/users/send-whatsapp
router.post("/send-whatsapp", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const name = req.user.name;
    const phone = req.user.phone;
    const targetCategory = req.user.targetCategory || "SDE";
    const targetRole = req.user.targetRole || "Developer";

    if (!phone) {
      return res.status(400).json({ error: "Please save a phone number in your profile first!" });
    }

    const skills = await Skill.find({ userId });
    const avgSkill = skills.length > 0
      ? Math.round(skills.reduce((acc, s) => acc + s.value, 0) / skills.length)
      : 50;

    const latestInterview = await InterviewSession.findOne({ userId }).sort({ date: -1 });
    const roadmap = await RoadmapPlan.findOne({ userId });
    
    let totalTasks = 0;
    let completedTasks = 0;
    if (roadmap && roadmap.months) {
      roadmap.months.forEach(m => {
        m.weeks.forEach(w => {
          w.tasks.forEach(t => {
            totalTasks++;
            if (t.completed) completedTasks++;
          });
        });
      });
    }
    const roadmapCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const applicationsCount = await Application.countDocuments({ userId });

    const interviewText = latestInterview
      ? `\n• Latest Mock Grade: ${latestInterview.score}%`
      : "";

    const message = `*EagleSyncAI Progress Bulletin* 🚀\n\nHey ${name}! Here is your real-time career preparation index brief:\n\n• Track Specialization: ${targetCategory} (${targetRole})\n• Skill Proficiency Index: ${avgSkill}%${interviewText}\n• Syllabus Roadmap Completed: ${roadmapCompletion}%\n• AI Auto-Applied Placements: ${applicationsCount} positions\n\nKeep grinding! We are syncing your potential in real time.`;

    const success = await sendWhatsAppMessage(phone, message);
    if (!success) {
      return res.status(500).json({ error: "Failed to dispatch WhatsApp message" });
    }

    res.json({ success: true, message: "Progress bulletin successfully dispatched to WhatsApp!" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
