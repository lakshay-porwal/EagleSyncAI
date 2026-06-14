const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authMiddleware");
const InterviewSession = require("../models/InterviewSession");
const { runInterviewAgent } = require("../agents/interviewAgent");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "placeholder");

// Gemini with retry
const callGeminiWithRetry = async (model, prompt, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      if ((err.message?.includes("RESOURCE_EXHAUSTED") || err.message?.includes("quota")) && i < retries) {
        await new Promise((r) => setTimeout(r, (i + 1) * 3000));
      } else throw err;
    }
  }
};

// GET /api/interviews/questions/:type
// Generates fresh questions via Gemini every session
router.get("/questions/:type", authMiddleware, async (req, res, next) => {
  try {
    const { type } = req.params;
    const { difficulty = "Medium" } = req.query;

    const validTypes = ["Technical", "HR", "Behavioral", "System Design"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid interview type" });
    }

    const prompt = `Generate exactly 5 unique ${type} interview questions for an SDE role.
Difficulty level: ${difficulty}
Return ONLY a valid JSON array with no markdown, no explanation, no code fences:
[{"question": "the question text here", "hints": ["hint1", "hint2"], "timeLimit": 120}]

For Technical: focus on DSA, algorithms, React/Node.js concepts
For HR: focus on motivation, culture fit, salary, career goals
For Behavioral: use STAR-method prompts about past experiences
For System Design: design real systems (URL shortener, notification service, etc.)`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const raw = await callGeminiWithRetry(model, prompt);

    // Clean and parse
    const clean = raw.replace(/```json|```/g, "").trim();
    let questions;
    try {
      questions = JSON.parse(clean);
    } catch {
      // Fallback questions
      questions = getFallbackQuestions(type);
    }

    res.json({ questions, type, difficulty });
  } catch (err) {
    // Return fallback on any error
    const fallback = getFallbackQuestions(req.params.type);
    res.json({ questions: fallback, type: req.params.type, difficulty: "Medium" });
  }
});

// POST /api/interviews/submit
router.post("/submit", authMiddleware, async (req, res, next) => {
  try {
    const { type, questions, answers } = req.body;
    if (!type || !questions || !answers) {
      return res.status(400).json({ error: "type, questions, and answers are required" });
    }

    const { steps, result } = await runInterviewAgent(
      req.user._id,
      type,
      questions,
      answers,
      req.io
    );

    // Closed-loop: Automatically trigger updates for Capability and Careers
    const { triggerConnectedAgents } = require("../utils/agentOrchestrator");
    triggerConnectedAgents(req.user._id, req.io);

    res.json({ steps, result });
  } catch (err) {
    next(err);
  }
});

// GET /api/interviews/sessions
router.get("/sessions", authMiddleware, async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(50);
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
});

// Fallback question bank (used when Gemini fails)
const getFallbackQuestions = (type) => {
  const banks = {
    Technical: [
      { question: "Explain the difference between a stack and a queue. When would you use each?", hints: ["LIFO vs FIFO", "Use cases"], timeLimit: 120 },
      { question: "What is the time complexity of quicksort in the worst case, and how can it be avoided?", hints: ["Pivot selection", "O(n²) worst case"], timeLimit: 120 },
      { question: "Explain how React's useEffect hook works and what the cleanup function is for.", hints: ["Dependency array", "Component unmount"], timeLimit: 120 },
      { question: "What is a closure in JavaScript? Provide an example.", hints: ["Function scope", "Variable access"], timeLimit: 120 },
      { question: "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?", hints: ["Schema flexibility", "Scalability"], timeLimit: 120 },
    ],
    HR: [
      { question: "Tell me about yourself and your journey into software engineering.", hints: ["Keep it professional", "Mention key projects"], timeLimit: 120 },
      { question: "Why do you want to work at this company specifically?", hints: ["Research the company", "Align with their mission"], timeLimit: 120 },
      { question: "Where do you see yourself in 5 years?", hints: ["Be specific", "Show ambition"], timeLimit: 120 },
      { question: "What is your greatest professional achievement and why?", hints: ["Use STAR method", "Quantify impact"], timeLimit: 120 },
      { question: "How do you handle disagreements with your team members?", hints: ["Show communication skills", "Resolution focus"], timeLimit: 120 },
    ],
    Behavioral: [
      { question: "Tell me about a time you had to debug a critical production issue under pressure.", hints: ["STAR method", "Show calm decision-making"], timeLimit: 150 },
      { question: "Describe a situation where you had to learn a new technology quickly for a project.", hints: ["Show adaptability", "Learning process"], timeLimit: 150 },
      { question: "Tell me about a time when you disagreed with a technical decision. What did you do?", hints: ["Constructive feedback", "Team dynamics"], timeLimit: 150 },
      { question: "Give an example of a time you mentored or helped a junior team member.", hints: ["Leadership skills", "Patience"], timeLimit: 150 },
      { question: "Describe a project where you had to balance technical debt with new feature development.", hints: ["Trade-offs", "Prioritization"], timeLimit: 150 },
    ],
    "System Design": [
      { question: "Design a URL shortening service like bit.ly. Walk me through your architecture.", hints: ["Hash function", "Database choice", "CDN"], timeLimit: 180 },
      { question: "How would you design a real-time notification system for a social media platform?", hints: ["WebSockets vs SSE", "Message queues", "Fan-out pattern"], timeLimit: 180 },
      { question: "Design a distributed rate limiter that works across multiple servers.", hints: ["Redis", "Token bucket", "Sliding window"], timeLimit: 180 },
      { question: "How would you design the backend for a video streaming platform like YouTube?", hints: ["CDN", "Video transcoding", "Database sharding"], timeLimit: 180 },
      { question: "Design a system to handle 1 million concurrent users for a flash sale event.", hints: ["Load balancing", "Caching", "Database bottlenecks"], timeLimit: 180 },
    ],
  };
  return banks[type] || banks.Technical;
};

module.exports = router;
