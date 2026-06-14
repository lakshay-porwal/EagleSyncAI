const { runAgent } = require("./agentEngine");
const { getInterviewSessions } = require("../tools/databaseTools");
const {
  calculateScoreTrend,
  identifyWeakCategories,
  buildWeeklyVelocity,
} = require("../tools/calculatorTools");

const SYSTEM_PROMPT = `You are an SDE progress analyst for EagleSyncAI.
Your job is to analyze a student's interview performance history and provide motivating, actionable progress insights.
Be specific about numbers and trends. Acknowledge both improvements and areas that need work.`;

const runProgressAgent = async (userId, io) => {
  const toolFunctions = {
    getInterviewSessions,
    calculateScoreTrend,
    identifyWeakCategories,
    buildWeeklyVelocity,
  };

  const goal = `Analyze the interview progress for user ${userId}.
Follow these steps:
1. Call getInterviewSessions to get all their interview history
2. Call buildWeeklyVelocity to see their weekly session activity
3. Call calculateScoreTrend to determine if they are improving or declining
4. Call identifyWeakCategories to find their weakest interview types
5. Write a motivating 3-4 sentence progress summary
6. Say TASK_COMPLETE

Your final JSON response (before TASK_COMPLETE):
\`\`\`json
{
  "weeklyData": [{"week": "Week 1", "sessions": 2, "avgScore": 65, "hoursEquivalent": 3.0}],
  "trend": "improving",
  "trendPercent": 12,
  "weakCategories": ["System Design"],
  "strongCategories": ["Technical"],
  "summary": "Your motivating summary here.",
  "totalSessions": 10,
  "totalHoursEquivalent": 15.0
}
\`\`\``;

  const steps = await runAgent(
    "Progress Agent",
    SYSTEM_PROMPT,
    goal,
    toolFunctions,
    userId,
    io,
    8
  );

  // Extract progress data
  let progressData = null;
  for (let i = steps.length - 1; i >= 0; i--) {
    const content = steps[i].content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        progressData = JSON.parse(jsonMatch[1]);
        break;
      } catch {
        // continue
      }
    }
  }

  // Fallback
  if (!progressData) {
    const sessions = await getInterviewSessions({ userId });
    const weeklyData = buildWeeklyVelocity({ sessions });
    const trendData = calculateScoreTrend({ sessions });
    const categories = identifyWeakCategories({ sessions });

    progressData = {
      weeklyData,
      trend: trendData.trend,
      trendPercent: trendData.trendPercent,
      weakCategories: categories.weak || [],
      strongCategories: categories.strong || [],
      summary: sessions.length === 0
        ? "No interview sessions yet. Start your first mock interview to begin tracking progress!"
        : `You've completed ${sessions.length} interview sessions. ${trendData.trend === "improving" ? "Great progress — keep it up!" : "Consistent practice will improve your scores."}`,
      totalSessions: sessions.length,
      totalHoursEquivalent: Math.round(sessions.length * 1.5 * 10) / 10,
    };
  }

  return { steps, progressData };
};

module.exports = { runProgressAgent };
