const { runAgent } = require("./agentEngine");
const { getUserSkills, saveSkills } = require("../tools/databaseTools");
const { calculateReadinessScore } = require("../tools/calculatorTools");

const SYSTEM_PROMPT = `You are an expert SDE skill auditor for EagleSyncAI. 
Your job is to analyze a software engineer's skills and produce a comprehensive career readiness report.
You are precise, technical, and provide actionable recommendations specifically for software engineering roles.`;

const runCapabilityAgent = async (userId, io) => {
  const toolFunctions = {
    getUserSkills,
    calculateReadinessScore,
    saveSkills,
  };

  const goal = `Audit the skills for user ${userId} and produce a full career readiness report.
Follow these steps:
1. Call getUserSkills to get the user's current skills
2. Call calculateReadinessScore to compute their readiness score
3. Analyze: identify their top 3 strengths (value >= 70) and top 3 weaknesses (value <= 55)
4. For each weak skill, write a specific gap description and concrete action plan
5. Write 4 personalized AI recommendations for improving their SDE career readiness
6. Call saveSkills to update skill assessments with assessedBy:"agent"
7. Return your full analysis as structured text, then say TASK_COMPLETE

Your final response before TASK_COMPLETE must be a JSON block wrapped in \`\`\`json:
{
  "readinessScore": <number>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "gapAnalysis": [{"skill": "...", "gap": "...", "action": "..."}],
  "aiRecommendations": ["rec1", "rec2", "rec3", "rec4"]
}`;

  const steps = await runAgent(
    "Capability Agent",
    SYSTEM_PROMPT,
    goal,
    toolFunctions,
    userId,
    io
  );

  // Extract JSON result from the last thinking step
  let result = null;
  for (let i = steps.length - 1; i >= 0; i--) {
    const content = steps[i].content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        result = JSON.parse(jsonMatch[1]);
        break;
      } catch {
        // continue searching
      }
    }
  }

  // Fallback: compute from raw skill data
  if (!result) {
    const skills = await getUserSkills({ userId });
    const scoreData = calculateReadinessScore({ skills });
    result = {
      readinessScore: scoreData,
      strengths: skills.filter((s) => s.value >= 70).slice(0, 3).map((s) => `${s.name} (${s.value}/100)`),
      weaknesses: skills.filter((s) => s.value <= 55).slice(0, 3).map((s) => `${s.name} (${s.value}/100)`),
      gapAnalysis: skills.filter((s) => s.value <= 55).slice(0, 5).map((s) => ({
        skill: s.name,
        gap: `Current level ${s.value}/100 — below industry standard of 70+`,
        action: `Dedicate 2 weeks to ${s.name} fundamentals and build a project using it`,
      })),
      aiRecommendations: [
        "Focus on your weakest skill area first — consistent daily practice (30–45 min) beats occasional long sessions.",
        "Build one portfolio project that uses your top 3 skills together.",
        "Complete at least 2 mock interviews per week on InterviewHub to track improvement.",
        "Follow the AI-generated roadmap in the Roadmap section for a structured learning path.",
      ],
    };
  }

  return { steps, result };
};

module.exports = { runCapabilityAgent };
