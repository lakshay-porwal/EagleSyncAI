import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, Legend
} from "recharts";
import { capabilityService } from "../services/capabilityService";
import { interviewService } from "../services/interviewService";
import { eaglePassService } from "../services/eaglePassService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useSocket } from "../hooks/useSocket";
import api from "../utils/api";
import { Brain, Briefcase, Award, GraduationCap, Trophy, ChevronRight, Cpu, Activity, Terminal, Sparkles, RefreshCw, Send } from "lucide-react";

export const DashboardHome: React.FC = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  const [isWhatsAppSending, setIsWhatsAppSending] = useState(false);
  
  const [readiness, setReadiness] = useState(50);
  const [skillsCount, setSkillsCount] = useState(0);
  const [interviewScore, setInterviewScore] = useState(0);
  const [certificationsCount, setCertificationsCount] = useState(0);
  const [lastLog, setLastLog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Briefing conversational summary state
  const [whatsUpBrief, setWhatsUpBrief] = useState("");
  const [isBriefLoading, setIsBriefLoading] = useState(false);

  // Dynamic Chart States
  const [weeklyProgressData, setWeeklyProgressData] = useState<any[]>([]);
  const [skillGrowthData, setSkillGrowthData] = useState<any[]>([]);
  const [careerReadinessData, setCareerReadinessData] = useState<any[]>([]);

  // Live Agent Feed from Socket.io
  const { agentSteps, connected } = useSocket(token);

  const handleSendWhatsApp = async () => {
    try {
      setIsWhatsAppSending(true);
      const res = await api.post("/users/send-whatsapp");
      toast(res.data.message || "Progress bulletin successfully dispatched to WhatsApp!", "success");
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || "Failed to send WhatsApp message";
      toast(errMsg, "error");
    } finally {
      setIsWhatsAppSending(false);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        // 0. Fetch conversational AI Briefing
        setIsBriefLoading(true);
        try {
          const briefingRes = await api.get("/agents/whats-up");
          setWhatsUpBrief(briefingRes.data.briefing || "");
        } catch (err) {
          console.warn("Failed to load What's Up briefing:", err);
        } finally {
          setIsBriefLoading(false);
        }

        // 1. Fetch capability data
        const capability = await capabilityService.getCapabilityData();
        setReadiness(capability.readinessScore);
        setSkillsCount(capability.skills.length);
        setSkillGrowthData(capability.skills.map((s) => ({
          subject: s.name,
          A: s.value,
          fullMark: 100,
        })));

        // 2. Fetch interviews
        const interviews = await interviewService.getSessions();
        if (interviews.length > 0 && interviews[0].score) {
          setInterviewScore(interviews[0].score);
        }

        // 3. Fetch certifications (EaglePass)
        const blockchain = await eaglePassService.getBlockchainRecords();
        setCertificationsCount(blockchain.length);

        // 4. Fetch agent logs
        const logsRes = await api.get("/agents/logs");
        const logs = logsRes.data.logs || [];
        if (logs.length > 0) {
          setLastLog(logs[0]);
        }

        // 5. Parse Career Agent log for Bar Chart
        const careerLog = logs.find((l: any) => l.agentName === "Career Agent");
        let matches = [];
        if (careerLog) {
          for (let i = careerLog.steps.length - 1; i >= 0; i--) {
            const content = careerLog.steps[i].content;
            const jsonMatch = content.match(/(\[[\s\S]*"matchPercentage"[\s\S]*\])/);
            if (jsonMatch) {
              try {
                matches = JSON.parse(jsonMatch[1]);
                break;
              } catch { }
            }
          }
        }
        if (matches.length === 0) {
          matches = [
            { title: "Frontend Dev", matchPercentage: 75 },
            { title: "Software Eng", matchPercentage: 70 },
            { title: "Full Stack", matchPercentage: 65 },
          ];
        }
        setCareerReadinessData(matches.slice(0, 5).map((m: any) => ({
          role: m.title.replace("Developer", "Dev").replace("Engineer", "Eng"),
          Current: m.matchPercentage,
          Target: 85,
        })));

        // 6. Parse Progress Agent log for Area Chart
        const progressLog = logs.find((l: any) => l.agentName === "Progress Agent");
        let weeklyData = [];
        if (progressLog) {
          for (let i = progressLog.steps.length - 1; i >= 0; i--) {
            const content = progressLog.steps[i].content;
            const jsonMatch = content.match(/({[\s\S]*"weeklyData"[\s\S]*})/);
            if (jsonMatch) {
              try {
                const parsed = JSON.parse(jsonMatch[1]);
                weeklyData = parsed.weeklyData || [];
                break;
              } catch { }
            }
          }
        }
        if (weeklyData.length === 0) {
          weeklyData = [
            { week: "W1", hoursEquivalent: 8, sessions: 2 },
            { week: "W2", hoursEquivalent: 12, sessions: 3 },
            { week: "W3", hoursEquivalent: 10, sessions: 2 },
            { week: "W4", hoursEquivalent: 15, sessions: 4 },
          ];
        }
        setWeeklyProgressData(weeklyData.map((d: any) => ({
          name: d.week || d.name,
          hours: d.hoursEquivalent || 6,
          tasks: d.sessions || 2,
        })));

      } catch (err) {
        console.warn("Failed to load dashboard statistics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6 animate-pulse text-left">
        <div className="h-8 bg-muted rounded-xl w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-muted rounded-3xl lg:col-span-2" />
          <div className="h-80 bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  const widgets = [
    { label: "Readiness Score", value: `${readiness}%`, detail: `${skillsCount} skills tracked`, icon: Brain, color: "text-violet-500 bg-violet-500/10", path: "/dashboard/capability" },
    { label: "Career Match", value: careerReadinessData[0]?.Current ? `${careerReadinessData[0].Current}%` : "0%", detail: careerReadinessData[0]?.role || "Computing matches...", icon: Briefcase, color: "text-cyan-500 bg-cyan-500/10", path: "/dashboard/careers" },
    { label: "Latest Interview", value: interviewScore > 0 ? `${interviewScore}%` : "N/A", detail: "Mock evaluation score", icon: Trophy, color: "text-emerald-500 bg-emerald-500/10", path: "/dashboard/interview" },
    { label: "EaglePass Ledger", value: `${certificationsCount} Verified`, detail: "Cryptographic credentials", icon: Award, color: "text-amber-500 bg-amber-500/10", path: "/dashboard/eaglepass" },
  ];

  return (
    <div className="flex flex-col gap-8 text-left py-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold mb-1.5 tracking-tight">Overview Dashboard</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Audit metrics feed from your autonomous agents
        </p>
      </div>

      {/* What's Up conversational briefing card */}
      <div className="glass-premium p-6 rounded-3xl border border-violet-500/20 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in relative overflow-hidden bg-gradient-to-r from-violet-500/5 via-indigo-500/5 to-transparent">
        {/* Background Accent glow */}
        <div className="absolute w-28 h-28 bg-violet-600/10 rounded-full blur-2xl -top-8 -left-8 pointer-events-none" />
        <div className="absolute w-28 h-28 bg-fuchsia-600/10 rounded-full blur-2xl -bottom-8 -right-8 pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-violet-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-[10px] text-violet-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5 font-bold">
              What's Up? AI Daily Briefing
            </span>
            {isBriefLoading ? (
              <div className="space-y-2 py-1">
                <div className="h-3.5 bg-muted rounded w-[300px] sm:w-[500px] animate-pulse" />
                <div className="h-3.5 bg-muted rounded w-[250px] sm:w-[400px] animate-pulse" />
              </div>
            ) : (
              <p className="text-sm font-semibold text-foreground/90 leading-relaxed font-sans">
                {whatsUpBrief || "Loading your progress updates..."}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          <button
            onClick={handleSendWhatsApp}
            disabled={isWhatsAppSending}
            title="Send progress update to WhatsApp"
            className="px-4.5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-violet-500/10 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isWhatsAppSending ? "Sending..." : "Send to WhatsApp"}</span>
          </button>

          <button
            onClick={async () => {
              try {
                setIsBriefLoading(true);
                const briefingRes = await api.get("/agents/whats-up");
                setWhatsUpBrief(briefingRes.data.briefing || "");
              } catch {
                // Ignore
              } finally {
                setIsBriefLoading(false);
              }
            }}
            title="Refresh briefing"
            className="p-2.5 rounded-xl border border-border/85 hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Last Agent Run Widget */}
      {lastLog && (
        <div className="p-4 rounded-3xl bg-violet-500/5 border border-violet-500/10 text-xs font-semibold text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-violet-500 shrink-0" />
            <span>
              Last activity: <strong className="text-foreground">{lastLog.agentName}</strong> completed with outcome: <em className="text-foreground">{lastLog.outcome}</em>
            </span>
          </div>
          <span className="text-[10px] opacity-75 shrink-0">{new Date(lastLog.createdAt).toLocaleString()}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {widgets.map((wd) => {
          const Icon = wd.icon;
          return (
            <Link
              key={wd.label}
              to={wd.path}
              className="glass p-5 rounded-3xl border border-border/60 hover:border-violet-500/15 hover:shadow-md transition-all flex items-start justify-between group"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">
                  {wd.label}
                </span>
                <span className="text-2xl font-extrabold text-foreground group-hover:text-violet-500 transition-colors">
                  {wd.value}
                </span>
                {wd.detail && (
                  <span className="text-[10px] text-muted-foreground font-semibold mt-1">
                    {wd.detail}
                  </span>
                )}
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${wd.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Live AI Agent activity panel */}
      <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-muted'}`} />
            <h3 className="font-extrabold text-base">Live AI Agent Stream</h3>
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
            Socket.io Feed
          </span>
        </div>

        {agentSteps.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground font-medium italic">
            No live agent executions streaming currently. Run capability audits, roads generation, or mock interviews to watch.
          </div>
        ) : (
          <div className="font-mono text-xs max-h-[200px] overflow-y-auto flex flex-col gap-2.5 p-4 rounded-2xl bg-secondary/10 border border-border/40">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2 mb-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              <Terminal className="w-4 h-4 text-violet-500" />
              <span>Console Log</span>
            </div>
            {agentSteps.map((step, idx) => {
              let color = "text-muted-foreground";
              if (step.type === "thinking") color = "text-amber-500";
              if (step.type === "tool_call") color = "text-sky-500";
              if (step.type === "tool_result") color = "text-emerald-500";
              if (step.type === "decision") color = "text-violet-500 font-bold";

              return (
                <div key={idx} className="pb-1.5 border-b border-border/20 last:border-none flex items-start gap-2 leading-relaxed">
                  <span className={`${color} shrink-0 font-bold`}>[{step.type.toUpperCase()}]</span>
                  <span className="text-foreground/80">{step.content}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Analytics Charts Grid */}
      {skillGrowthData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Study Progression Area Chart */}
          <div className="glass p-6 rounded-3xl border border-border/60 lg:col-span-2 flex flex-col justify-between h-[360px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-base">Weekly Learning Velocity</h3>
              <span className="text-[10px] text-muted-foreground font-bold uppercase">Hours / Tasks Complete</span>
            </div>
            <div className="flex-1 w-full text-xs font-semibold">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyProgressData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                  <XAxis dataKey="name" stroke="#888" tickLine={false} />
                  <YAxis stroke="#888" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="hours" name="Study Hours" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Radar Chart */}
          <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col justify-between h-[360px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base">Skill Index Radar</h3>
              <span className="text-[10px] text-muted-foreground font-bold uppercase">AST Audits</span>
            </div>
            <div className="flex-1 w-full text-[10px] font-semibold flex items-center justify-center">
              <ResponsiveContainer width="100%" height="95%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillGrowthData}>
                  <PolarGrid stroke="rgba(128,128,128,0.15)" />
                  <PolarAngleAxis dataKey="subject" stroke="#888" />
                  <Radar name="Skills score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Career Match Readiness Bar Chart */}
          <div className="glass p-6 rounded-3xl border border-border/60 lg:col-span-3 flex flex-col justify-between h-[340px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-base">Role Matching Projections</h3>
              <span className="text-[10px] text-muted-foreground font-bold uppercase">Target 85% Benchmark</span>
            </div>
            <div className="flex-1 w-full text-xs font-semibold">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={careerReadinessData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                  <XAxis dataKey="role" stroke="#888" tickLine={false} />
                  <YAxis stroke="#888" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Current" name="Your Match %" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Target" name="Hiring Benchmark" fill="rgba(128,128,128,0.15)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

