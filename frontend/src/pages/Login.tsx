import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Mail, Lock, Cpu, ArrowRight } from "lucide-react";

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Please enter your email and password", "error");
      return;
    }
    if (password.length < 6) {
      toast("Password must be at least 6 characters", "error");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast("Welcome back!", "success");
        navigate("/dashboard");
      } else {
        toast("Invalid credentials details", "error");
      }
    } catch {
      toast("Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 relative">
      <div className="w-full max-w-md glass-premium border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Brand logo header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-3">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">Welcome back</h2>
          <p className="text-muted-foreground text-xs font-semibold mt-1">
            Access your AI career intelligence platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="alex.mercer@stanford.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-background/50 border border-border/85 rounded-2xl pl-10 pr-4 py-3.5 text-sm outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-muted-foreground">Password</label>
              <button
                type="button"
                onClick={() => toast("Password reset email sent (simulation)", "info")}
                className="text-[10px] text-violet-500 hover:underline font-bold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-background/50 border border-border/85 rounded-2xl pl-10 pr-4 py-3.5 text-sm outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2"
          >
            {isLoading ? "Signing In..." : "Sign In"}
            {!isLoading && <ArrowRight className="w-4.5 h-4.5" />}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <div className="h-px bg-border/40 flex-1" />
          <span className="px-3 uppercase text-[10px]">Or Continue With</span>
          <div className="h-px bg-border/40 flex-1" />
        </div>

        {/* Social Oauth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => {
              toast("Connecting to GitHub OAuth (simulation)...", "info");
              setTimeout(() => {
                login("github@eaglesync.ai", "dummy_pass");
                toast("Logged in via GitHub", "success");
                navigate("/dashboard");
              }, 1000);
            }}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-border/80 hover:bg-secondary/40 font-bold text-xs transition-colors"
          >
            <span>GitHub</span>
          </button>
          <button
            onClick={() => {
              toast("Connecting to Google OAuth (simulation)...", "info");
              setTimeout(() => {
                login("google@eaglesync.ai", "dummy_pass");
                toast("Logged in via Google", "success");
                navigate("/dashboard");
              }, 1000);
            }}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-border/80 hover:bg-secondary/40 font-bold text-xs transition-colors"
          >
            <span>Google</span>
          </button>
        </div>

        {/* Signup redirection link */}
        <div className="text-center text-xs font-semibold text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-violet-500 hover:underline font-bold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
