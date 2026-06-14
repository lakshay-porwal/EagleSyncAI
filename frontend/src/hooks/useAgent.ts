import { useState, useCallback } from "react";
import axios from "axios";

type AgentState = "idle" | "starting" | "running" | "complete" | "error";

export const useAgent = () => {
  const [state, setState] = useState<AgentState>("idle");
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (endpoint: string, body?: object) => {
    setState("starting");
    setError(null);

    try {
      setState("running");
      const token = localStorage.getItem("eaglesync_token");
      const res = await axios.post(`/api/agents/${endpoint}`, body || {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 120000, // 2 min timeout for agent runs
      });
      setState("complete");
      return res.data;
    } catch (err: any) {
      setState("error");
      const msg = err.response?.data?.error || err.message || "Agent failed";
      setError(msg);
      console.error(`Agent ${endpoint} failed:`, msg);
      return null;
    }
  }, []);

  const reset = () => {
    setState("idle");
    setError(null);
  };

  return {
    state,
    error,
    isRunning: state === "running" || state === "starting",
    isComplete: state === "complete",
    isIdle: state === "idle",
    reset,
    runCapability: () => run("capability"),
    runRoadmap: (params?: object) => run("roadmap", params),
    runCareer: (params?: object) => run("career", params),
    runProgress: () => run("progress"),
    sendChat: (message: string) => run("chat", { message }),
  };
};
