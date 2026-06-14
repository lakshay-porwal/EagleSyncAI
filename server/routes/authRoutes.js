const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ error: "An account with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });

      const token = signToken(user);
      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetCategory: user.targetCategory,
          targetRole: user.targetRole,
          onboardingComplete: user.onboardingComplete,
          streak: user.streak,
          createdAt: user.createdAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Update last active
      user.lastActive = new Date();
      await user.save();

      const token = signToken(user);
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetCategory: user.targetCategory,
          targetRole: user.targetRole,
          onboardingComplete: user.onboardingComplete,
          streak: user.streak,
          createdAt: user.createdAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      education: req.user.education,
      careerGoals: req.user.careerGoals,
      currentRole: req.user.currentRole,
      targetCategory: req.user.targetCategory,
      targetRole: req.user.targetRole,
      onboardingComplete: req.user.onboardingComplete,
      streak: req.user.streak,
      lastActive: req.user.lastActive,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = router;
