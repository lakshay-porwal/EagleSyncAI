import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Navigation, Award, Briefcase, BrainCircuit, MessageSquare, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems = [
    { name: "Overview Dashboard", path: "/dashboard", desc: "View your metrics and progress charts", icon: Navigation },
    { name: "Capability Analysis", path: "/dashboard/capability", desc: "View skill radar charts and gap analysis", icon: BrainCircuit },
    { name: "Career Recommendations", path: "/dashboard/careers", desc: "View matches for Software Engineer, AI, etc.", icon: Briefcase },
    { name: "Interactive Roadmap", path: "/dashboard/roadmap", desc: "Track tasks and monthly milestone roadmap", icon: Sparkles },
    { name: "Interview Hub", path: "/dashboard/interview", desc: "Start AI mock interviews and check scores", icon: Sparkles },
    { name: "Opportunity Center", path: "/dashboard/opportunities", desc: "Browse jobs, hackathons, and certifications", icon: Search },
    { name: "EaglePass Blockchain", path: "/dashboard/eaglepass", desc: "Verify credentials and view hash block logs", icon: Award },
    { name: "AI Mentor Chat", path: "/dashboard/chat", desc: "Chat with the Gemini-powered AI Career Mentor", icon: MessageSquare },
    { name: "Profile Settings", path: "/dashboard/settings", desc: "Configure theme preferences and notifications", icon: Settings },
  ];

  const filteredItems = commandItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.desc.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleCustomTrigger = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    // Listen for custom trigger from the search button in layouts
    document.addEventListener("open-command-palette", handleCustomTrigger);
    
    // Wire up trigger button click explicitly
    const btn = document.getElementById("cmd-palette-trigger");
    if (btn) {
      btn.addEventListener("click", handleCustomTrigger);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("open-command-palette", handleCustomTrigger);
      if (btn) {
        btn.removeEventListener("click", handleCustomTrigger);
      }
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
      setSearch("");
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleNavigate(filteredItems[selectedIndex].path);
      }
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl glass-premium border-border/80 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          >
            {/* Search Input bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools, analytics, recommended roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-sm"
              />
              <span className="text-[10px] bg-muted border border-border/40 px-1.5 py-0.5 rounded font-semibold text-muted-foreground uppercase">
                ESC
              </span>
            </div>

            {/* List Results */}
            <div className="max-h-[340px] overflow-y-auto p-2">
              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Quick Commands
                  </div>
                  {filteredItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          isSelected
                            ? "bg-violet-600 text-white shadow-md shadow-violet-500/10"
                            : "hover:bg-secondary/40 text-foreground"
                        }`}
                      >
                        <Icon className={`w-4.5 h-4.5 ${isSelected ? "text-white" : "text-muted-foreground"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{item.name}</p>
                          <p className={`text-xs truncate ${isSelected ? "text-violet-100" : "text-muted-foreground"}`}>
                            {item.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] bg-violet-500 border border-violet-400 px-1.5 py-0.5 rounded font-mono text-white">
                            Enter
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No commands found matching "{search}"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
