import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, ShieldAlert, Award, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: "AI Mentor Chat",
      icon: MessageSquare,
      color: "bg-indigo-600 text-white",
      onClick: () => navigate("/dashboard/chat"),
    },
    {
      label: "AI Mock Interview",
      icon: Sparkles,
      color: "bg-violet-600 text-white",
      onClick: () => navigate("/dashboard/interview"),
    },
    {
      label: "Verify Credential",
      icon: Award,
      color: "bg-cyan-600 text-white",
      onClick: () => navigate("/dashboard/eaglepass"),
    },
    {
      label: "Search Tools (Ctrl+K)",
      icon: Search,
      color: "bg-slate-700 text-white dark:bg-slate-800",
      onClick: () => {
        // Trigger command palette custom event
        document.dispatchEvent(new CustomEvent("open-command-palette"));
      },
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Speed Dial Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-2.5 mb-1.5 pointer-events-auto">
            {actions.map((act, index) => (
              <motion.div
                key={act.label}
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 15 }}
                transition={{ delay: (actions.length - 1 - index) * 0.05, duration: 0.15 }}
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => {
                  act.onClick();
                  setIsOpen(false);
                }}
              >
                {/* Floating label */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-bold text-foreground px-2 py-1 glass border border-border/80 rounded-lg shadow-sm">
                  {act.label}
                </span>
                
                {/* Action button icon */}
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 ${act.color}`}
                >
                  <act.icon className="w-4.5 h-4.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl hover:shadow-violet-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all focus:outline-none"
        aria-label="Quick Actions"
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </button>
    </div>
  );
};
