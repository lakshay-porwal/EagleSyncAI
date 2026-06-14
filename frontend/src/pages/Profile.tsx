import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import {
  User,
  FileText,
  Upload,
  Plus,
  X,
  GraduationCap,
  Briefcase,
  History,
  Sliders,
  Phone,
  Target
} from "lucide-react";

interface SkillItem {
  name: string;
  value: number;
  history?: {
    value: number;
    date: string;
    assessedBy: string;
  }[];
}

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentRole, setCurrentRole] = useState(user?.currentRole || "");
  const [targetCategory, setTargetCategory] = useState(user?.targetCategory || "SDE");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "");
  const [education, setEducation] = useState(user?.education || "");
  const [careerGoals, setCareerGoals] = useState(user?.careerGoals || "");
  const [projects, setProjects] = useState<string[]>(user?.projects || []);
  
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState("");
  const [dbSkills, setDbSkills] = useState<SkillItem[]>([]);
  const [expandedSkillHistory, setExpandedSkillHistory] = useState<string | null>(null);

  const [resumeName, setResumeName] = useState(user?.resumeName || "");
  const [isDragging, setIsDragging] = useState(false);

  // Sync profile details if user loads/changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setCurrentRole(user.currentRole || "");
      setTargetCategory(user.targetCategory || "SDE");
      setTargetRole(user.targetRole || "");
      setEducation(user.education || "");
      setCareerGoals(user.careerGoals || "");
      setProjects(user.projects || []);
      setResumeName(user.resumeName || "");
    }
  }, [user]);

  // Fetch skill values and history on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/users/skills");
        if (res.data && res.data.skills) {
          setDbSkills(res.data.skills);
        }
      } catch (err) {
        console.error("Error fetching skills", err);
      }
    };
    fetchSkills();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Save profile details
      await updateProfile({
        name,
        phone,
        education,
        careerGoals,
        currentRole,
        targetRole,
        targetCategory,
        projects,
        resumeName
      });

      // 2. Save skills details
      const skillsToSave = dbSkills.map((s) => ({
        name: s.name,
        value: s.value
      }));
      await api.put("/users/skills", { skills: skillsToSave });

      // Refresh local skills state to update history from server response
      const res = await api.get("/users/skills");
      if (res.data && res.data.skills) {
        setDbSkills(res.data.skills);
      }

      toast("Profile and skills updated successfully!", "success");
    } catch (err: any) {
      console.error(err);
      toast(err.response?.data?.error || "Failed to update profile", "error");
    }
  };

  const handleAddSkill = () => {
    if (
      newSkill.trim() &&
      !dbSkills.some((s) => s.name.toLowerCase() === newSkill.trim().toLowerCase())
    ) {
      setDbSkills([...dbSkills, { name: newSkill.trim(), value: 50, history: [] }]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setDbSkills(dbSkills.filter((s) => s.name !== skillName));
  };

  const handleSkillSliderChange = (skillName: string, val: number) => {
    setDbSkills(
      dbSkills.map((s) => (s.name === skillName ? { ...s, value: val } : s))
    );
  };

  const handleAddProject = () => {
    if (newProject.trim() && !projects.includes(newProject.trim())) {
      setProjects([...projects, newProject.trim()]);
      setNewProject("");
    }
  };

  const handleRemoveProject = (pr: string) => {
    setProjects(projects.filter((p) => p !== pr));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      toast(`Resume "${file.name}" uploaded successfully!`, "success");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setResumeName(file.name);
      toast(`Resume "${file.name}" dropped & uploaded!`, "success");
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl text-left">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-1.5 tracking-tight">My Profile</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Manage your career identity details, programming skills, and portfolio nodes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Forms column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <form onSubmit={handleSave} className="glass p-6 sm:p-8 rounded-3xl border border-border/60 space-y-6 flex flex-col">
            <h3 className="font-extrabold text-base border-b border-border/40 pb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-500" />
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-xs font-semibold">
                <label className="text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-semibold">
                <label className="text-muted-foreground">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5 text-xs font-semibold">
                <label className="text-muted-foreground flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Current Role / Status</span>
                </label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Student, Intern, Junior Developer"
                  className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-semibold">
                <label className="text-muted-foreground flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Target Path (Category)</span>
                </label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors cursor-pointer"
                >
                  <option value="SDE">SDE Placements</option>
                  <option value="JEE">JEE Exam Prep</option>
                  <option value="NEET">NEET Exam Prep</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-semibold">
                <label className="text-muted-foreground flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  <span>Target Role / Focus</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, IIT CSE, AIIMS MBBS"
                  className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-xs font-semibold">
              <label className="text-muted-foreground flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education Details</span>
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="bg-background border border-border/85 rounded-2xl px-4 py-3.5 outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 text-xs font-semibold">
              <label className="text-muted-foreground">Career Objective Goals</label>
              <textarea
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
                rows={3}
                className="bg-background border border-border/85 rounded-2xl p-4 outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed"
                required
              />
            </div>

            {/* Dynamic Skills Editor with Sliders & History */}
            <div className="flex flex-col gap-3 text-xs font-semibold border-t border-border/40 pt-4">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Sliders className="w-5 h-5 text-violet-500" />
                <span>Programming Skills & Proficiency</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a new skill (e.g. Docker, Python)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-background border border-border/85 rounded-2xl px-4 py-3 outline-none focus:border-violet-500 transition-colors font-semibold"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-3 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Skills Sliders list */}
              <div className="space-y-4 mt-3">
                {dbSkills.length === 0 ? (
                  <p className="text-muted-foreground italic text-xs">No skills configured. Add some above.</p>
                ) : (
                  dbSkills.map((sk) => (
                    <div
                      key={sk.name}
                      className="p-4 rounded-2xl border border-border/60 bg-white/40 dark:bg-[#0f131a]/40 space-y-2.5"
                    >
                      <div className="flex justify-between items-center text-xs font-extrabold">
                        <span className="text-foreground">{sk.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-violet-600 dark:text-violet-400">{sk.value}%</span>
                          {sk.history && sk.history.length > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedSkillHistory(
                                  expandedSkillHistory === sk.name ? null : sk.name
                                )
                              }
                              title="Show history log"
                              className="text-muted-foreground hover:text-violet-600 p-1 rounded-lg hover:bg-secondary/40 transition-all"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(sk.name)}
                            className="text-muted-foreground hover:text-rose-500 p-1 rounded-lg hover:bg-secondary/40 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sk.value}
                        onChange={(e) =>
                          handleSkillSliderChange(sk.name, parseInt(e.target.value))
                        }
                        className="w-full h-1.5 rounded-lg bg-secondary border-none outline-none appearance-none cursor-pointer accent-violet-600"
                      />

                      {/* Expandable History Log */}
                      {expandedSkillHistory === sk.name && sk.history && sk.history.length > 0 && (
                        <div className="mt-2.5 p-3 rounded-2xl bg-secondary/30 border border-border/40 font-mono text-[10px] space-y-1 animate-fade-in text-left">
                          <div className="font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                            Value History log:
                          </div>
                          {sk.history.map((h, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-foreground/80 py-1 border-b border-border/10 last:border-none"
                            >
                              <span>{new Date(h.date).toLocaleDateString()}</span>
                              <span className="font-bold text-violet-500">{h.value}%</span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                  h.assessedBy === "agent"
                                    ? "bg-violet-500/10 text-violet-500"
                                    : "bg-blue-500/10 text-blue-500"
                                }`}
                              >
                                {h.assessedBy.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Edit Projects */}
            <div className="flex flex-col gap-1.5 text-xs font-semibold border-t border-border/40 pt-4">
              <label className="text-muted-foreground">Projects List</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a project title (e.g. Distributed API)"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="flex-1 bg-background border border-border/85 rounded-2xl px-4 py-3 outline-none focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-4 py-3 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-colors"
                >
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-2.5 mt-3.5">
                {projects.map((pr) => (
                  <div
                    key={pr}
                    className="p-3 rounded-2xl border border-border/60 flex items-center justify-between bg-white/40 dark:bg-[#0f131a]/40"
                  >
                    <span className="text-foreground font-semibold">{pr}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(pr)}
                      className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors shadow-lg shadow-violet-500/10 mt-2"
            >
              Save Profile Updates
            </button>
          </form>
        </div>

        {/* Resume upload column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass p-6 rounded-3xl border border-border/60">
            <h3 className="font-extrabold text-base mb-4 flex items-center gap-2 border-b border-border/40 pb-2">
              <FileText className="w-5 h-5 text-violet-500" />
              <span>Resume Uploader</span>
            </h3>

            {/* Drag & Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] relative ${
                isDragging
                  ? "border-violet-500 bg-violet-500/5"
                  : "border-border/80 hover:border-violet-500/50 hover:bg-secondary/20"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-xs font-bold text-foreground">Drag and drop file here</p>
              <p className="text-[10px] text-muted-foreground mt-1 font-semibold">Supports PDF, DOCX up to 10MB</p>
            </div>

            {/* Display Active CV */}
            {resumeName && (
              <div className="mt-5 p-4 rounded-2xl bg-violet-500/5 border border-violet-500/15 flex items-center gap-3 text-left">
                <FileText className="w-8 h-8 text-violet-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate">{resumeName}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Ready for parser audits</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResumeName("");
                    toast("Resume removed", "info");
                  }}
                  className="text-muted-foreground hover:text-rose-500 p-1 transition-colors shrink-0"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
