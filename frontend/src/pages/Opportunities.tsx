import React, { useEffect, useState } from "react";
import { opportunityService } from "../services/opportunityService";
import { Opportunity } from "../types";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";
import { useToast } from "../context/ToastContext";
import {
  Search,
  MapPin,
  Award,
  ExternalLink,
  RefreshCw,
  Cpu,
  Terminal,
  Activity,
  FileText,
  CheckCircle,
  Clock,
  History,
  Sparkles
} from "lucide-react";

export const Opportunities: React.FC = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activeTab, setActiveTab] = useState<"Internships" | "Jobs" | "Hackathons" | "Competitions" | "Certifications" | "Scholarships">("Internships");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Auto-Apply states
  const [applications, setApplications] = useState<any[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  // Live Agent hooks
  const { agentSteps, clearSteps } = useSocket(token);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const data = await opportunityService.getOpportunities(activeTab, search, difficulty);
      setOpportunities(data);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await opportunityService.getApplications();
      setApplications(data);
    } catch (err) {
      console.error("Failed to load applications:", err);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [activeTab, difficulty]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities();
  };

  const handleTriggerAutoApply = async () => {
    setIsApplying(true);
    clearSteps();
    toast("Spawning AI Auto-Apply Agent in background...", "info");

    try {
      const res = await opportunityService.autoApply();
      toast(`AI Auto-Apply finished! Applied for ${res.results?.length || 0} listings.`, "success");
      await fetchApplications();
      await fetchOpportunities();
    } catch (err: any) {
      toast(err.message || "Auto-Apply Agent failed", "error");
    } finally {
      setIsApplying(false);
    }
  };

  const tabs: ("Internships" | "Jobs" | "Hackathons" | "Competitions" | "Certifications" | "Scholarships")[] = [
    "Internships",
    "Jobs",
    "Hackathons",
    "Competitions",
    "Certifications",
    "Scholarships"
  ];

  return (
    <div className="flex flex-col gap-8 text-left py-4 max-w-6xl mx-auto">
      {/* Upper Grid: Header and Banner image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-border/20 pb-6">
        <div className="lg:col-span-8 flex flex-col text-left">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400">
            Opportunity Center
          </h1>
          <p className="text-muted-foreground text-sm font-semibold max-w-xl leading-relaxed">
            Curated placements and challenges matching your capability index benchmarks. Activate the Auto-Apply Agent to automatically evaluate credentials, write cover letters, and submit applications.
          </p>

          <div className="flex items-center gap-3.5 mt-5">
            <button
              onClick={handleTriggerAutoApply}
              disabled={isApplying}
              className="px-6 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10"
            >
              {isApplying ? (
                <>
                  <Activity className="w-4.5 h-4.5 animate-pulse text-emerald-400" />
                  <span>AI Agent Applying...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4.5 h-4.5" />
                  <span>Spawn AI Auto-Apply Agent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Gemini Generated Career Trajectory Graphic */}
        <div className="lg:col-span-4 flex items-center justify-center">
          <div className="relative w-full max-w-xs rounded-3xl border border-violet-500/20 glass shadow-xl p-2 group hover:scale-[1.02] transition-transform duration-500">
            <div className="rounded-2xl overflow-hidden aspect-video">
              <img
                src="/career_trajectory.png"
                alt="AI Career Trajectory"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Live Agent Console Panel */}
      {isApplying && (
        <div className="glass border border-border/85 rounded-3xl p-5 text-left flex flex-col gap-2.5 font-mono text-xs shadow-inner animate-fade-in">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-violet-500" />
              <span>Apply Agent Console Log</span>
            </div>
            <span className="animate-pulse text-violet-500">Analyzing Open Positions...</span>
          </div>
          <div className="max-h-[160px] overflow-y-auto flex flex-col gap-1.5">
            {agentSteps.length === 0 ? (
              <div className="text-muted-foreground italic pl-2">Spawning agent and scanning opportunities...</div>
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

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-border/40 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4.5 py-2.5 m-4 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${activeTab === tab
              ? "bg-violet-600 text-white p-4 shadow-md shadow-violet-500/10"
              : "glass text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Filters bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()} by title, tech stacks, or partners...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border/85 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-violet-500 transition-colors font-semibold"
          />
        </div>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-background border border-border/85 rounded-2xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-colors cursor-pointer shrink-0 font-semibold appearance-none"
        >
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors text-sm shrink-0"
        >
          Search
        </button>
      </form>

      {/* Listings */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {opportunities.length > 0 ? (
            opportunities.map((opp) => (
              <div
                key={opp.id}
                className="glass rounded-3xl border border-border/60 p-5 flex flex-col justify-between hover:border-violet-500/15 hover:shadow-md transition-all shadow-sm group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-left min-w-0">
                      <h3 className="font-extrabold text-base text-foreground truncate group-hover:text-violet-500 transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-semibold mt-0.5 truncate">
                        {opp.organization}
                      </p>
                    </div>

                    {opp.difficulty && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border shrink-0 ${opp.difficulty === "Advanced"
                        ? "bg-rose-500/5 border-rose-500/20 text-rose-500"
                        : opp.difficulty === "Intermediate"
                          ? "bg-violet-500/5 border-violet-500/20 text-violet-500"
                          : "bg-emerald-500/5 border-emerald-500/20 text-emerald-500"
                        }`}>
                        {opp.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4 text-[10px] text-muted-foreground font-semibold mb-5 items-center">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {opp.location}
                    </span>
                    {opp.reward && (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <Award className="w-3.5 h-3.5" />
                        {opp.reward}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {opp.tags.map((tg) => (
                      <span key={tg} className="text-[9px] font-bold px-2 py-0.5 bg-secondary/50 rounded-md text-muted-foreground border border-border/20">
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={opp.link}
                  className="w-full py-2.5 rounded-xl border border-border/80 hover:bg-violet-600 hover:text-white hover:border-transparent text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-muted-foreground text-sm">
              No opportunities found matching your search and filter criteria.
            </div>
          )}
        </div>
      )}

      {/* Application History Tracker */}
      <div className="glass rounded-3xl border border-border/60 overflow-hidden flex flex-col mt-4">
        <div className="p-5 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-violet-500" />
            <h3 className="font-extrabold text-base">AI Auto-Apply Submission Ledger</h3>
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            {applications.length} Auto-Applies
          </span>
        </div>

        <div className="divide-y divide-border/40">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div
                key={app._id}
                className="p-5 flex flex-col gap-3.5 text-left hover:bg-secondary/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-foreground truncate">
                      {app.opportunityId?.title || "Role Placement"}
                    </h4>
                    <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                      {app.opportunityId?.organization || "Organization"} &bull; {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {app.status}
                    </span>
                  </div>
                </div>

                {app.coverLetter && (
                  <div className="text-xs font-semibold text-muted-foreground">
                    <button
                      onClick={() => setExpandedAppId(expandedAppId === app._id ? null : app._id)}
                      className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{expandedAppId === app._id ? "Hide Cover Letter" : "Inspect Pitch Cover Letter"}</span>
                    </button>
                    {expandedAppId === app._id && (
                      <div className="mt-2.5 p-4 rounded-2xl bg-secondary/35 border border-border/40 text-foreground/80 leading-relaxed font-semibold font-sans">
                        {app.coverLetter}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground text-sm font-semibold italic">
              No submissions tracked. Click "Spawn AI Auto-Apply Agent" above to run placement automation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
