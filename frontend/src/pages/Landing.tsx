import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Play,
  Brain,
  Search,
  BookOpen,
  Award,
  Shield,
  TrendingUp,
  BarChart,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Plus,
  Minus,
  Cpu,
  RefreshCw
} from "lucide-react";

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  // Pricing toggle state
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  
  // FAQs state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // EaglePass Live verification demo state
  const [certId, setCertId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const handleVerifyDemo = () => {
    if (!certId.trim()) return;
    setIsVerifying(true);
    setVerifyStep(1);
    setVerifyResult(null);

    // Timeline simulation
    setTimeout(() => setVerifyStep(2), 800);
    setTimeout(() => setVerifyStep(3), 1600);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifyStep(4);
      setVerifyResult({
        hash: "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        block: Math.floor(Math.random() * 900000) + 12000000,
        confirmed: true,
        recipient: "Alex Mercer",
        issuer: "Stanford University",
        course: "Advanced Machine Learning Specialization"
      });
    }, 2400);
  };

  const agents = [
    {
      title: "Capability Agent",
      icon: Brain,
      color: "from-violet-500/20 to-purple-500/20 text-violet-500 dark:text-violet-400 border-violet-500/30",
      desc: "Audits your active repository skills, project structures, and outputs a dynamic readiness radar."
    },
    {
      title: "Career Agent",
      icon: Search,
      color: "from-cyan-500/20 to-teal-500/20 text-cyan-500 dark:text-cyan-400 border-cyan-500/30",
      desc: "Calculates precise market matches for technical roles and indexes salary projections."
    },
    {
      title: "Roadmap Agent",
      icon: BookOpen,
      color: "from-indigo-500/20 to-blue-500/20 text-indigo-500 dark:text-indigo-400 border-indigo-500/30",
      desc: "Generates custom step-by-step milestones to bypass career skill gaps autonomously."
    },
    {
      title: "Interview Agent",
      icon: Shield,
      color: "from-emerald-500/20 to-green-500/20 text-emerald-500 dark:text-emerald-400 border-emerald-500/30",
      desc: "Runs simulated technical and behavioral mocks, delivering qualitative AI feedback."
    },
    {
      title: "Opportunity Agent",
      icon: Award,
      color: "from-amber-500/20 to-yellow-500/20 text-amber-500 dark:text-amber-400 border-amber-500/30",
      desc: "Indexes scholarships, hackathons, and certified openings matching your exact score."
    },
    {
      title: "Trend Agent",
      icon: TrendingUp,
      color: "from-rose-500/20 to-orange-500/20 text-rose-500 dark:text-rose-400 border-rose-500/30",
      desc: "Predicts software demand curves so you transition into high-growth sectors early."
    },
    {
      title: "Progress Agent",
      icon: BarChart,
      color: "from-fuchsia-500/20 to-pink-500/20 text-fuchsia-500 dark:text-fuchsia-400 border-fuchsia-500/30",
      desc: "Aggregates learning timelines to track milestone speed and overall interview readiness."
    }
  ];

  const steps = [
    { title: "Create Profile", desc: "Upload your code repositories and education milestones in minutes." },
    { title: "AI Analysis", desc: "Our 7 autonomous agents analyze skill gaps and profile demand curves." },
    { title: "Personalized Roadmap", desc: "Receive targeted daily checklists matching top engineering paths." },
    { title: "Get Opportunities", desc: "Unlock verified certifications, high-payout hackathons, and jobs." },
    { title: "Track Growth", desc: "Watch your readiness score climb as credentials verify on-chain." }
  ];

  const pricingTiers = [
    {
      name: "Standard AI",
      price: billingPeriod === "monthly" ? "$29" : "$19",
      period: "/ mo",
      desc: "Perfect for students and early-career developers looking to optimize their portfolio.",
      features: [
        "Core Skill Readiness Radar",
        "Weekly Roadmap Milestones",
        "2 AI Mock Interviews per month",
        "Basic Career Matches",
        "Standard Job/Internship Feed"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      name: "Eagle Professional",
      price: billingPeriod === "monthly" ? "$79" : "$49",
      period: "/ mo",
      desc: "Designed for ambitious developers looking to fast-track placement into Tier 1 tech labs.",
      features: [
        "Everything in Standard AI",
        "Unlimited AI Mock Interviews",
        "Real-time Repo & Resume Audit",
        "Full EaglePass Blockchain verification",
        "Priority Opportunity Center matching",
        "24/7 AI Mentor Chat access"
      ],
      cta: "Start Free Trial",
      highlighted: true
    },
    {
      name: "Enterprise Sync",
      price: "Custom",
      period: "",
      desc: "For universities, coding bootcamps, and teams tracking collective growth metrics.",
      features: [
        "Everything in Eagle Professional",
        "Cohort Progression Dashboards",
        "Custom blockchain verification contracts",
        "Dedicated mentor chatbot API keys",
        "Bulk seat licensing discounts",
        "Direct recruiter outreach automation"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  const faqs = [
    {
      q: "What makes EagleSyncAI different from standard resume builders?",
      a: "Standard sites only show static lines of text. EagleSyncAI is an autonomous, agent-driven platform. We audit real codebase structures, measure algorithm logic, and verify credentials cryptographically on the blockchain. We don't just format resumes — we build career roadmaps and train you for mocks."
    },
    {
      q: "How does the blockchain EaglePass module work?",
      a: "When you complete verified bootcamps, win partner hackathons, or earn degree milestones, EagleSyncAI generates a SHA-256 hash representing your credential. This hash is broadcast to a secure verifiable ledger. Recruiters can verify the validity of your certificates cryptographically in one click, eliminating resume fraud."
    },
    {
      q: "Can I connect my private GitHub repositories?",
      a: "Yes. Our codebase auditing is secure. The Capability Agent parses metadata structures to identify coding habits, dependency knowledge, and architecture choices without copying or training on your source code. You retain full ownership and security."
    },
    {
      q: "Is there a free tier or trial available?",
      a: "Absolutely. We offer a 14-day free trial of our Eagle Professional plan, allowing you to run your initial capability radar audit, create a personalized learning roadmap, and complete one full mock interview."
    }
  ];

  return (
    <div className="flex flex-col w-full relative">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 border-b border-border/20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Headline and CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Career Intelligence Platform</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
            >
              Autonomous Career <br />
              <span className="text-gradient text-glow">Intelligence Platform</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-muted-foreground text-lg md:text-xl max-w-xl mb-8 leading-relaxed font-medium"
            >
              EagleSyncAI is an agent-driven ecosystem that audits your skills, generates personalized learning roadmaps, conducts mock interviews, and secures your credentials on-chain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 text-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 transition-all text-base flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 text-center rounded-2xl border border-border/60 hover:bg-secondary/40 font-bold transition-all text-base flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Demo
              </a>
            </motion.div>
          </div>

          {/* Interactive Globe / Floating Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Premium Dashboard Image Container */}
            <div className="relative w-full max-w-md rounded-3xl border border-violet-500/20 glass shadow-2xl p-2 group hover:scale-[1.02] transition-transform duration-500">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="/landing_hero_preview.png"
                  alt="EagleSyncAI Dashboard preview"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-3xl" />

              {/* Floating Glassmorphism Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-6 glass-premium border-border/80 rounded-2xl p-3 shadow-xl flex items-center gap-3 max-w-[200px]"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <CheckCircle className="w-4.5 h-4.5" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold truncate">EaglePass Verified</p>
                  <p className="text-[10px] text-muted-foreground truncate">Stanford CS Degree</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-6 -right-6 glass-premium border-border/80 rounded-2xl p-3 shadow-xl flex items-center gap-3 max-w-[190px]"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                  <Brain className="w-4.5 h-4.5" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold truncate">Readiness Score</p>
                  <p className="text-sm font-extrabold text-violet-600 dark:text-violet-400">78% Match</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section (7 AI Agents) */}
      <section className="py-24 border-b border-border/20 relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Powered by 7 Autonomous AI Agents
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-16 font-medium">
            Our specialized agents run continuous micro-analysis loops to audit, train, and guide your software engineering progression.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={agent.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="glass p-6 rounded-3xl border border-border/60 hover:border-violet-500/20 hover:shadow-lg transition-all flex flex-col text-left group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${agent.color} flex items-center justify-center border mb-6 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{agent.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{agent.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="py-24 border-b border-border/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            How EagleSyncAI Accelerates You
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-20 font-medium">
            From initial repo analysis to cryptographically secured offers, our pipeline functions end-to-end.
          </p>

          <div className="relative flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-6">
            {/* Stepper Timeline Connector */}
            <div className="absolute top-7 left-7 lg:left-0 lg:right-0 lg:h-0.5 lg:w-full h-full w-0.5 bg-border/40 -z-10" />

            {steps.map((st, idx) => (
              <div key={st.title} className="flex lg:flex-col items-start lg:items-center text-left lg:text-center gap-6 lg:gap-4 flex-1">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border-4 border-background flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20 shrink-0 select-none">
                  {idx + 1}
                </div>
                <div className="pt-2 lg:pt-0">
                  <h3 className="font-extrabold text-lg mb-2">{st.title}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EaglePass Blockchain Verification Live Demo */}
      <section id="demo" className="py-24 border-b border-border/20 bg-gradient-to-b from-transparent to-violet-500/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Copy side */}
            <div className="lg:col-span-5 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-6 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                <span>On-Chain Cryptographic Proof</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 leading-tight">
                EaglePass Blockchain <br />
                Verifications
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                EaglePass generates verifiable credentials directly to a decentralized ledger. Say goodbye to fake resumes, long background checks, and manual credential validations.
              </p>
              <ul className="space-y-3.5 text-sm font-semibold">
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="text-violet-600 dark:text-violet-400 w-5 h-5 shrink-0" />
                  <span>Instant Recruiter verification keys</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="text-violet-600 dark:text-violet-400 w-5 h-5 shrink-0" />
                  <span>Immutable hash verification ledger</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle className="text-violet-600 dark:text-violet-400 w-5 h-5 shrink-0" />
                  <span>Automatic credential-matching scoring</span>
                </li>
              </ul>
            </div>

            {/* Interactive Demo Side */}
            <div className="lg:col-span-7">
              <div className="glass-premium border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                <h3 className="font-extrabold text-xl mb-4 text-left">Test EaglePass Verification</h3>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <input
                    type="text"
                    placeholder="Paste Credential ID (e.g. STANFORD-CS-2026)"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    disabled={isVerifying}
                    className="flex-1 bg-background/50 border border-border/85 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    onClick={handleVerifyDemo}
                    disabled={isVerifying || !certId.trim()}
                    className="px-6 py-3.5 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shrink-0"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify On-Chain"
                    )}
                  </button>
                </div>

                {/* Progress Animation Panel */}
                {isVerifying && (
                  <div className="flex flex-col gap-4 text-left p-4 rounded-2xl border border-border/40 bg-secondary/25">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-ping" />
                      <p className="text-xs font-semibold">
                        {verifyStep === 1 && "Generating SHA-256 local hash..."}
                        {verifyStep === 2 && "Broadcasting hash to ledger nodes..."}
                        {verifyStep === 3 && "Awaiting consensus blocks confirmations..."}
                      </p>
                    </div>
                    <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.4, ease: "linear" }}
                        className="bg-violet-600 h-full"
                      />
                    </div>
                  </div>
                )}

                {/* Success Animation Result */}
                {verifyStep === 4 && verifyResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-left flex flex-col gap-3.5"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-border/40">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                        <CheckCircle className="w-5 h-5" />
                        <span>Verification Successful!</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                        Block Confirm
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold">
                      <div>
                        <p className="text-muted-foreground font-medium mb-0.5">Recipient</p>
                        <p className="text-foreground">{verifyResult.recipient}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium mb-0.5">Issuer</p>
                        <p className="text-foreground">{verifyResult.issuer}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground font-medium mb-0.5">Credential Name</p>
                        <p className="text-foreground">{verifyResult.course}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground font-medium mb-0.5">Transaction Hash</p>
                        <p className="text-foreground font-mono text-[10px] break-all select-all">{verifyResult.hash}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-24 border-b border-border/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-16">
            Loved by Ambitious Engineers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "EagleSyncAI's Capability Agent correctly identified that my API error handling was sub-optimal. The generated Roadmap led me to learn NestJS properly, and I landed my Full Stack role at Stripe last month!",
                author: "Sarah Jenkins",
                role: "Full Stack Engineer, Stripe",
                avatar: "SJ"
              },
              {
                quote: "The mock system design interviews are incredibly realistic. The feedback was brutal but correct, and it helped me prepare for my Google architect loops. Highly recommended.",
                author: "Devon Carter",
                role: "Cloud Architect, Google",
                avatar: "DC"
              },
              {
                quote: "Having my blockchain verified credentials linked directly to my resume makes applications frictionless. Recruiter outbound leads tripled since I linked my EaglePass profile.",
                author: "Elena Rostova",
                role: "AI Developer, Scale AI",
                avatar: "ER"
              }
            ].map((t) => (
              <div key={t.author} className="glass p-8 rounded-3xl border border-border/60 text-left flex flex-col justify-between shadow-sm">
                <p className="text-muted-foreground text-sm italic leading-relaxed mb-8">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center shadow-md">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{t.author}</h4>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pricing */}
      <section className="py-24 border-b border-border/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Simple, Value-First Pricing
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-10 font-medium">
            Invest in your technical growth. Switch to annual billing to save up to 40% immediately.
          </p>

          {/* Switch Button */}
          <div className="flex items-center justify-center gap-3 mb-16">
            <span className={`text-sm font-bold ${billingPeriod === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 rounded-full bg-muted border border-border/40 flex items-center p-0.5 relative transition-all duration-300"
            >
              <div
                className={`w-5 h-5 rounded-full bg-violet-600 transition-all ${
                  billingPeriod === "yearly" ? "translate-x-6" : ""
                }`}
              />
            </button>
            <span className={`text-sm font-bold flex items-center gap-1.5 ${billingPeriod === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase font-bold">
                Save 40%
              </span>
            </span>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`glass rounded-3xl border p-8 flex flex-col justify-between text-left shadow-sm transition-all relative ${
                  tier.highlighted
                    ? "border-violet-500/50 shadow-violet-500/5 lg:scale-105"
                    : "border-border/60"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-extrabold text-xl mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-6">{tier.desc}</p>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold">{tier.price}</span>
                    <span className="text-muted-foreground text-sm font-semibold">{tier.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-xs font-semibold text-foreground/90">
                        <CheckCircle className="text-violet-600 dark:text-violet-400 w-4.5 h-4.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/signup"
                  className={`w-full text-center py-3 rounded-2xl font-bold transition-all ${
                    tier.highlighted
                      ? "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/15"
                      : "border border-border/80 hover:bg-secondary/40"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-24 max-w-3xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass rounded-2xl border border-border/60 overflow-hidden text-left transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between font-bold text-sm sm:text-base outline-none"
                >
                  <span className="pr-4">{faq.q}</span>
                  {isOpen ? <Minus className="w-4 h-4 shrink-0 text-violet-500" /> : <Plus className="w-4 h-4 shrink-0 text-violet-500" />}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-muted-foreground text-xs sm:text-sm leading-relaxed border-t border-border/20">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
