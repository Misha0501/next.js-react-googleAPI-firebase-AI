"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CurrentUserDto } from "@/app/lib/auth/session";
import { SESSION_EXPIRED_EVENT } from "@/app/lib/auth/notifySessionExpired";

interface ContextProps {
  user: CurrentUserDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<ContextProps>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
  logout: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      const data = await response.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) setUser(data.user ?? null);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => setUser(null);

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () =>
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
