import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { AgentStep } from "../types";

export const useSocket = (token: string | null) => {
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(window.location.origin.includes("5173")
      ? "http://localhost:5000"
      : window.location.origin, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connection error:", err.message);
      setConnected(false);
    });

    socket.on("agent_update", (step: AgentStep) => {
      setAgentSteps((prev) => [...prev, step]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const clearSteps = () => setAgentSteps([]);

  return { agentSteps, clearSteps, connected, socket: socketRef.current };
};
