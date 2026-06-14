import api from "../utils/api";
import { Opportunity } from "../types";

export const opportunityService = {
  getOpportunities: async (
    type: string,
    search: string = "",
    difficulty: string = "All"
  ): Promise<Opportunity[]> => {
    try {
      const params: any = { type };
      if (difficulty !== "All") {
        params.difficulty = difficulty;
      }
      
      const res = await api.get("/opportunities", { params });
      const opportunities = res.data.opportunities || [];
      
      // Map database schema fields to frontend Opportunity interface
      const mapped = opportunities.map((opp: any) => ({
        id: opp._id || opp.id,
        type: opp.type,
        title: opp.title,
        organization: opp.organization,
        location: opp.location || "Remote",
        difficulty: opp.difficulty,
        link: opp.link || "#",
        reward: opp.reward,
        tags: opp.tags || [],
      }));

      // Filter by search query client-side
      if (!search.trim()) {
        return mapped;
      }

      const query = search.toLowerCase();
      return mapped.filter((opp: any) => 
        opp.title.toLowerCase().includes(query) ||
        opp.organization.toLowerCase().includes(query) ||
        opp.tags.some((t: string) => t.toLowerCase().includes(query))
      );
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      return [];
    }
  },

  getApplications: async (): Promise<any[]> => {
    try {
      const res = await api.get("/opportunities/applications");
      return res.data.applications || [];
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      return [];
    }
  },

  autoApply: async (): Promise<any> => {
    try {
      const res = await api.post("/opportunities/auto-apply");
      return res.data;
    } catch (err) {
      console.error("Failed to run Auto-Apply Agent:", err);
      throw err;
    }
  }
};
