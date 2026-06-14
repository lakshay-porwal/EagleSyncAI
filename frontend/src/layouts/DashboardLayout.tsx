import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import {
  LayoutDashboard,
  BrainCircuit,
  Briefcase,
  GitFork,
  MessageSquare,
  Award,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Settings,
  Shield,
  TrendingUp,
  Cpu,
  Bookmark,
  Menu,
  CheckCircle,
  FileCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!isAuthenticated) {
      toast("Please log in to access the dashboard", "info");
      navigate("/login");
    } else if (user && !user.onboardingComplete) {
      navigate("/onboarding");
    }
  }, [isAuthenticated, user, navigate, toast]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Cpu className="w-12 h-12 text-violet-500 animate-spin" />
          <p className="text-muted-foreground font-medium">Authenticating session...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Capability Analysis", path: "/dashboard/capability", icon: BrainCircuit },
    { name: "Careers", path: "/dashboard/careers", icon: Briefcase },
    { name: "Roadmap", path: "/dashboard/roadmap", icon: GitFork },
    { name: "Interview Hub", path: "/dashboard/interview", icon: Shield },
    { name: "Opportunities", path: "/dashboard/opportunities", icon: Bookmark },
    { name: "Progress Tracker", path: "/dashboard/progress", icon: TrendingUp },
    { name: "AI Mentor Chat", path: "/dashboard/chat", icon: MessageSquare },
    { name: "EaglePass Module", path: "/dashboard/eaglepass", icon: Award },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const mockNotifications = [
    { id: "1", text: "AI Analysis: Your skill match for Frontend Developer is now 82%", time: "10m ago", read: false },
    { id: "2", text: "EaglePass: Stanford Certificate verified on blockchain!", time: "2h ago", read: true },
    { id: "3", text: "AI Mentor: New mock interview feedback is ready", time: "1d ago", read: true },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#0b0e14] text-foreground transition-colors duration-300 flex relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel (Desktop & Mobile) */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen border-r border-border/40 bg-white/70 dark:bg-[#0f131a]/70 backdrop-blur-xl transition-all duration-300 flex flex-col ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border/40">
          <Link to="/dashboard" className="flex items-center gap-2 group overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
              <Cpu className="w-4.5 h-4.5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/85 whitespace-nowrap">
                EagleSync<span className="text-violet-600 dark:text-violet-400">AI</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg border border-border/40 hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all relative ${
                  isActive
                    ? "text-violet-600 dark:text-violet-400 bg-violet-50/80 dark:bg-violet-950/20 shadow-sm border border-violet-100/40 dark:border-violet-950/40"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-violet-600 dark:text-violet-400" : ""}`} />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Sign Out Footer */}
        <div className="p-4 border-t border-border/40">
          <div className="flex items-center justify-between gap-3 overflow-hidden">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md">
                {user.name.charAt(0)}
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  toast("Logged out successfully", "success");
                }}
                className="p-2 text-muted-foreground hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0"
                title="Log Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border/40 bg-white/70 dark:bg-[#0f131a]/70 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-xl border border-border/40 hover:bg-secondary/60 text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search/Command Palette Trigger */}
            <button
              id="cmd-palette-trigger"
              className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-border/40 hover:bg-secondary/40 text-muted-foreground hover:text-foreground text-sm font-medium transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Search platform...</span>
              <span className="text-xs bg-muted border border-border/40 px-1.5 py-0.5 rounded-md font-mono font-semibold">Ctrl+K</span>
            </button>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Dark/Light mode */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-border/40 hover:bg-secondary/60 transition-all text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
                className="p-2.5 rounded-xl border border-border/40 hover:bg-secondary/60 transition-all text-muted-foreground hover:text-foreground relative"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-80 z-50 glass-premium border-border/80 rounded-2xl shadow-xl p-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
                        <span className="font-bold text-sm">Notifications</span>
                        <span className="text-xs text-violet-500 font-semibold cursor-pointer">Mark all read</span>
                      </div>
                      <div className="space-y-3">
                        {mockNotifications.map((notif) => (
                          <div key={notif.id} className="text-xs flex flex-col gap-1 hover:bg-secondary/30 p-2 rounded-lg transition-colors cursor-pointer">
                            <div className="flex items-center gap-1.5">
                              {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />}
                              <p className="font-semibold text-foreground">{notif.text}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground pl-3">{notif.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="w-10 h-10 rounded-xl bg-violet-600 text-white font-bold flex items-center justify-center border-2 border-transparent hover:border-violet-500/50 transition-all shadow-md"
              >
                {user.name.charAt(0)}
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-56 z-50 glass-premium border-border/80 rounded-2xl shadow-xl py-2"
                    >
                      <div className="px-4 py-3 border-b border-border/40 mb-2">
                        <p className="text-sm font-bold truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className="h-px bg-border/40 my-2" />
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate("/");
                          toast("Logged out successfully", "success");
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
