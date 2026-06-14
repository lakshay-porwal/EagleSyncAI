import React, { useEffect, useState } from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { capabilityService } from "../services/capabilityService";
import { CapabilityData } from "../types";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";
import { useAgent } from "../hooks/useAgent";
import { useToast } from "../context/ToastContext";
import { BrainCircuit, CheckCircle, AlertCircle, ArrowUpRight, Cpu, Activity, Terminal } from "lucide-react";

export const CapabilityAnalysis: React.FC = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [data, setData] = useState<CapabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Live Agent Hooks
  const { agentSteps, clearSteps } = useSocket(token);
  const { runCapability, isRunning } = useAgent();

  const fetchCapability = async () => {
    try {
      const capability = await capabilityService.getCapabilityData();
      setData(capability);
    } catch (err) {
      console.error("Failed to load capability data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCapability();
  }, []);

  const handleRunAudit = async () => {
    clearSteps();
    toast("Spawning Capability Auditor Agent...", "info");
    const res = await runCapability();
    if (res) {
      toast("Capability audit completed successfully!", "success");
      await fetchCapability();
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-6 py-6 animate-pulse text-left">
        <div className="h-8 bg-muted rounded-xl w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="h-80 bg-muted rounded-3xl lg:col-span-4" />
          <div className="h-80 bg-muted rounded-3xl lg:col-span-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-1.5 tracking-tight">Capability Analysis</h1>
          <p className="text-muted-foreground text-sm font-semibold">
            Autonomous audit maps from your repository structures
          </p>
        </div>
        <button
          onClick={handleRunAudit}
          disabled={isRunning}
          className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10 shrink-0"
        >
          {isRunning ? (
            <>
              <Activity className="w-4.5 h-4.5 animate-pulse text-emerald-400" />
              <span>Auditing Skills...</span>
            </>
          ) : (
            <>
              <Cpu className="w-4.5 h-4.5" />
              <span>Run Capability Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Live Agent Console Panel */}
      {isRunning && (
        <div className="glass border border-border/80 rounded-3xl p-5 text-left flex flex-col gap-2.5 font-mono text-xs shadow-inner animate-fade-in">
          <div className="flex items-center justify-between border-b border-border/40 pb-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-violet-500" />
              <span>Capability Agent Console Log</span>
            </div>
            <span className="animate-pulse text-violet-500">Awaiting Steps...</span>
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

      {/* Hero Stats / Radar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Readiness Index */}
        <div className="glass p-6 rounded-3xl border border-border/60 lg:col-span-4 flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between pb-3 border-b border-border/40 mb-3">
            <span className="font-extrabold text-sm text-foreground">Readiness Index</span>
            <span className="text-[10px] text-violet-500 font-bold uppercase">Dynamic Rating</span>
          </div>
          <div className="my-6 relative flex items-center justify-center">
            {/* Pulsing Glow Background */}
            <div className="absolute w-36 h-36 bg-violet-500/10 rounded-full blur-xl animate-pulse-glow" />
            <div className="w-32 h-32 rounded-full border-4 border-violet-500/20 flex flex-col items-center justify-center relative bg-background/50">
              <span className="text-4xl font-extrabold text-violet-600 dark:text-violet-400">
                {data.readinessScore}%
              </span>
              <span className="text-[9px] text-muted-foreground font-semibold mt-1">Ready</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed mb-1">
            Your skill index outperforms **82%** of early-career builders on our network.
          </p>
        </div>

        {/* Radar Chart */}
        <div className="glass p-6 rounded-3xl border border-border/60 lg:col-span-8 flex flex-col justify-between min-h-[300px]">
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <span className="font-extrabold text-sm text-foreground">Skill Radar Map</span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase">AST Metrics</span>
          </div>
          <div className="flex-1 w-full text-[10px] font-semibold flex items-center justify-center py-2">
            {data.skills && data.skills.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.skills}>
                  <PolarGrid stroke="rgba(128,128,128,0.15)" />
                  <PolarAngleAxis dataKey="name" stroke="#888" />
                  <Radar name="Capability" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground italic">No skill dimensions assessed. Click audit to run.</div>
            )}
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-base mb-1">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Key Strengths</span>
          </div>
          <ul className="space-y-3.5 text-xs font-semibold leading-relaxed">
            {data.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span className="text-foreground/90">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-rose-500 font-extrabold text-base mb-1">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Target Weaknesses</span>
          </div>
          <ul className="space-y-3.5 text-xs font-semibold leading-relaxed">
            {data.weaknesses.map((wk, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span className="text-foreground/90">{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gap Analysis Table */}
      <div className="glass rounded-3xl border border-border/60 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-extrabold text-base">Skill Gap Analysis</h3>
          <span className="text-[10px] text-muted-foreground font-bold uppercase">Action Pathways</span>
        </div>
        <div className="overflow-x-auto text-xs font-semibold">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/20">
                <th className="p-4 font-bold text-[10px] text-muted-foreground uppercase tracking-wider w-1/4">Skill</th>
                <th className="p-4 font-bold text-[10px] text-muted-foreground uppercase tracking-wider w-1/2">Identified Gap</th>
                <th className="p-4 font-bold text-[10px] text-muted-foreground uppercase tracking-wider w-1/4">Action Plan</th>
              </tr>
            </thead>
            <tbody>
              {data.gapAnalysis && data.gapAnalysis.length > 0 ? (
                data.gapAnalysis.map((gap, i) => (
                  <tr key={i} className="border-b border-border/20 last:border-0 hover:bg-secondary/10 transition-colors">
                    <td className="p-4 font-bold text-foreground">{gap.skill}</td>
                    <td className="p-4 text-muted-foreground leading-relaxed">{gap.gap}</td>
                    <td className="p-4 text-violet-600 dark:text-violet-400 font-bold leading-relaxed">{gap.action}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-muted-foreground italic">No gaps analyzed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-extrabold text-base mb-1">
          <BrainCircuit className="w-5 h-5 shrink-0" />
          <span>AI Assistant Recommendations</span>
        </div>
        <ul className="space-y-4 text-xs font-semibold leading-relaxed">
          {data.aiRecommendations && data.aiRecommendations.length > 0 ? (
            data.aiRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-violet-500/5 border border-violet-500/15">
                <div className="w-6 h-6 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-500 shrink-0">
                  <ArrowUpRight className="w-4.5 h-4.5" />
                </div>
                <span className="text-foreground/90 mt-0.5">{rec}</span>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-muted-foreground italic">No recommendations. Run audit to generate.</li>
          )}
        </ul>
      </div>
    </div>
  );
};
