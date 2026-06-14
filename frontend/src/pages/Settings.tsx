import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import api from "../utils/api";
import { Settings as SettingsIcon, Bell, Shield, Key, Share2, Sun, Moon } from "lucide-react";

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Settings states (persisted in localStorage for visual persistence)
  const [notifications, setNotifications] = useState(() => {
    const val = localStorage.getItem("es_notifications");
    return val ? JSON.parse(val) : {
      emailAlerts: true,
      mockGrader: true,
      oppsMatches: true,
      blockchainConfirms: false,
      whatsAppAlerts: true
    };
  });

  const [privacy, setPrivacy] = useState(() => {
    const val = localStorage.getItem("es_privacy");
    return val ? JSON.parse(val) : {
      publicRadar: true,
      shareLogs: false
    };
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("es_apikey") || "sk_live_eaglesync_49c2a7f80b1";
  });
  
  const [showKey, setShowKey] = useState(false);

  // Change password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveSettings = () => {
    localStorage.setItem("es_notifications", JSON.stringify(notifications));
    localStorage.setItem("es_privacy", JSON.stringify(privacy));
    localStorage.setItem("es_apikey", apiKey);
    toast("Settings and preferences saved successfully!", "success");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast("New password must be at least 6 characters long", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Confirm password does not match new password", "error");
      return;
    }

    try {
      const res = await api.post("/users/change-password", {
        currentPassword,
        newPassword
      });
      toast(res.data.message || "Password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      toast(err.response?.data?.error || "Error changing password", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl text-left flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold mb-1.5 tracking-tight">System Settings</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Configure notifications, security credentials, developer tokens, and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Theme and Preferences */}
        <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col gap-5">
          <h3 className="font-extrabold text-base border-b border-border/40 pb-2 flex items-center gap-2">
            <Sun className="w-5 h-5 text-violet-500" />
            <span>Aesthetics Theme</span>
          </h3>

          <div className="flex items-center justify-between text-xs font-semibold">
            <div>
              <p className="text-foreground">Toggle Interface Theme</p>
              <p className="text-muted-foreground text-[10px] font-medium">Switch between Light and Dark aesthetics</p>
            </div>
            
            <button
              onClick={toggleTheme}
              className="px-4 py-2.5 rounded-xl border border-border/85 hover:bg-secondary/40 flex items-center gap-1.5 transition-colors font-bold"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-violet-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Connected Accounts */}
        <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col gap-5">
          <h3 className="font-extrabold text-base border-b border-border/40 pb-2 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-violet-500" />
            <span>Connected Integrations</span>
          </h3>

          <div className="flex flex-col gap-3">
            {[
              { provider: "GitHub", desc: "For codebase AST scanning", connected: true },
              { provider: "LinkedIn", desc: "For placement exports", connected: false },
              { provider: "Coursera", desc: "For verified credentials sync", connected: false }
            ].map((conn) => (
              <div key={conn.provider} className="flex justify-between items-center text-xs font-semibold">
                <div>
                  <p className="text-foreground">{conn.provider}</p>
                  <p className="text-muted-foreground text-[10px] font-medium">{conn.desc}</p>
                </div>
                <button
                  onClick={() => {
                    toast(
                      conn.connected
                        ? `Disconnecting ${conn.provider} (simulation)...`
                        : `Connecting ${conn.provider} (simulation)...`,
                      "info"
                    );
                  }}
                  className={`px-4.5 py-2 rounded-xl text-[10px] font-extrabold border transition-all ${
                    conn.connected
                      ? "bg-secondary/40 border-border/80 text-foreground"
                      : "bg-violet-600 border-transparent text-white hover:bg-violet-500"
                  }`}
                >
                  {conn.connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Notification Preferences */}
        <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col gap-5">
          <h3 className="font-extrabold text-base border-b border-border/40 pb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-violet-500" />
            <span>Notification Triggers</span>
          </h3>

          <div className="space-y-4">
            {[
              { id: "emailAlerts", label: "Weekly Career Progress Emails", desc: "Summarize mock grades and roadmap steps completed." },
              { id: "mockGrader", label: "Mock Interview Grade Bulletins", desc: "Receive immediate notifications once LLM completes assessments." },
              { id: "oppsMatches", label: "Opportunity Matching Recommendations", desc: "Get alerts when your radar reaches benchmark listings." },
              { id: "whatsAppAlerts", label: "WhatsApp Progress Updates", desc: "Dispatch real-time progress bulletins via WhatsApp when career stats update." },
              { id: "blockchainConfirms", label: "EaglePass Blockchain confirmations", desc: "Receive ledger logs alerts." }
            ].map((notif) => (
              <label key={notif.id} className="flex items-start gap-3.5 cursor-pointer text-xs font-semibold text-left">
                <input
                  type="checkbox"
                  checked={(notifications as any)[notif.id]}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      [notif.id]: !(notifications as any)[notif.id]
                    })
                  }
                  className="w-4 h-4 rounded border-border/80 text-violet-600 focus:ring-violet-500 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-foreground font-bold">{notif.label}</p>
                  <p className="text-muted-foreground text-[10px] font-medium leading-relaxed mt-0.5">{notif.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 4. Privacy & Consent */}
        <div className="glass p-6 rounded-3xl border border-border/60 flex flex-col gap-5">
          <h3 className="font-extrabold text-base border-b border-border/40 pb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-500" />
            <span>Privacy & Recruiter Access</span>
          </h3>

          <div className="space-y-4">
            {[
              { id: "publicRadar", label: "Public Capability Radar Dashboard", desc: "Allow partner recruiters to search and view your AST code ratings." },
              { id: "shareLogs", label: "Share Mock Interview Feedback logs", desc: "Share interview transcripts and grades directly with companies." }
            ].map((priv) => (
              <label key={priv.id} className="flex items-start gap-3.5 cursor-pointer text-xs font-semibold text-left">
                <input
                  type="checkbox"
                  checked={(privacy as any)[priv.id]}
                  onChange={() =>
                    setPrivacy({
                      ...privacy,
                      [priv.id]: !(privacy as any)[priv.id]
                    })
                  }
                  className="w-4 h-4 rounded border-border/80 text-violet-600 focus:ring-violet-500 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-foreground font-bold">{priv.label}</p>
                  <p className="text-muted-foreground text-[10px] font-medium leading-relaxed mt-0.5">{priv.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 5. Update Password */}
        <div className="glass p-6 rounded-3xl border border-border/60 md:col-span-2 flex flex-col gap-5">
          <h3 className="font-extrabold text-base border-b border-border/40 pb-2 flex items-center gap-2">
            <Key className="w-5 h-5 text-violet-500" />
            <span>Change Account Password</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-background border border-border/85 rounded-2xl px-4 py-3 outline-none focus:border-violet-500 transition-colors font-mono"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-background border border-border/85 rounded-2xl px-4 py-3 outline-none focus:border-violet-500 transition-colors font-mono"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-muted-foreground">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-background border border-border/85 rounded-2xl px-4 py-3 outline-none focus:border-violet-500 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow-md shadow-violet-500/10 text-xs self-start"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* 6. Developer API Keys */}
        <div className="glass p-6 rounded-3xl border border-border/60 md:col-span-2 flex flex-col gap-5">
          <h3 className="font-extrabold text-base border-b border-border/40 pb-2 flex items-center gap-2">
            <Key className="w-5 h-5 text-violet-500" />
            <span>Developer API Keys</span>
          </h3>

          <div className="flex flex-col gap-3 text-xs font-semibold">
            <label className="text-muted-foreground">Main API Access Token</label>
            <div className="flex gap-2.5">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 bg-background border border-border/85 rounded-2xl px-4 py-3 outline-none focus:border-violet-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="px-4.5 py-3 rounded-2xl border border-border/80 hover:bg-secondary/40 font-bold"
              >
                {showKey ? "Hide" : "Reveal"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Submit */}
      <button
        onClick={handleSaveSettings}
        className="w-full sm:w-auto self-end px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-lg shadow-violet-500/10 mt-4"
      >
        Save Preference Settings
      </button>
    </div>
  );
};
