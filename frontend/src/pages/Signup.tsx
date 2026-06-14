import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Mail, Lock, Cpu, ArrowRight, User } from "lucide-react";

export const Signup: React.FC = () => {
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast("Please fill out all fields", "error");
      return;
    }
    if (password.length < 6) {
      toast("Password must be at least 6 characters", "error");
      return;
    }
    if (password !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(name, email, password);
      if (success) {
        toast("Account created successfully! Welcome to EagleSyncAI.", "success");
        navigate("/dashboard");
      } else {
        toast("Registration failed", "error");
      }
    } catch {
      toast("Registration failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 relative">
      <div className="w-full max-w-md glass-premium border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mb-3">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">Create your account</h2>
          <p className="text-muted-foreground text-xs font-semibold mt-1">
            Accelerate your software engineering career today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="w-full bg-background/50 border border-border/85 rounded-2xl pl-10 pr-4 py-3.5 text-sm outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

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
            <label className="text-xs font-bold text-muted-foreground">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="•••••••• (Min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-background/50 border border-border/85 rounded-2xl pl-10 pr-4 py-3.5 text-sm outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-muted-foreground">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? "Creating Account..." : "Create Account"}
            {!isLoading && <ArrowRight className="w-4.5 h-4.5" />}
          </button>
        </form>

        {/* Redirection Link */}
        <div className="text-center text-xs font-semibold text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-500 hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
