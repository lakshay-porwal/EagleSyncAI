const { runAgent } = require("./agentEngine");
const { getUserSkills } = require("../tools/databaseTools");
const { rankCareerMatches } = require("../tools/calculatorTools");

const SYSTEM_PROMPT = `You are an expert tech career analyst for EagleSyncAI.
Your job is to match a software engineer's skills to the best-fit SDE roles.
Be realistic about match percentages and provide specific salary ranges for the Indian market.
Demand scores should reflect current 2024-2025 hiring trends.`;

const ROLES = [
  { title: "Frontend Developer", requiredSkills: ["React", "TypeScript", "CSS", "JavaScript", "Testing"] },
  { title: "Backend Developer", requiredSkills: ["Node.js", "Databases", "REST APIs", "Docker", "System Design"] },
  { title: "Full Stack Developer", requiredSkills: ["React", "Node.js", "MongoDB", "REST APIs", "TypeScript"] },
  { title: "AI/ML Engineer", requiredSkills: ["Python", "TensorFlow", "Machine Learning", "Math", "SQL"] },
  { title: "DevOps Engineer", requiredSkills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"] },
  { title: "Mobile Developer", requiredSkills: ["React Native", "JavaScript", "REST APIs", "UX Design", "TypeScript"] },
  { title: "Security Engineer", requiredSkills: ["Networking", "Cryptography", "Linux", "Python", "Security Testing"] },
  { title: "Data Engineer", requiredSkills: ["SQL", "Python", "ETL", "Apache Spark", "Cloud Platforms"] },
];

const runCareerAgent = async (userId, io, options = {}) => {
  const {
    targetRole = "SDE",
    preferredLocation = "Remote",
    experienceLevel = "Entry Level",
    minSalary = "8 LPA"
  } = options;

  const toolFunctions = {
    getUserSkills,
    rankCareerMatches: ({ skills }) => rankCareerMatches({ skills, roles: ROLES }),
  };

  const goal = `Match career roles for user ${userId}.
Target Focus: ${targetRole}
Location Preference: ${preferredLocation}
Experience Level: ${experienceLevel}
Minimum Salary expectation: ${minSalary}

Follow these steps:
1. Call getUserSkills to get the user's skills
2. Call rankCareerMatches to get mathematical % matches for each role
3. Take the top 5 matches and enrich each with:
   - demandScore (1-100, based on current 2024-2025 India tech hiring market)
   - salaryRange (realistic range in LPA for India, e.g. "8-18 LPA")
   - description (exactly 2 sentences about this role, why it fits them, and details matching their ${preferredLocation} and ${experienceLevel} criteria)
4. Return the enriched top 5 as JSON, then say TASK_COMPLETE

Your JSON response (before TASK_COMPLETE) must be:
\`\`\`json
[
  {
    "title": "Role Name",
    "matchPercentage": <number>,
    "demandScore": <1-100>,
    "salaryRange": "X-Y LPA",
    "requiredSkills": ["skill1", "skill2"],
    "description": "Two sentence description."
  }
]
\`\`\``;

  const steps = await runAgent(
    "Career Agent",
    SYSTEM_PROMPT,
    goal,
    toolFunctions,
    userId,
    io,
    8
  );

  // Extract matches from steps
  let matches = null;
  for (let i = steps.length - 1; i >= 0; i--) {
    const content = steps[i].content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed)) {
          matches = parsed;
          break;
        }
      } catch {
        // continue
      }
    }
  }

  // Fallback: use calculator only
  if (!matches) {
    const skills = await getUserSkills({ userId });
    const ranked = rankCareerMatches({ skills, roles: ROLES });
    matches = ranked.slice(0, 5).map((r) => ({
      ...r,
      demandScore: 75,
      salaryRange: "8-20 LPA",
      description: `Strong match for ${r.title} role. Focus on strengthening your required skills to increase your competitiveness.`,
    }));
  }

  return { steps, matches };
};

module.exports = { runCareerAgent };
