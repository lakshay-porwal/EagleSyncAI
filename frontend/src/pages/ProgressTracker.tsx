import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, BarChart2, Calendar, Shield, Cpu } from "lucide-react";
import api from "../utils/api";

export const ProgressTracker: React.FC = () => {
  const [learningProgress, setLearningProgress] = useState<any[]>([]);
  const [skillProgress, setSkillProgress] = useState<any[]>([]);
  const [roadmapCompletion, setRoadmapCompletion] = useState<any[]>([]);
  const [interviewReadiness, setInterviewReadiness] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // 1. Fetch user skills for competency chart
        const skillsRes = await api.get("/users/skills");
        const skills = skillsRes.data.skills || [];
        setSkillProgress(skills.map((s: any) => ({
          name: s.name,
          rating: s.value,
        })));

        // 2. Fetch roadmap data for completion chart
        const roadmapRes = await api.get("/users/roadmap");
        const roadmap = roadmapRes.data.roadmap;
        if (roadmap && roadmap.months) {
          setRoadmapCompletion(roadmap.months.map((m: any) => {
            let total = 0;
            let completed = 0;
            m.weeks.forEach((w: any) => {
              w.tasks.forEach((t: any) => {
                total++;
                if (t.completed) completed++;
              });
            });
            return {
              name: m.month,
              Completed: completed,
              Remaining: Math.max(0, total - completed),
            };
          }));
        } else {
          setRoadmapCompletion([
            { name: "Month 1", Completed: 0, Remaining: 5 },
            { name: "Month 2", Completed: 0, Remaining: 5 },
            { name: "Month 3", Completed: 0, Remaining: 5 },
          ]);
        }

        // 3. Fetch interview sessions for performance curve
        const interviewRes = await api.get("/interviews/sessions");
        const sessions = interviewRes.data.sessions || [];
        if (sessions.length > 0) {
          // Show oldest to newest
          const sorted = [...sessions].reverse();
          setInterviewReadiness(sorted.map((s: any, idx: number) => ({
            name: `Mock ${idx + 1}`,
            score: s.score || 0,
          })));
        } else {
          setInterviewReadiness([
            { name: "No Mocks Run", score: 0 },
          ]);
        }

        // 4. Fetch agent logs to retrieve Weekly Learning Velocity
        const logsRes = await api.get("/agents/logs");
        const logs = logsRes.data.logs || [];
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
              } catch {}
            }
          }
        }
        if (weeklyData.length === 0) {
          weeklyData = [
            { week: "Week 1", hoursEquivalent: 6 },
            { week: "Week 2", hoursEquivalent: 10 },
            { week: "Week 3", hoursEquivalent: 8 },
            { week: "Week 4", hoursEquivalent: 12 },
          ];
        }
        setLearningProgress(weeklyData.map((d: any) => ({
          name: d.week || d.name,
          hours: d.hoursEquivalent || 5,
        })));

      } catch (err) {
        console.error("Failed to load progress analytics:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6 animate-pulse text-left">
        <div className="h-8 bg-muted rounded-xl w-48" />
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left py-4">
      {/* Header & Graphic Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-border/20 pb-5">
        <div className="lg:col-span-8 flex flex-col text-left">
          <h1 className="text-3xl font-extrabold mb-1.5 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400">
            Progress Tracker
          </h1>
          <p className="text-muted-foreground text-sm font-semibold max-w-xl leading-relaxed">
            Consolidated learning analytics compiled across your session profiles. Inspect study velocity, mock exam performance trends, and curriculum completion indexes below.
          </p>
        </div>

        {/* AI Progress Graphic Asset */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative w-full max-w-xs rounded-3xl border border-violet-500/20 glass shadow-xl p-2 group hover:scale-[1.02] transition-transform duration-500">
            <div className="rounded-2xl overflow-hidden aspect-video">
              <img
                src="/progress_charts.png"
                alt="AI Learning Progress Trends"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Grid of Analytics Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Learning Progress */}
        <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col justify-between h-[320px]">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40 shrink-0">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <h3 className="font-extrabold text-sm text-foreground">Weekly Learning Velocity</h3>
          </div>
          <div className="flex-1 w-full text-xs font-semibold">
            {learningProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={learningProgress} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHoursProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                  <XAxis dataKey="name" stroke="#888" tickLine={false} />
                  <YAxis stroke="#888" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="hours" name="Study Hours" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorHoursProgress)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground italic flex items-center justify-center h-full">No velocity tracking.</div>
            )}
          </div>
        </div>

        {/* Chart 2: Skill Progress */}
        <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col justify-between h-[320px]">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40 shrink-0">
            <BarChart2 className="w-5 h-5 text-violet-500" />
            <h3 className="font-extrabold text-sm text-foreground">Stack Competency Indices</h3>
          </div>
          <div className="flex-1 w-full text-xs font-semibold">
            {skillProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillProgress} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                  <XAxis dataKey="name" stroke="#888" tickLine={false} />
                  <YAxis stroke="#888" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="rating" name="Rating Value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground italic flex items-center justify-center h-full">No skills ratings found. Complete onboarding.</div>
            )}
          </div>
        </div>

        {/* Chart 3: Roadmap Completion */}
        <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col justify-between h-[320px]">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40 shrink-0">
            <TrendingUp className="w-5 h-5 text-cyan-500" />
            <h3 className="font-extrabold text-sm text-foreground">Roadmap Milestones Progress</h3>
          </div>
          <div className="flex-1 w-full text-xs font-semibold">
            {roadmapCompletion.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roadmapCompletion} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                  <XAxis dataKey="name" stroke="#888" tickLine={false} />
                  <YAxis stroke="#888" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Completed" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Remaining" fill="rgba(128,128,128,0.12)" stackId="a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground italic flex items-center justify-center h-full">No roadmap tasks.</div>
            )}
          </div>
        </div>

        {/* Chart 4: Interview Readiness */}
        <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col justify-between h-[320px]">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/40 shrink-0">
            <Shield className="w-5 h-5 text-rose-500" />
            <h3 className="font-extrabold text-sm text-foreground">Interview Performance Curve</h3>
          </div>
          <div className="flex-1 w-full text-xs font-semibold">
            {interviewReadiness.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={interviewReadiness} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.08)" />
                  <XAxis dataKey="name" stroke="#888" tickLine={false} />
                  <YAxis stroke="#888" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" name="Mock Grade %" stroke="#f43f5e" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground italic flex items-center justify-center h-full">No interview sessions recorded.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
