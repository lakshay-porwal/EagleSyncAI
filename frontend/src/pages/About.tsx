import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Target, Users, BookOpen, ChevronRight, BarChart } from "lucide-react";
import { motion } from "framer-motion";

export const About: React.FC = () => {
  const stats = [
    { value: "48,000+", label: "Engineers Accelerated" },
    { value: "92.4%", label: "Placement Success Rate" },
    { value: "120,000+", label: "On-Chain Verifications" },
    { value: "$12M+", label: "In Direct Scholarship Matches" }
  ];

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 text-left max-w-5xl">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-6 shadow-sm"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Our Vision & Mission</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6"
        >
          Smarter Engineering Careers
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg leading-relaxed font-medium"
        >
          We are building the trust framework and tutoring engines to empower the next generation of global software builders.
        </motion.p>
      </div>

      {/* Grid: Vision, Mission, Problem, Why */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="glass p-8 rounded-3xl border border-border/60">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 mb-6">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-xl mb-3">Our Mission</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            To democratize access to elite tech tutoring, resume screening, and matching. We replace standard algorithmic screeners with dynamic coding assessments and direct verification ledger records.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl border border-border/60">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-6">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-xl mb-3">Our Vision</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A frictionless employment environment where credentials require zero audits, engineers learn matching paths in real-time, and companies hire based on verified blockchain-hashed code abilities.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl border border-border/60">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-xl mb-3">The Problem Statement</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Standard career routing is broken. Job seekers inflate resumes, automated screening filters miss top-tier hidden talent, and students are left with generic, non-actionable learning advice.
          </p>
        </div>

        <div className="glass p-8 rounded-3xl border border-border/60">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-xl mb-3">Why EagleSyncAI</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We merge 7 autonomous agents into a consolidated, highly responsive client. By coupling mock learning timeline checklist updates with on-chain verifications, we create a secure profile that recruiters trust.
          </p>
        </div>
      </div>

      {/* Impact Statistics */}
      <div className="glass p-8 sm:p-12 rounded-3xl border border-border/80 mb-20">
        <h3 className="text-2xl font-extrabold mb-10 text-center">EagleSyncAI by the Numbers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((st) => (
            <div key={st.label}>
              <p className="text-3xl sm:text-4xl font-extrabold text-gradient text-glow mb-2">{st.value}</p>
              <p className="text-muted-foreground text-xs sm:text-sm font-semibold">{st.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-500/20 hover:scale-105 transition-all text-base group"
        >
          Begin Your Analysis
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
