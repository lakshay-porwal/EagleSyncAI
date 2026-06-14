import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, Menu, X, Cpu, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative grid-pattern bg-background text-foreground transition-colors duration-300">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass border-b border-border/40 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              EagleSync<span className="text-violet-600 dark:text-violet-400">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border/40 hover:bg-secondary/40 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/10 transition-all flex items-center gap-1 group"
                >
                  Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/10 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border/40 hover:bg-secondary/40 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-border/40 hover:bg-secondary/40 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-16 left-0 w-full z-30 glass border-b border-border/80 p-5 flex flex-col gap-4 shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium hover:text-violet-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border/40 my-2" />
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-violet-600 text-white font-semibold shadow-lg shadow-violet-500/20"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full text-center py-2.5 rounded-xl border border-border/40 hover:bg-secondary/40 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-border/40 hover:bg-secondary/40 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-violet-600 text-white font-semibold shadow-lg shadow-violet-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full glass border-t border-border/40 pt-12 pb-8 mt-auto backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-lg tracking-tight">
                  EagleSync<span className="text-violet-600 dark:text-violet-400">AI</span>
                </span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm mb-4">
                Autonomous Career Intelligence Platform. See Further. Learn Smarter. Grow Faster.
              </p>
              <div className="text-xs text-muted-foreground">
                Built with next-gen autonomous systems.
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">AI Agents</Link></li>
                <li><Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">EaglePass Verified</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Support</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Security Details</a></li>
              </ul>
            </div>
          </div>

          <div className="h-px bg-border/40 w-full mb-6" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <span>© 2026 EagleSyncAI. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
