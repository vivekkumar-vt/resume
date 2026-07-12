"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSession, setSession, UserSession, apiRequest, syncLocalResumesWithBackend } from "../utils/api";

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<UserSession>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      setSession(response);
      setUser(response);
      
      // Auto-migrate guest resumes to backend if any exist
      await syncLocalResumesWithBackend();
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<UserSession>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
      });
      
      setSession(response);
      setUser(response);

      // Auto-migrate guest resumes to backend if any exist
      await syncLocalResumesWithBackend();
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
