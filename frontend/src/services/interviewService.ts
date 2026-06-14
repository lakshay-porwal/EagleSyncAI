import api from "../utils/api";
import { InterviewSession } from "../types";

export const interviewService = {
  getSessions: async (): Promise<InterviewSession[]> => {
    try {
      const res = await api.get("/interviews/sessions");
      const sessions = res.data.sessions || [];
      return sessions.map((s: any) => ({
        id: s._id || s.id,
        type: s.type,
        score: s.score,
        date: new Date(s.date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        feedback: s.feedback,
      }));
    } catch (err) {
      console.error("Failed to load interview sessions:", err);
      return [];
    }
  },

  getQuestionsByType: async (type: string): Promise<any[]> => {
    try {
      const res = await api.get(`/interviews/questions/${type}`);
      return res.data.questions || [];
    } catch (err) {
      console.error("Failed to fetch dynamic questions, returning fallback:", err);
      // Fallback questions inside service
      return getFallbackQuestions(type);
    }
  },

  submitInterviewResults: async (
    type: "Technical" | "HR" | "Behavioral" | "System Design",
    questions: string[],
    answers: string[]
  ): Promise<InterviewSession> => {
    try {
      const res = await api.post("/interviews/submit", {
        type,
        questions,
        answers,
      });
      // The backend returns { steps, result: { score, feedback, perAnswerFeedback, improvementTips } }
      const grading = res.data.result || {};
      
      return {
        id: grading.id || "int-" + Math.random().toString(36).substring(2, 9),
        type,
        score: grading.score || 70,
        date: new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        feedback: grading.feedback || "Submission completed.",
      };
    } catch (err: any) {
      console.error("Failed to submit interview responses:", err);
      throw err;
    }
  },
};

// Fallback questions for frontend service (safeguard)
const getFallbackQuestions = (type: string) => {
  const banks: Record<string, any[]> = {
    Technical: [
      { question: "Explain the difference between a stack and a queue. When would you use each?" },
      { question: "What is the time complexity of quicksort in the worst case, and how can it be avoided?" },
      { question: "Explain how React's useEffect hook works and what the cleanup function is for." },
    ],
    HR: [
      { question: "Tell me about yourself and your journey into software engineering." },
      { question: "Why do you want to work at this company specifically?" },
      { question: "Where do you see yourself in 5 years?" },
    ],
    Behavioral: [
      { question: "Tell me about a time you had to debug a critical production issue under pressure." },
      { question: "Describe a situation where you had to learn a new technology quickly for a project." },
      { question: "Tell me about a time when you disagreed with a technical decision. What did you do?" },
    ],
    "System Design": [
      { question: "Design a URL shortening service like bit.ly. Walk me through your architecture." },
      { question: "How would you design a real-time notification system for a social media platform?" },
      { question: "Design a distributed rate limiter that works across multiple servers." },
    ],
  };
  return banks[type] || banks.Technical;
};
