import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "../types";
import api from "../utils/api";
import { useToast } from "./ToastContext";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("eaglesync_token");
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Set up response interceptor for 401 unauthorized errors
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, logout user
          localStorage.removeItem("eaglesync_token");
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  // Fetch current user details on mount/token change
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("eaglesync_token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem("eaglesync_token", receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Invalid email or password details";
      toast(msg, "error");
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      localStorage.setItem("eaglesync_token", receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.error || "Registration failed";
      toast(msg, "error");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("eaglesync_token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      const res = await api.put("/users/profile", profile);
      setUser(res.data.user);
    } catch (err: any) {
      const msg = err.response?.data?.error || "Failed to update profile";
      toast(msg, "error");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

