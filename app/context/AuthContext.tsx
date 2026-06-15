"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { setCookie } from "cookies-next";
import { onAuthStateChanged, type User } from "firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";

interface ContextProps {
  authToken: string | null;
  user: User | null;
}

export const AuthContext = createContext<ContextProps>({
  authToken: null,
  user: null,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseClientAuth, async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        setAuthToken(token);
        setCookie("authToken", token);
      } else {
        setUser(null);
        setAuthToken(null);
        setCookie("authToken", "");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, authToken }}>
      {children}
    </AuthContext.Provider>
  );
};
