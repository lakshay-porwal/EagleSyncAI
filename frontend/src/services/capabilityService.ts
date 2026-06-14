import api from "../utils/api";
import { CapabilityData } from "../types";

export const capabilityService = {
  getCapabilityData: async (): Promise<CapabilityData> => {
    try {
      // 1. Fetch latest agent logs to find Capability Agent output
      const logsRes = await api.get("/agents/logs");
      const logs = logsRes.data.logs || [];
      const capabilityLog = logs.find((l: any) => l.agentName === "Capability Agent");

      if (capabilityLog) {
        // Find thinking step with JSON result
        for (let i = capabilityLog.steps.length - 1; i >= 0; i--) {
          const content = capabilityLog.steps[i].content;
          const jsonMatch = content.match(/({[\s\S]*"readinessScore"[\s\S]*})/);
          if (jsonMatch) {
            try {
              const parsed = JSON.parse(jsonMatch[1]);
              
              // Fetch latest user skills to make sure radar values are up-to-date
              const skillsRes = await api.get("/users/skills");
              const dbSkills = skillsRes.data.skills || [];

              return {
                readinessScore: parsed.readinessScore || 50,
                skills: dbSkills.map((s: any) => ({
                  name: s.name,
                  value: s.value,
                  fullMark: s.fullMark || 100,
                })),
                strengths: parsed.strengths || [],
                weaknesses: parsed.weaknesses || [],
                gapAnalysis: parsed.gapAnalysis || [],
                aiRecommendations: parsed.aiRecommendations || [],
              };
            } catch (e) {
              // Parse error, continue searching
            }
          }
        }
      }
    } catch (err) {
      console.warn("Failed to retrieve capability data from agent logs:", err);
    }

    // 2. Fallback: Fetch user skills directly and construct simple capability report
    try {
      const skillsRes = await api.get("/users/skills");
      const dbSkills = skillsRes.data.skills || [];
      
      const skillsForRadar = dbSkills.map((s: any) => ({
        name: s.name,
        value: s.value,
        fullMark: 100,
      }));

      const readinessScore = dbSkills.length > 0
        ? Math.round(dbSkills.reduce((acc: number, s: any) => acc + s.value, 0) / dbSkills.length)
        : 50;

      const strengths = dbSkills
        .filter((s: any) => s.value >= 70)
        .map((s: any) => `${s.name}: High proficiency (${s.value}/100)`);

      const weaknesses = dbSkills
        .filter((s: any) => s.value < 70)
        .map((s: any) => `${s.name}: Needs development (${s.value}/100)`);

      const gapAnalysis = dbSkills
        .filter((s: any) => s.value < 70)
        .map((s: any) => ({
          skill: s.name,
          gap: `Current proficiency level is ${s.value}%, which is below the target readiness bar of 70%.`,
          action: `Work on projects utilizing ${s.name} and solve focused algorithmic challenges.`,
        }));

      return {
        readinessScore,
        skills: skillsForRadar,
        strengths: strengths.length > 0 ? strengths : ["No strong skills identified yet. Complete more modules!"],
        weaknesses: weaknesses.length > 0 ? weaknesses : ["No critical weak areas. Keep practicing!"],
        gapAnalysis,
        aiRecommendations: [
          "Focus on improving key SDE target skills currently rated below 70%.",
          "Schedule a mock technical interview to benchmark your progress.",
          "Check the Opportunities page for target internships to gain real-world project context.",
        ],
      };
    } catch (err) {
      console.error("Capability fallback computation failed:", err);
      // Absolute fallback structure
      return {
        readinessScore: 0,
        skills: [],
        strengths: ["Complete onboarding to run capability audits."],
        weaknesses: [],
        gapAnalysis: [],
        aiRecommendations: [],
      };
    }
  },

  updateCapabilityData: async (data: CapabilityData): Promise<CapabilityData> => {
    try {
      const skillsPayload = data.skills.map((s) => ({
        name: s.name,
        value: s.value,
      }));
      await api.put("/users/skills", { skills: skillsPayload });
      return data;
    } catch (err) {
      console.error("Failed to update capability skills in DB:", err);
      throw err;
    }
  },
};
