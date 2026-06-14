import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { careerService } from "../services/careerService";
import { CareerRecommendation } from "../types";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";
import { useAgent } from "../hooks/useAgent";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import { Briefcase, ArrowUpRight, TrendingUp, CheckCircle, Cpu, Activity, Terminal, Sparkles } from "lucide-react";

export const Careers: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  // Form parameters states
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Full Stack Developer");
  const [preferredLocation, setPreferredLocation] = useState("Remote");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [minSalary, setMinSalary] = useState("8 LPA");

  // Live Agent hooks
  const { agentSteps, clearSteps } = useSocket(token);
  const { runCareer, isRunning } = useAgent();

  const fetchCareersAndSkills = async () => {
    try {
      const skillsRes = await api.get("/users/skills");
      const dbSkills = skillsRes.data.skills || [];
      setUserSkills(dbSkills.map((s: any) => s.name));

      const data = await careerService.getRecommendations();
      setCareers(data);
    } catch (err) {
      console.error("Failed to load career data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCareersAndSkills();
  }, []);

  const handleRunCareer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearSteps();
    toast("Spawning Career Analyst Agent...", "info");
    
    const res = await runCareer({
      targetRole,
      preferredLocation,
      experienceLevel,
      minSalary
    });

    if (res) {
      toast("Career matching completed successfully!", "success");
      setShowConfig(false);
      await fetchCareersAndSkills();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6 animate-pulse text-left">
        <div className="h-8 bg-muted rounded-xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left py-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-1.5 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400">
            Career Recommendations
          </h1>
          <p className="text-muted-foreground text-sm font-semibold">
            AI-predicted market matches mapping your capability radar
          </p>
        </div>
        {!showConfig && (
          <button
            onClick={() => setShowConfig(true)}
            disabled={isRunning}
            className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Customize Analysis</span>
          </button>
        )}
      </div>

      {/* Career Preferences Parameters Form */}
      {(showConfig || (careers.length === 0 && !isRunning)) && (
        <form onSubmit={handleRunCareer} className="glass p-6 sm:p-8 rounded-3xl border border-violet-500/20 space-y-5 flex flex-col text-xs font-semibold animate-fade-in">
          <div className="flex items-center gap-2 border-b border-border/40 pb-2.5 mb-2">
            <Briefcase className="w-5 h-5 text-violet-500" />
            <h3 className="font-extrabold text-base text-foreground">Configure Placement/Goal Preferences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground">Target Role Focus / Exam Specialization</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, MBBS Specialization"
                className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors font-semibold"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground">Preferred Location Type</label>
              <select
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors font-semibold appearance-none cursor-pointer"
              >
                <option value="Remote">Remote</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai / Pune</option>
                <option value="Delhi NCR">Delhi NCR / Gurgaon</option>
                <option value="Hyderabad">Hyderabad / Chennai</option>
                <option value="Pan India">Pan India (Exams/Colleges)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground">Experience Target Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors font-semibold appearance-none cursor-pointer"
              >
                <option value="Entry Level">Entry Level (0-2 yrs / Graduate)</option>
                <option value="Mid Level">Mid Level (2-5 yrs / Resident Doctor)</option>
                <option value="Senior Level">Senior Level (5+ yrs / consultant)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground">Minimum Target Salary / Package Expectations</label>
              <select
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors font-semibold appearance-none cursor-pointer"
              >
                <option value="6 LPA">6 LPA (Standard placements / MBBS residency)</option>
                <option value="10 LPA">10 LPA (Tier-1 SDE / Top MD doctors)</option>
                <option value="18 LPA">18 LPA (Premium Product SDE / Elite specialized)</option>
                <option value="30 LPA">30 LPA (SDE-2+ / Elite super-specialist)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3.5 justify-end mt-2">
            {careers.length > 0 && (
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="px-6 py-3.5 rounded-2xl border border-border/80 hover:bg-secondary/40 font-bold"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors shadow-lg shadow-violet-500/10 flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4" />
              <span>Analyze Career Placement</span>
            </button>
          </div>
        </form>
      )}

      {/* Live Agent Console Panel */}
      {isRunning && (
        <div className="glass border border-border/80 rounded-3xl p-5 text-left flex flex-col gap-2.5 font-mono text-xs shadow-inner animate-fade-in">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-violet-500" />
              <span>Career Agent Console Log</span>
            </div>
            <span className="animate-pulse text-violet-500">Matching Placement Vectors...</span>
          </div>
          <div className="max-h-[160px] overflow-y-auto flex flex-col gap-1.5">
            {agentSteps.length === 0 ? (
              <div className="text-muted-foreground italic pl-2">Spawning agent and establishing websocket routing...</div>
            ) : (
              agentSteps.map((s, idx) => (
                <div key={idx} className="pb-1 last:border-none">
                  <span className="text-violet-500 font-bold mr-1.5">[{s.type.toUpperCase()}]</span>
                  <span className="text-foreground/80">{s.content}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {careers.length === 0 && !isRunning && !showConfig && (
        <div className="glass p-10 rounded-3xl border border-border/60 text-center max-w-md mx-auto my-10 flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg">No Career Analysis Done</h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
            No recommendations index has been generated yet. Configure options above to spawn your AI Career Analyst.
          </p>
        </div>
      )}

      {/* Grid of Career Cards */}
      {careers.length > 0 && !isRunning && !showConfig && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {careers.map((career) => (
            <div
              key={career.id}
              className="glass rounded-3xl border border-border/60 p-6 flex flex-col justify-between hover:border-violet-500/15 transition-all shadow-sm group"
            >
              <div>
                <div className="flex justify-between items-start mb-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg group-hover:text-violet-500 transition-colors">
                        {career.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        {career.salaryRange}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-sm font-extrabold text-violet-600 dark:text-violet-400">
                      {career.matchPercentage}% Match
                    </span>
                    <span className="text-[9px] text-muted-foreground font-bold uppercase">Ready</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4 leading-relaxed font-medium text-left">
                  {career.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap gap-2">
                {career.requiredSkills.map((sk) => {
                  const hasSkill = userSkills.includes(sk);
                  return (
                    <span
                      key={sk}
                      className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                        hasSkill
                          ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-secondary/40 border-border/80 text-muted-foreground"
                      }`}
                    >
                      {sk}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
