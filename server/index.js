require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

// ─── Validate required env vars ───────────────────────────────────────────
const required = ["MONGODB_URI", "JWT_SECRET", "GEMINI_API_KEY"];
required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// ─── App setup ────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ─── Socket.io with JWT auth ──────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication required"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  socket.join(socket.userId); // private room per user
  console.log(`🔌 Socket connected: user ${socket.userId}`);
  socket.on("disconnect", () => {
    socket.leave(socket.userId);
    console.log(`🔌 Socket disconnected: user ${socket.userId}`);
  });
});

// ─── Middleware ───────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin.startsWith("http://localhost") ||
      origin.endsWith(".vercel.app") ||
      origin === process.env.CLIENT_URL
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Increased limit for local development testing
  message: { error: "Too many requests. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ─── DB connect ───────────────────────────────────────────────────────────
connectDB();

// ─── Inject Socket.io into agent routes ───────────────────────────────────
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));
app.use("/api/interviews", require("./routes/interviewRoutes"));
app.use("/api/opportunities", require("./routes/opportunityRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── 404 handler ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// ─── Global error handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.stack || err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: Object.values(err.errors).map((e) => e.message).join(", "),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: "Email already registered" });
  }

  if (err.message?.includes("RESOURCE_EXHAUSTED") || err.message?.includes("quota")) {
    return res.status(429).json({ error: "AI quota exceeded. Please try again in a minute." });
  }

  res.status(500).json({ error: "Something went wrong on our end." });
});

// ─── Start ────────────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`\n🚀 EagleSyncAI Server running on http://localhost:${PORT}`);
    console.log(`🤖 AI Agents: Capability | Roadmap | Interview | Career | Progress`);
    console.log(`🔌 Socket.io: Live agent feed enabled`);
    console.log(`📦 MongoDB: Connecting...`);
    console.log(`\n📋 API Endpoints:`);
    console.log(`   POST /api/auth/register`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/auth/me`);
    console.log(`   POST /api/agents/capability | roadmap | career | progress | chat`);
    console.log(`   POST /api/interviews/submit`);
    console.log(`   POST /api/opportunities/seed  (run once!)\n`);
  });
}

module.exports = app;
