import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useSocket } from "../hooks/useSocket";
import { useAgent } from "../hooks/useAgent";
import api from "../utils/api";
import {
  Cpu,
  ArrowRight,
  ArrowLeft,
  Check,
  Brain,
  Sliders,
  FileText,
  Play,
  Terminal,
  Activity,
  Layers,
  GraduationCap
} from "lucide-react";

interface RoleCard {
  title: string;
  skills: string[];
  description: string;
  gradient: string;
}

const DOMAINS = [
  { id: "SDE", name: "Software Engineering (SDE)", desc: "Code, deployment, systems engineering" },
  { id: "JEE", name: "JEE Engineering Prep", desc: "IIT, NIT entrance subjects prep" },
  { id: "NEET", name: "NEET Medical Prep", desc: "AIIMS medical college entrance" }
];

const ROLES_BY_DOMAIN: { [key: string]: RoleCard[] } = {
  SDE: [
    {
      title: "Frontend Developer",
      skills: ["React", "TypeScript", "CSS", "Testing", "Webpack"],
      description: "Build beautiful, high-performance web applications and UI interfaces.",
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      title: "Backend Developer",
      skills: ["Node.js", "Databases", "REST APIs", "Docker", "System Design"],
      description: "Architect robust APIs, databases, microservices, and server systems.",
      gradient: "from-purple-600 to-indigo-500",
    },
    {
      title: "Full Stack Developer",
      skills: ["React", "Node.js", "MongoDB", "REST APIs", "TypeScript"],
      description: "Master both frontend rendering and backend API database services.",
      gradient: "from-violet-600 to-fuchsia-500",
    },
    {
      title: "AI/ML Engineer",
      skills: ["Python", "TensorFlow", "Math/Stats", "Data Structures", "SQL"],
      description: "Train intelligence models, build pipelines, and call LLM API systems.",
      gradient: "from-emerald-600 to-teal-500",
    },
    {
      title: "DevOps Engineer",
      skills: ["Docker", "Kubernetes", "CI/CD", "AWS/GCP", "Linux"],
      description: "Automate build infrastructure, deployment routes, and scale nodes.",
      gradient: "from-orange-600 to-amber-500",
    },
  ],
  JEE: [
    {
      title: "Computer Science Focus",
      skills: ["Mathematics", "Physics", "Organic Chemistry", "Physical Chemistry", "Inorganic Chemistry"],
      description: "Aspirants targeting Computer Science Engineering at IITs.",
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      title: "Electronics & Electrical Focus",
      skills: ["Physics", "Mathematics", "Physical Chemistry", "Inorganic Chemistry", "Organic Chemistry"],
      description: "Aiming for Circuit Branches (ECE/EE) at top engineering colleges.",
      gradient: "from-purple-600 to-indigo-500",
    },
    {
      title: "Mechanical & Civil Focus",
      skills: ["Physics", "Mathematics", "Physical Chemistry", "Inorganic Chemistry", "Organic Chemistry"],
      description: "Targeting Mechanical, Civil, or Aerospace branches.",
      gradient: "from-orange-600 to-amber-500",
    },
    {
      title: "Pure Physics & Math Focus",
      skills: ["Physics", "Mathematics", "Physical Chemistry", "Inorganic Chemistry", "Organic Chemistry"],
      description: "Focusing on pure research and core math sciences fields.",
      gradient: "from-emerald-600 to-teal-500",
    },
  ],
  NEET: [
    {
      title: "MBBS Aspirant",
      skills: ["Biology (Zoology)", "Biology (Botany)", "Organic Chemistry", "Inorganic Chemistry", "Physics"],
      description: "Aiming for Bachelor of Medicine and Bachelor of Surgery at top AIIMS colleges.",
      gradient: "from-rose-600 to-pink-500",
    },
    {
      title: "BDS Aspirant",
      skills: ["Biology (Zoology)", "Biology (Botany)", "Organic Chemistry", "Inorganic Chemistry", "Physics"],
      description: "Targeting Dental Sciences and oral healthcare paths.",
      gradient: "from-purple-600 to-indigo-500",
    },
    {
      title: "Pharmacy & Bio-Tech Focus",
      skills: ["Biology (Botany)", "Organic Chemistry", "Inorganic Chemistry", "Biology (Zoology)", "Physics"],
      description: "Focusing on pharmacology, biological engineering, and drug research.",
      gradient: "from-cyan-600 to-teal-500",
    },
  ]
};

export const Onboarding: React.FC = () => {
  const { isAuthenticated, user, token, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState<string>("SDE");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [skillsValues, setSkillsValues] = useState<{ [key: string]: number }>({});
  const [education, setEducation] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [careerGoals, setCareerGoals] = useState("");

  // Agents execution states
  const [isRunningAgents, setIsRunningAgents] = useState(false);
  const [agentsFinished, setAgentsFinished] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast("Please log in to access onboarding", "info");
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);
  
  const { agentSteps, clearSteps } = useSocket(token);
  const { runCapability, runRoadmap } = useAgent();

  // Populate skills default when role or domain changes
  useEffect(() => {
    if (selectedRole) {
      const rolesList = ROLES_BY_DOMAIN[selectedDomain] || [];
      const role = rolesList.find((r) => r.title === selectedRole);
      if (role) {
        const initialVals: { [key: string]: number } = {};
        role.skills.forEach((s) => {
          initialVals[s] = 50; // default middle rating
        });
        setSkillsValues(initialVals);
      }
    }
  }, [selectedRole, selectedDomain]);

  const handleDomainChange = (domainId: string) => {
    setSelectedDomain(domainId);
    setSelectedRole("");
    setSkillsValues({});
  };

  const handleNext = () => {
    if (step === 1 && !selectedRole) {
      toast("Please select a target path & role specialization to proceed", "warning");
      return;
    }
    if (step === 3 && (!education.trim() || !careerGoals.trim())) {
      toast("Please specify your educational background and career/exam goals", "warning");
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSliderChange = (skill: string, val: number) => {
    setSkillsValues((prev) => ({
      ...prev,
      [skill]: val,
    }));
  };

  const handleActivateAgents = async () => {
    setIsRunningAgents(true);
    clearSteps();

    try {
      const skillsArray = Object.keys(skillsValues).map((name) => ({
        name,
        value: skillsValues[name],
      }));

      // 1. Save onboarding details
      await api.post("/users/complete-onboarding", {
        skills: skillsArray,
        targetCategory: selectedDomain,
        targetRole: selectedRole,
        education,
        currentRole,
        careerGoals,
      });

      // Update auth context state locally
      updateProfile({
        targetCategory: selectedDomain,
        targetRole: selectedRole,
        education,
        currentRole,
        careerGoals,
        onboardingComplete: true,
      });

      // 2. Trigger AI agents in parallel
      await runCapability();
      
      setAgentsFinished(true);
      toast("AI Agents configured successfully!", "success");
    } catch (err: any) {
      console.error(err);
      toast(err.response?.data?.error || "Error activating agents", "error");
      setIsRunningAgents(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#0b0e14] text-foreground flex flex-col justify-between py-10 px-4 md:px-10 text-left">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between border-b border-border/40 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            EagleSync<span className="text-violet-600 dark:text-violet-400">AI</span>
          </span>
        </div>
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-secondary px-3 py-1.5 rounded-full">
          Step {step} of 4
        </div>
      </div>

      {/* Steps Container */}
      <div className="max-w-5xl w-full mx-auto my-10 flex-1 flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5 justify-center md:justify-start">
                <Brain className="w-7 h-7 text-violet-500" />
                Select Preparation Path & Focus
              </h2>
              <p className="text-muted-foreground text-sm font-semibold mt-1">
                Choose whether you are preparing for SDE placements, JEE Engineering Entrance, or NEET Medical Exams.
              </p>
            </div>

            {/* Path Selection tabs switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-border/50 bg-[#f1f3f7] dark:bg-[#131722] p-2 rounded-3xl max-w-3xl">
              {DOMAINS.map((dom) => (
                <button
                  key={dom.id}
                  type="button"
                  onClick={() => handleDomainChange(dom.id)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left gap-1 transition-all ${
                    selectedDomain === dom.id
                      ? "bg-white dark:bg-[#1c2333] shadow-md border border-border/10 text-violet-500"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="font-extrabold text-xs">{dom.name}</span>
                  <span className="text-[10px] opacity-75 font-semibold hidden sm:inline">{dom.desc}</span>
                </button>
              ))}
            </div>

            {/* Specialization cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {(ROLES_BY_DOMAIN[selectedDomain] || []).map((role) => (
                <button
                  key={role.title}
                  onClick={() => setSelectedRole(role.title)}
                  className={`p-5 rounded-3xl border text-left transition-all relative flex flex-col justify-between min-h-[160px] group ${
                    selectedRole === role.title
                      ? "border-violet-500 bg-violet-500/5 shadow-lg shadow-violet-500/5"
                      : "border-border/80 hover:border-violet-500/50 hover:bg-secondary/20"
                  }`}
                >
                  {selectedRole === role.title && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <span className={`text-[10px] uppercase font-extrabold tracking-wider bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent`}>
                    Target Focus
                  </span>
                  <div className="mt-4">
                    <h4 className="font-extrabold text-base text-foreground group-hover:text-violet-500 transition-colors">
                      {role.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed font-medium">
                      {role.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
                <Sliders className="w-7 h-7 text-violet-500" />
                Rate Your Current Level
              </h2>
              <p className="text-muted-foreground text-sm font-semibold mt-1">
                Give an honest assessment of your proficiency level in key subjects/skills for **{selectedRole}**.
              </p>
            </div>

            <div className="space-y-5 mt-6 bg-white/50 dark:bg-[#0f131a]/50 p-6 md:p-8 rounded-3xl border border-border/60">
              {Object.keys(skillsValues).map((skill) => (
                <div key={skill} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-foreground">{skill}</span>
                    <span className="text-violet-600 dark:text-violet-400">{skillsValues[skill]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skillsValues[skill]}
                    onChange={(e) => handleSliderChange(skill, parseInt(e.target.value))}
                    className="w-full h-2 rounded-lg bg-secondary border-none outline-none appearance-none cursor-pointer accent-violet-600"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
                <FileText className="w-7 h-7 text-violet-500" />
                Background Details & Objectives
              </h2>
              <p className="text-muted-foreground text-sm font-semibold mt-1">
                Provide your education details and write what your ideal college admission / placement goal looks like.
              </p>
            </div>

            <div className="space-y-5 mt-6 bg-white/50 dark:bg-[#0f131a]/50 p-6 md:p-8 rounded-3xl border border-border/60">
              <div className="flex flex-col gap-1.5 text-xs font-semibold">
                <label className="text-muted-foreground">Education Details</label>
                <input
                  type="text"
                  placeholder={selectedDomain === "SDE" ? "e.g. B.Tech Computer Science, IIT Bombay (2026)" : "e.g. Class 12, DAV Public School (2026)"}
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-semibold">
                <label className="text-muted-foreground">Current Status</label>
                <input
                  type="text"
                  placeholder={selectedDomain === "SDE" ? "e.g. Junior Developer, Intern" : "e.g. Secondary School Student, Repeater"}
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-semibold">
                <label className="text-muted-foreground">Describe your target objectives/goals</label>
                <textarea
                  placeholder={selectedDomain === "SDE" ? "e.g. Aspiring Full Stack Engineer. I want to build scalable APIs." : "e.g. Target JEE Main Rank under 5000 and IIT CSE branch admission."}
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  rows={4}
                  className="bg-background border border-border/85 rounded-2xl p-4 outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 max-w-3xl mx-auto w-full text-center">
            {!isRunningAgents ? (
              <div className="space-y-6 py-4 flex flex-col items-center">
                <img
                  src="/ai_agent_orchestration.png"
                  alt="AI Agent Orchestration"
                  className="w-full max-w-sm h-44 object-cover rounded-3xl mb-1 border border-border/50 shadow-xl hover:scale-[1.02] transition-transform duration-300"
                />
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Activate Autonomous AI Agent
                </h2>
                <p className="text-muted-foreground text-sm font-semibold max-w-md leading-relaxed">
                  We are ready to spawn your Capability Audit Agent to index your {selectedDomain === "SDE" ? "skills" : "exam preparation levels"} and build a baseline telemetry radar.
                </p>
                <button
                  onClick={handleActivateAgents}
                  className="px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors shadow-lg shadow-violet-500/20 flex items-center gap-2 mt-4"
                >
                  <span>Spawn AI Agent</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-20 h-20 bg-violet-500/20 rounded-full blur-xl animate-pulse" />
                    <Activity className="w-10 h-10 text-violet-500 animate-pulse relative" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mt-2">
                    {agentsFinished ? "Analysis Complete!" : "Agents Analyzing System Profile..."}
                  </h2>
                  <p className="text-xs text-muted-foreground max-w-sm leading-relaxed font-semibold">
                    {agentsFinished
                      ? "Your capability index has been mapped! You can now generate your custom study roadmap."
                      : "The agent is communicating with the server environment to run calculations."}
                  </p>
                </div>

                {/* Console Terminal for Live Agent Updates */}
                <div className="glass border border-border/80 rounded-3xl p-5 text-left max-h-[300px] overflow-y-auto flex flex-col gap-2.5 font-mono text-xs shadow-inner">
                  <div className="flex items-center gap-2 border-b border-border/40 pb-2 mb-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    <Terminal className="w-4 h-4 text-violet-500" />
                    <span>Live Agent socket stream</span>
                  </div>
                  {agentSteps.length === 0 ? (
                    <div className="text-muted-foreground italic pl-2">Spawning agents and awaiting first steps...</div>
                  ) : (
                    agentSteps.map((s, i) => {
                      let color = "text-muted-foreground";
                      if (s.type === "thinking") color = "text-amber-500";
                      if (s.type === "tool_call") color = "text-sky-500";
                      if (s.type === "tool_result") color = "text-emerald-500";
                      if (s.type === "decision") color = "text-violet-500 font-bold";

                      return (
                        <div key={i} className="leading-relaxed border-b border-border/20 pb-1.5 last:border-none">
                          <span className={`${color} font-bold mr-1.5`}>[{s.type.toUpperCase()}]</span>
                          <span className="text-foreground/80">{s.content}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                {agentsFinished && (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-10 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mx-auto animate-fade-in"
                  >
                    <span>Enter Personal Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {step < 4 && (
        <div className="max-w-6xl w-full mx-auto border-t border-border/40 pt-5 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="px-5 py-3 rounded-2xl border border-border/80 hover:bg-secondary/40 font-bold text-sm transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-violet-500/10"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
