"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { setCookie } from "cookies-next";
import { onIdTokenChanged, type User } from "firebase/auth";
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
    const unsubscribe = onIdTokenChanged(firebaseClientAuth, async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        setAuthToken(token);
        setCookie("authToken", token, {
          maxAge: 60 * 60, // 1 hour — matches Firebase token expiry
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
      } else {
        setUser(null);
        setAuthToken(null);
        setCookie("authToken", "", { maxAge: 0 });
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
