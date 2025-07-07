'use client';
import React, { createContext, useContext, useState, useEffect } from "react";

const ADMIN_PASSWORD = "admin"; // Hardcoded password for demo

interface AdminAuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    }
  }, []);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setError(null);
      if (typeof window !== "undefined") {
        localStorage.setItem("isAdmin", "true");
      }
      return true;
    } else {
      setError("Incorrect password. Try again!");
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setError(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAdmin");
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
} 