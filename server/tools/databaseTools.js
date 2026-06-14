const User = require("../models/User");
const Skill = require("../models/Skill");
const RoadmapPlan = require("../models/RoadmapPlan");
const InterviewSession = require("../models/InterviewSession");
const ChatHistory = require("../models/ChatHistory");
const Credential = require("../models/Credential");
const Opportunity = require("../models/Opportunity");
const AgentLog = require("../models/AgentLog");

// ─── User ──────────────────────────────────────────────────────────────────

const getUserProfile = async ({ userId }) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) return { error: "User not found" };
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      education: user.education,
      careerGoals: user.careerGoals,
      currentRole: user.currentRole,
      targetRole: user.targetRole,
      streak: user.streak,
      onboardingComplete: user.onboardingComplete,
    };
  } catch (err) {
    return { error: err.message };
  }
};

// ─── Skills ────────────────────────────────────────────────────────────────

const getUserSkills = async ({ userId }) => {
  try {
    const skills = await Skill.find({ userId });
    return skills.map((s) => ({
      name: s.name,
      value: s.value,
      fullMark: s.fullMark,
      assessedBy: s.assessedBy,
    }));
  } catch (err) {
    return { error: err.message };
  }
};

const saveSkills = async ({ userId, skills }) => {
  try {
    for (const skill of skills) {
      await Skill.findOneAndUpdate(
        { userId, name: skill.name },
        {
          $set: {
            value: skill.value,
            assessedBy: skill.assessedBy || "agent",
            updatedAt: new Date(),
          },
          $push: {
            history: {
              value: skill.value,
              date: new Date(),
              assessedBy: skill.assessedBy || "agent",
            },
          },
        },
        { upsert: true, new: true }
      );
    }
    return { success: true, count: skills.length };
  } catch (err) {
    return { error: err.message };
  }
};

// ─── Roadmap ───────────────────────────────────────────────────────────────

const getRoadmap = async ({ userId }) => {
  try {
    const roadmap = await RoadmapPlan.findOne({ userId });
    if (!roadmap) return null;
    return roadmap;
  } catch (err) {
    return { error: err.message };
  }
};

const saveRoadmap = async ({ userId, months }) => {
  try {
    await RoadmapPlan.findOneAndUpdate(
      { userId },
      { months, generatedAt: new Date(), lastUpdated: new Date() },
      { upsert: true, new: true }
    );
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
};

// ─── Interview Sessions ────────────────────────────────────────────────────

const getInterviewSessions = async ({ userId }) => {
  try {
    const sessions = await InterviewSession.find({ userId }).sort({ date: -1 });
    return sessions;
  } catch (err) {
    return { error: err.message };
  }
};

const saveInterviewSession = async ({ userId, type, questions, answers, score, feedback, perAnswerFeedback, improvementTips }) => {
  try {
    const session = await InterviewSession.create({
      userId,
      type,
      questions,
      answers,
      score,
      feedback,
      perAnswerFeedback,
      improvementTips,
    });

    // CLOSED-LOOP AGENT INTEGRATION:
    // Automatically update the user's corresponding skills based on the interview type and score
    let skillNamesToUpdate = [];
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes("tech") || lowerType.includes("system") || lowerType.includes("design") || lowerType.includes("development")) {
      skillNamesToUpdate = ["React", "Node.js", "Databases", "System Design", "TypeScript", "REST APIs", "Docker"];
    } else if (lowerType.includes("physic")) {
      skillNamesToUpdate = ["Physics"];
    } else if (lowerType.includes("biology") || lowerType.includes("botany") || lowerType.includes("zoology") || lowerType.includes("medic")) {
      skillNamesToUpdate = ["Biology (Zoology)", "Biology (Botany)"];
    } else if (lowerType.includes("chemistry") || lowerType.includes("organic") || lowerType.includes("physical")) {
      skillNamesToUpdate = ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"];
    } else if (lowerType.includes("math")) {
      skillNamesToUpdate = ["Mathematics"];
    }

    if (skillNamesToUpdate.length > 0) {
      for (const name of skillNamesToUpdate) {
        const existing = await Skill.findOne({ userId, name });
        if (existing) {
          // Blend current rating and interview score: 40% old, 60% new
          const blendedValue = Math.round(existing.value * 0.4 + score * 0.6);
          existing.value = Math.min(100, Math.max(0, blendedValue));
          existing.assessedBy = "agent";
          existing.updatedAt = new Date();
          existing.history.push({
            value: existing.value,
            date: new Date(),
            assessedBy: "agent",
          });
          await existing.save();
        }
      }
    }

    return { success: true, id: session._id, score };
  } catch (err) {
    return { error: err.message };
  }
};

// ─── Chat History ──────────────────────────────────────────────────────────

const getChatHistory = async ({ userId }) => {
  try {
    const doc = await ChatHistory.findOne({ userId });
    return doc ? doc.messages : [];
  } catch (err) {
    return { error: err.message };
  }
};

const appendChatMessages = async ({ userId, messages }) => {
  try {
    await ChatHistory.findOneAndUpdate(
      { userId },
      { $push: { messages: { $each: messages } }, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
};

// ─── Credentials ───────────────────────────────────────────────────────────

const getCredentials = async ({ userId }) => {
  try {
    return await Credential.find({ userId });
  } catch (err) {
    return { error: err.message };
  }
};

const saveCredential = async ({ userId, title, recipient, issuer, type, txHash, date }) => {
  try {
    const cred = await Credential.create({ userId, title, recipient, issuer, type, txHash, status: "Verified", date });
    return { success: true, id: cred._id };
  } catch (err) {
    return { error: err.message };
  }
};

// ─── Opportunities ─────────────────────────────────────────────────────────

const getOpportunities = async ({ type } = {}) => {
  try {
    const query = { isActive: true };
    if (type) query.type = type;
    return await Opportunity.find(query);
  } catch (err) {
    return { error: err.message };
  }
};

// ─── Agent Logs ────────────────────────────────────────────────────────────

const saveAgentLog = async ({ userId, agentName, trigger, steps, outcome, duration }) => {
  try {
    await AgentLog.create({ userId, agentName, trigger, steps, outcome, duration });
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
};

const getAgentLogs = async ({ userId, limit = 10 }) => {
  try {
    return await AgentLog.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  } catch (err) {
    return { error: err.message };
  }
};

module.exports = {
  getUserProfile,
  getUserSkills,
  saveSkills,
  getRoadmap,
  saveRoadmap,
  getInterviewSessions,
  saveInterviewSession,
  getChatHistory,
  appendChatMessages,
  getCredentials,
  saveCredential,
  getOpportunities,
  saveAgentLog,
  getAgentLogs,
};
