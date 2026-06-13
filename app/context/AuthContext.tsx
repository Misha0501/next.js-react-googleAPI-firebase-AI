"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";

interface ContextProps {
  authToken: string | null;
  user: any;
}

export const AuthContext = createContext<ContextProps>({
  authToken: null,
  user: null,
});

export const useAuthContext = () => useContext(AuthContext);

// @ts-ignore
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null);
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
