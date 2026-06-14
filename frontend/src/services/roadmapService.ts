import api from "../utils/api";
import { RoadmapMonthlyGoal } from "../types";

export const roadmapService = {
  getRoadmap: async (): Promise<RoadmapMonthlyGoal[]> => {
    try {
      const res = await api.get("/users/roadmap");
      const roadmap = res.data.roadmap;
      if (!roadmap) {
        return [];
      }
      return roadmap.months.map((m: any, idx: number) => ({
        id: m._id || `m${idx}`,
        month: m.month,
        title: m.title,
        completed: m.completed || false,
        weeks: m.weeks.map((w: any) => ({
          id: w.id || w._id,
          title: w.title,
          tasks: w.tasks.map((t: any) => ({
            id: t.id || t._id,
            title: t.title,
            completed: t.completed || false,
          })),
        })),
      }));
    } catch (err) {
      console.error("Failed to load roadmap:", err);
      return [];
    }
  },

  updateRoadmap: async (data: RoadmapMonthlyGoal[]): Promise<RoadmapMonthlyGoal[]> => {
    // Roadmaps are generated and updated via agent endpoints, but we keep this as a local state sync
    return data;
  },

  toggleTask: async (monthIndex: number, weekIndex: number, taskId: string): Promise<RoadmapMonthlyGoal[]> => {
    try {
      const res = await api.patch("/users/roadmap/toggle-task", {
        monthIndex,
        weekIndex,
        taskId,
      });
      const roadmap = res.data.roadmap;
      if (!roadmap) {
        return [];
      }
      return roadmap.months.map((m: any, idx: number) => ({
        id: m._id || `m${idx}`,
        month: m.month,
        title: m.title,
        completed: m.completed || false,
        weeks: m.weeks.map((w: any) => ({
          id: w.id || w._id,
          title: w.title,
          tasks: w.tasks.map((t: any) => ({
            id: t.id || t._id,
            title: t.title,
            completed: t.completed || false,
          })),
        })),
      }));
    } catch (err) {
      console.error("Failed to toggle task:", err);
      throw err;
    }
  },
};
