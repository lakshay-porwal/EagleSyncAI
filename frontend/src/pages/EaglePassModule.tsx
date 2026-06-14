import React, { useEffect, useState } from "react";
import { eaglePassService } from "../services/eaglePassService";
import { BlockchainRecord } from "../types";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import { Award, ShieldCheck, Database, RefreshCw, Plus, X, Terminal, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const EaglePassModule: React.FC = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Animation State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [type, setType] = useState<"Certificate" | "Hackathon" | "Internship" | "Achievement">("Certificate");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const [verifyHash, setVerifyHash] = useState("");

  const fetchRecords = async () => {
    try {
      const data = await eaglePassService.getBlockchainRecords();
      setRecords(data);
      
      const logsRes = await api.get("/agents/logs");
      setAgentLogs(logsRes.data.logs || []);
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleStartVerification = () => {
    setTitle("");
    setIssuer("");
    setType("Certificate");
    setIsVerifying(false);
    setVerifyStep(0);
    setIsModalOpen(true);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer) {
      toast("Please fill out all fields", "error");
      return;
    }

    setIsVerifying(true);
    setVerifyStep(1);

    // Timeline steps simulation
    setTimeout(() => {
      // Generate temporary hash
      setVerifyHash("0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
      setVerifyStep(2);
    }, 800);
    setTimeout(() => setVerifyStep(3), 1600);
    setTimeout(async () => {
      try {
        await eaglePassService.verifyCredential(title, "Alex Mercer", issuer, type);
        toast(`Credential verified on-chain!`, "success");
        setVerifyStep(4);
        setTimeout(() => {
          setIsModalOpen(false);
          fetchRecords();
        }, 1200);
      } catch {
        toast("Verification failed", "error");
        setIsVerifying(false);
      }
    }, 2400);
  };

  const filteredByType = (t: string) => records.filter((r) => r.type === t);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6 animate-pulse text-left">
        <div className="h-8 bg-muted rounded-xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left py-4 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass p-6 rounded-3xl border border-border/40">
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <img
            src="/blockchain_verified_badge.png"
            alt="Blockchain Verified Badge"
            className="w-16 h-16 rounded-2xl object-cover border border-violet-500/30 shadow-md shadow-violet-500/5 hover:rotate-6 transition-all duration-300"
          />
          <div>
            <h1 className="text-3xl font-extrabold mb-1.5 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-violet-600 to-indigo-500 dark:from-cyan-400 dark:via-violet-400 dark:to-indigo-400 text-glow">
              EaglePass Blockchain Module
            </h1>
            <p className="text-muted-foreground text-sm font-semibold">
              Cryptographic ledger tracking your placements and academic verifications
            </p>
          </div>
        </div>

        <button
          onClick={handleStartVerification}
          className="px-6 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-500/10 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Verify Credential</span>
        </button>
      </div>

      {/* Futuristic Ledger status row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-premium border-cyan-500/20 p-4 rounded-2xl flex flex-col justify-between h-24 shadow-sm">
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Blockchain Status</span>
          <span className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping shrink-0" />
            Connected (Mainnet)
          </span>
        </div>

        <div className="glass-premium border-violet-500/20 p-4 rounded-2xl flex flex-col justify-between h-24 shadow-sm">
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Active Nodes</span>
          <span className="text-lg font-extrabold text-foreground mt-2">1,024 Confirmers</span>
        </div>

        <div className="glass-premium border-indigo-500/20 p-4 rounded-2xl flex flex-col justify-between h-24 shadow-sm">
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Verified Records</span>
          <span className="text-lg font-extrabold text-foreground mt-2">{records.length} Documents</span>
        </div>

        <div className="glass-premium border-emerald-500/20 p-4 rounded-2xl flex flex-col justify-between h-24 shadow-sm">
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Ledger Latency</span>
          <span className="text-lg font-extrabold text-foreground mt-2">2.4 seconds block</span>
        </div>
      </div>

      {/* Category grids */}
      {[
        { title: "Verified Certificates", type: "Certificate", color: "text-violet-500" },
        { title: "Verified Hackathons", type: "Hackathon", color: "text-cyan-500" },
        { title: "Verified Internships", type: "Internship", color: "text-indigo-500" },
        { title: "Verified Achievements", type: "Achievement", color: "text-emerald-500" }
      ].map((cat) => {
        const matches = filteredByType(cat.type);
        return (
          <div key={cat.title} className="flex flex-col gap-4">
            <h3 className="font-extrabold text-base border-b border-border/40 pb-2">{cat.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.length > 0 ? (
                matches.map((item) => (
                  <div
                    key={item.id}
                    className="glass-premium border-border/80 rounded-2xl p-5 hover:border-violet-500/20 transition-all flex flex-col justify-between text-left group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-9 h-9 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-500 shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <span className="text-[8px] font-bold px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 rounded-md uppercase">
                          Verified
                        </span>
                      </div>
                      
                      <h4 className="font-extrabold text-sm text-foreground mb-1 group-hover:text-violet-500 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        Issued by {item.issuer}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-border/20 flex flex-col gap-1.5 text-[9px] font-semibold text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Date verified:</span>
                        <span className="text-foreground">{item.date}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span>Transaction Hash:</span>
                        <span className="font-mono text-[8px] truncate text-foreground select-all bg-secondary/50 p-1.5 rounded-lg border border-border/40">
                          {item.txHash}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-6 text-center text-muted-foreground text-xs font-semibold">
                  No verified {cat.type.toLowerCase()} records index logs.
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Complete Verification History table */}
      <div className="glass rounded-3xl border border-border/60 overflow-hidden flex flex-col mt-4">
        <div className="p-5 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-extrabold text-base">All Ledger History Logs</h3>
          <span className="text-[10px] text-muted-foreground font-bold uppercase">Transaction Feeds</span>
        </div>
        <div className="overflow-x-auto text-xs font-semibold">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/20">
                <th className="p-4 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Record Title</th>
                <th className="p-4 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="p-4 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Issuer</th>
                <th className="p-4 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Verification Date</th>
                <th className="p-4 font-bold text-[10px] text-muted-foreground uppercase tracking-wider">Consensus Hash</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr key={item.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/10 transition-colors">
                  <td className="p-4 font-bold text-foreground">{item.title}</td>
                  <td className="p-4">
                    <span className="text-[9px] font-bold px-2 py-0.5 border border-border/60 rounded-md bg-secondary/40 text-muted-foreground">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{item.issuer}</td>
                  <td className="p-4 text-muted-foreground">{item.date}</td>
                  <td className="p-4 font-mono text-[10px] text-cyan-600 dark:text-cyan-400 select-all">{item.txHash.slice(0, 16)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Logs Panel */}
      <div className="glass rounded-3xl border border-border/60 overflow-hidden flex flex-col mt-6">
        <div className="p-5 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-extrabold text-base">Autonomous Agent Executive Audit Logs</h3>
          <span className="text-[10px] text-muted-foreground font-bold uppercase">Run Histories</span>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {agentLogs.length > 0 ? (
            agentLogs.map((log) => (
              <div key={log._id || log.id} className="p-4 rounded-2xl border border-border/40 bg-secondary/10 hover:border-violet-500/20 transition-all text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/20 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-violet-600/10 text-violet-600 dark:text-violet-400">
                      {log.agentName}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Trigger: "{log.trigger}"
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-2">
                    <span>Duration: {(log.duration / 1000).toFixed(2)}s</span>
                    <span>•</span>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="font-mono text-[10px] text-muted-foreground bg-[#0b0e14] p-3 rounded-xl max-h-[120px] overflow-y-auto flex flex-col gap-1 border border-border/40">
                  {log.steps.map((s: any, idx: number) => {
                    let color = "text-muted-foreground";
                    if (s.type === "thinking") color = "text-amber-500";
                    if (s.type === "tool_call") color = "text-sky-500";
                    if (s.type === "tool_result") color = "text-emerald-500";
                    if (s.type === "decision") color = "text-violet-500 font-bold";
                    return (
                      <div key={idx} className="pb-0.5 border-b border-border/10 last:border-none leading-normal">
                        <span className={`${color} mr-1.5 font-bold`}>[{s.type.toUpperCase()}]</span>
                        <span className="text-foreground/85">{s.content}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-2.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Outcome: {log.outcome}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-muted-foreground text-xs font-semibold italic">
              No recent agent executions recorded.
            </div>
          )}
        </div>
      </div>

      {/* Verification Dialog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isVerifying) setIsModalOpen(false); }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md glass-premium border-border/80 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 z-10 pointer-events-auto text-left"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start pb-4 border-b border-border/40">
                <h3 className="font-extrabold text-lg text-foreground">
                  Verify New Credential
                </h3>
                <button
                  disabled={isVerifying}
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg border border-border/40 hover:bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!isVerifying ? (
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Credential Title</label>
                      <input
                        type="text"
                        placeholder="Advanced React Certification"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-background border border-border/85 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-violet-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Issuer / partner</label>
                      <input
                        type="text"
                        placeholder="Meta / Coursera"
                        value={issuer}
                        onChange={(e) => setIssuer(e.target.value)}
                        className="w-full bg-background border border-border/85 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-violet-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Verification Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full bg-background border border-border/85 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-violet-500 transition-colors cursor-pointer font-semibold"
                      >
                        <option value="Certificate">Certificate</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="Internship">Internship</option>
                        <option value="Achievement">Achievement</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors shadow-lg shadow-violet-500/10"
                    >
                      Broadcast Verification
                    </button>
                  </form>
                ) : (
                  <div className="py-6 flex flex-col gap-5 text-left font-mono text-xs font-bold text-emerald-500 bg-black p-5 rounded-2xl border border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-500/10 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 animate-pulse" />
                        <span>LEDGER CONSOLE</span>
                      </span>
                      <span className="text-[10px] animate-pulse">SYNCING</span>
                    </div>

                    {verifyStep >= 1 && (
                      <div className="flex flex-col gap-0.5">
                        <p>&gt; Executing SHA-256 local hash compiler...</p>
                        <p className="text-[9px] text-muted-foreground">Generating receipt node verification arrays</p>
                      </div>
                    )}
                    
                    {verifyStep >= 2 && (
                      <div className="flex flex-col gap-0.5">
                        <p>&gt; HASH: {verifyHash.slice(0, 24)}...</p>
                        <p>&gt; Broadcasting to ledger nodes network...</p>
                      </div>
                    )}

                    {verifyStep >= 3 && (
                      <div className="flex flex-col gap-0.5">
                        <p>&gt; Validating block signature consensus...</p>
                        <p className="text-cyan-400">&gt; 12/12 Confirmations received.</p>
                      </div>
                    )}

                    {verifyStep === 4 && (
                      <div className="text-emerald-400 font-extrabold flex items-center gap-1.5 mt-2">
                        <ShieldCheck className="w-5 h-5 animate-bounce" />
                        <span>SUCCESS: BLOCK TRANSACTION CONFIRMED!</span>
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
