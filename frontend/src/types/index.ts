export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  education: string;
  skills?: string[];
  projects?: string[];
  resumeName?: string;
  careerGoals: string;
  phone?: string;
  currentRole?: string;
  targetCategory?: string;
  targetRole?: string;
  onboardingComplete?: boolean;
  streak?: number;
  lastActive?: string;
  createdAt?: string;
}

export interface CareerRecommendation {
  id: string;
  title: string;
  matchPercentage: number;
  demandScore: number;
  salaryRange: string;
  requiredSkills: string[];
  description: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RoadmapWeeklyGoal {
  id: string;
  title: string;
  tasks: RoadmapTask[];
}

export interface RoadmapMonthlyGoal {
  id: string;
  month: string;
  title: string;
  completed: boolean;
  weeks: RoadmapWeeklyGoal[];
}

export interface SkillScore {
  name: string;
  value: number;
  fullMark: number;
}

export interface CapabilityData {
  readinessScore: number;
  skills: SkillScore[];
  strengths: string[];
  weaknesses: string[];
  gapAnalysis: {
    skill: string;
    gap: string;
    action: string;
  }[];
  aiRecommendations: string[];
}

export interface InterviewSession {
  id: string;
  type: "Technical" | "HR" | "Behavioral" | "System Design";
  score?: number;
  date: string;
  feedback?: string;
}

export interface Opportunity {
  id: string;
  type: "Jobs" | "Internships" | "Hackathons" | "Competitions" | "Certifications" | "Scholarships";
  title: string;
  organization: string;
  location: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  link: string;
  reward?: string;
  tags: string[];
}

export interface BlockchainRecord {
  id: string;
  type: "Certificate" | "Hackathon" | "Internship" | "Achievement";
  title: string;
  recipient: string;
  issuer: string;
  date: string;
  txHash: string;
  status: "Verified" | "Pending" | "Failed";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

// ─── Agent Types ───────────────────────────────────────────────────────────

export interface AgentStep {
  stepNumber: number;
  type: "thinking" | "tool_call" | "tool_result" | "decision";
  content: string;
  toolName?: string;
  timestamp: string;
}

export interface AgentLog {
  _id: string;
  agentName: string;
  trigger: string;
  steps: AgentStep[];
  outcome: string;
  duration: number;
  createdAt: string;
}

export interface CareerMatch {
  title: string;
  matchPercentage: number;
  demandScore: number;
  salaryRange: string;
  requiredSkills: string[];
  description: string;
}

export interface InterviewQuestion {
  question: string;
  hints: string[];
  timeLimit: number;
}

export interface InterviewResult {
  type: string;
  score: number;
  feedback: string;
  perAnswerFeedback: string[];
  improvementTips: string[];
}
