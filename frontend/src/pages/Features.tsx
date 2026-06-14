import React, { useState } from "react";
import { Brain, Search, BookOpen, Shield, Award, TrendingUp, BarChart, ChevronRight, HelpCircle, GitFork } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState("capability");

  const agents = [
    {
      id: "capability",
      title: "Capability Agent",
      icon: Brain,
      color: "text-violet-500 bg-violet-500/10 border-violet-500/20",
      headline: "Deep Codebase Audits & Dynamic Radar Metrics",
      desc: "Our Capability Agent parses repository structures, scans package locks, and audits syntax structures to formulate a multi-dimensional coding readiness rating. This goes far beyond text-based resumes to rate raw implementation talent.",
      diagram: {
        input: "GitHub Repositories, Commits, File Structures",
        process: "EagleSync AST Parsing & Dependency Scopes Scanners",
        output: "Custom Skill Radar Chart & Readiness Index (e.g. 78%)"
      }
    },
    {
      id: "career",
      title: "Career Agent",
      icon: Search,
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
      headline: "Recruiter Algorithmic Match Projections",
      desc: "Matches your readiness stats directly with current hiring targets of elite engineering firms (such as Stripe, Linear, Vercel). Instantly displays salary ranges, matching percentages, and filters out listings where you don't fit.",
      diagram: {
        input: "Candidate Readiness Rating, Target Titles",
        process: "Recruiter Criteria Matrix Matching Algorithm",
        output: "Match % Score, Target Salaries, Priority Referral Paths"
      }
    },
    {
      id: "roadmap",
      title: "Roadmap Agent",
      icon: BookOpen,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      headline: "Gap Analysis Timeline Generator",
      desc: "Don't guess what to learn next. The Roadmap Agent identifies specific gaps in your technical stack and outputs daily task lists, weekly goals, and monthly milestones to bridge those gaps rapidly.",
      diagram: {
        input: "Unsatisfied Role Requirements & Skill Gaps",
        process: "Curriculum Dependencies Mapping Optimizer",
        output: "Daily Checklists, Weekly Milestone Steppers, Progress Toggles"
      }
    },
    {
      id: "interview",
      title: "Interview Agent",
      icon: Shield,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      headline: "Qualitative AI Technical & STAR Mock Evaluator",
      desc: "Simulate Technical, HR, Behavioral, and System Design interviews. The agent conducts realistic chat flows, scores your logic, and prints detailed qualitative feedback on how to improve your Big-O runtimes or STAR communication.",
      diagram: {
        input: "Mock Interview Track Selector, Candidate Answers",
        process: "Qualitative LLM grading & STAR frameworks compliance checks",
        output: "Performance Scores, Qualitative Weakness Feedbacks, Review Guides"
      }
    },
    {
      id: "opportunity",
      title: "Opportunity Agent",
      icon: Award,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      headline: "Aggregated Certified Placement Portal",
      desc: "Aggregates jobs, internships, hackathons, and certifications. If your Capability radar score is high, the agent automatically unlocks fast-track application codes and matches you with funding support.",
      diagram: {
        input: "Readiness Scores, Filter Queries (Search/Difficulty)",
        process: "Certified partner organizations direct indexers",
        output: "Custom Job matching, Hackathon prize codes, Certificate pathways"
      }
    },
    {
      id: "trend",
      title: "Trend Agent",
      icon: TrendingUp,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      headline: "Market Demand Forecasting Model",
      desc: "Hiring trends change quickly. The Trend Agent indexes technical job postings globally to predict which frameworks, databases, and architectural patterns will experience high demand next year.",
      diagram: {
        input: "Global Tech Hiring Boards, Repo Trends, API Usages",
        process: "Market Predictive Time-Series Forecasting",
        output: "Framework Trend Ratings, Hot Skills indicators, Future Salary projections"
      }
    },
    {
      id: "progress",
      title: "Progress Agent",
      icon: BarChart,
      color: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/20",
      headline: "Consolidated Progression Charts Engine",
      desc: "Maintains analytics metrics mapping your mock interview score histories, learning roadmap checkboxes, and on-chain verifications. Outputs visually compelling progress graphs for recruiters to inspect.",
      diagram: {
        input: "Roadmap progress, Interview logs, Verify history",
        process: "Progress logs time-series aggregations",
        output: "Weekly Progress Charts, Skill growth logs, Interview scores timelines"
      }
    },
    {
      id: "eaglepass",
      title: "EaglePass Blockchain",
      icon: Award,
      color: "text-violet-500 bg-violet-600/10 border-violet-500/20",
      headline: "Verification Ledger for Degrees, Mocks & Internships",
      desc: "EaglePass bridges off-chain accomplishments (like degree graduation, hackathon prizes, or internship conclusions) with on-chain cryptographic ledger verification, making your credentials immune to falsification.",
      diagram: {
        input: "Credentials validation trigger, issuer confirmation key",
        process: "SHA-256 local hashing, Consensus block broadcast",
        output: "Verifiable transaction hashes, Explorer confirms, Secured credentials"
      }
    }
  ];

  const selectedAgent = agents.find((a) => a.id === activeTab) || agents[0];

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 text-left max-w-5xl">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5">
          Inside EagleSyncAI Features
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium">
          Dive deep into our individual autonomous modules to understand how we audit, mock-interview, and securely place you.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex overflow-x-auto gap-2 pb-4 mb-12 border-b border-border/40 scrollbar-thin">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setActiveTab(agent.id)}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 border whitespace-nowrap ${
              activeTab === agent.id
                ? "bg-violet-600 text-white border-violet-500/40 shadow-lg shadow-violet-500/10"
                : "glass border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <agent.icon className="w-4 h-4" />
              <span>{agent.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Feature Deep Dive Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedAgent.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Text Description */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 ${selectedAgent.color}`}>
              <selectedAgent.icon className="w-6 h-6" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-tight">{selectedAgent.title}</h2>
            <h4 className="font-extrabold text-sm sm:text-base text-violet-600 dark:text-violet-400 mb-4">{selectedAgent.headline}</h4>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6">
              {selectedAgent.desc}
            </p>
          </div>

          {/* Diagram Component */}
          <div className="lg:col-span-6 w-full">
            <div className="glass-premium border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col gap-5 text-xs font-semibold">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 dark:bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="font-extrabold text-sm text-foreground mb-1 pb-2 border-b border-border/40 text-left">
                System Workflow Diagram
              </h3>

              {/* Input */}
              <div className="flex flex-col gap-1 text-left">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Input Source</p>
                <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border/60">
                  {selectedAgent.diagram.input}
                </div>
              </div>

              {/* Connector Arrow */}
              <div className="flex justify-center text-violet-500">
                <ChevronRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Processing */}
              <div className="flex flex-col gap-1 text-left">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Agent Engine Logic</p>
                <div className="p-3.5 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-violet-600 dark:text-violet-400">
                  {selectedAgent.diagram.process}
                </div>
              </div>

              {/* Connector Arrow */}
              <div className="flex justify-center text-violet-500">
                <ChevronRight className="w-5 h-5 rotate-90" />
              </div>

              {/* Output */}
              <div className="flex flex-col gap-1 text-left">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Output Result</p>
                <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  {selectedAgent.diagram.output}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
