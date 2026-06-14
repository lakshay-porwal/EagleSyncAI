const { runAgent } = require("./agentEngine");
const { getUserProfile, getUserSkills } = require("../tools/databaseTools");
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");

const SYSTEM_PROMPT = `You are an expert AI Placement Officer & Job Application Agent for EagleSyncAI.
Your job is to match a student's profile to open positions and compile dynamic, tailored application cover letters.
For each matching role, write a personalized cover letter emphasizing their technical projects and skills.`;

const runApplyAgent = async (userId, io) => {
  const toolFunctions = {
    getUserProfile,
    getUserSkills,
    getUnappliedOpportunities: async ({ userId }) => {
      const user = await getUserProfile({ userId });
      const targetCategory = user.targetCategory || "SDE";
      
      // Find opportunities matching their target category (type check)
      let query = { isActive: true };
      if (targetCategory === "JEE") {
        query.type = { $in: ["Competitions", "Scholarships"] };
      } else if (targetCategory === "NEET") {
        query.type = { $in: ["Scholarships", "Competitions"] };
      } else {
        query.type = { $in: ["Jobs", "Internships"] };
      }
      
      const allOpps = await Opportunity.find(query);
      const applied = await Application.find({ userId });
      const appliedIds = applied.map(a => a.opportunityId.toString());
      
      // Filter out already applied opportunities
      return allOpps.filter(o => !appliedIds.includes(o._id.toString())).slice(0, 3);
    },
    submitApplication: async ({ userId, opportunityId, coverLetter }) => {
      const app = await Application.create({
        userId,
        opportunityId,
        coverLetter,
        status: "Submitted",
        appliedAt: new Date()
      });
      return { success: true, applicationId: app._id };
    }
  };

  const goal = `Match unapplied opportunities for user ${userId} and submit automated applications.
Follow these steps:
1. Call getUserProfile to obtain user objectives and projects
2. Call getUserSkills to get their capability index
3. Call getUnappliedOpportunities to find up to 3 open options they haven't applied to yet
4. For each option:
   - Analyze how their skills and projects fit the requirements (matching tags/difficulty)
   - Compile a tailored 2-sentence cover letter pitch highlighting their specific project context
   - Call submitApplication with the opportunityId and the cover letter
5. Emit steps for each application submission
6. Say TASK_COMPLETE with a JSON list of successfully applied opportunities`;

  const steps = await runAgent(
    "Apply Agent",
    SYSTEM_PROMPT,
    goal,
    toolFunctions,
    userId,
    io,
    10
  );

  // Extract application results from steps
  let results = [];
  for (let i = steps.length - 1; i >= 0; i--) {
    const content = steps[i].content;
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed)) {
          results = parsed;
          break;
        }
      } catch {}
    }
  }

  // Fallback: local matching & saving
  if (results.length === 0) {
    const opps = await toolFunctions.getUnappliedOpportunities({ userId });
    const profile = await getUserProfile({ userId });
    for (const opp of opps) {
      const coverLetter = `I am excited to apply for ${opp.title} at ${opp.organization}. Given my background in ${profile.education || "Engineering"} and target focus as ${profile.targetRole || "SDE"}, along with my hands-on portfolio projects: ${profile.projects?.join(", ") || "various systems"}, I am confident I can contribute effectively.`;
      
      await toolFunctions.submitApplication({
        userId,
        opportunityId: opp._id,
        coverLetter
      });
      
      results.push({
        title: opp.title,
        organization: opp.organization,
        status: "Applied Successfully"
      });
    }
  }

  return { steps, results };
};

module.exports = { runApplyAgent };
