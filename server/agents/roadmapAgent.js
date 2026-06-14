const { runAgent } = require("./agentEngine");
const { getUserProfile, getUserSkills, saveRoadmap } = require("../tools/databaseTools");

const SYSTEM_PROMPT = `You are an expert personalized career and exam coach for EagleSyncAI.
Your job is to create a detailed, highly structured learning roadmap for a student.
Each roadmap should have concrete, actionable weekly tasks matching their target duration, study intensity, and learning style.
Do not provide vague advice. Give specific topics, problem counts, or chapters.`;

const runRoadmapAgent = async (userId, io, options = {}) => {
  const {
    duration = "3 Months",
    intensity = "Moderate",
    style = "Practical/Project-Based",
    targetRole = "SDE",
    customContext = ""
  } = options;

  const toolFunctions = {
    getUserProfile,
    getUserSkills,
    saveRoadmap
  };

  const goal = `Create a personalized learning roadmap for user ${userId}.
Target Role/Exam: ${targetRole}
Roadmap Duration: ${duration}
Weekly Commitment Intensity: ${intensity}
Learning Style Preference: ${style}
Additional Custom Constraints: ${customContext}

Follow these steps:
1. Call getUserProfile to resolve their profile data and targetCategory (SDE, JEE, or NEET)
2. Call getUserSkills to identify their current levels
3. Design a roadmap matching the target duration (exactly ${duration.split(" ")[0]} months):
   - Month 1: Foundation strengthening — focus on weak subjects/skills
   - Middle Month(s) (if any): Projects, deep-dive mechanisms, and advanced concepts
   - Final Month: Timed mock tests, exam drills, or mock coding rounds
4. Each month must have exactly 4 weeks, each week must have 3-4 specific tasks
5. Tasks should be extremely concrete: e.g. "Read NCERT Chemistry chapter 5 on Electrochemistry and solve 30 MCQs" or "Write 15 LeetCode medium questions on BSTs"
6. Call saveRoadmap with the months array
7. Say TASK_COMPLETE

The months array structure for saveRoadmap must be:
[{
  "month": "Month 1",
  "title": "Month focus area",
  "completed": false,
  "completionPercent": 0,
  "weeks": [{
    "id": "m1w1",
    "title": "Week 1 - Topic Name",
    "completionPercent": 0,
    "tasks": [
      {"id": "m1w1t1", "title": "Task description details", "completed": false}
    ]
  }]
}]`;

  const steps = await runAgent(
    "Roadmap Agent",
    SYSTEM_PROMPT,
    goal,
    toolFunctions,
    userId,
    io,
    10
  );

  // Fetch the saved roadmap from DB
  const { getRoadmap } = require("../tools/databaseTools");
  const roadmap = await getRoadmap({ userId });

  return { steps, roadmap };
};

module.exports = { runRoadmapAgent };
