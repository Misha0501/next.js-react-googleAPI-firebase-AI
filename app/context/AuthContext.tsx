"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { setCookie } from "cookies-next";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import PageLoader from "next/dist/client/page-loader";
import { Box, CircularProgress } from "@mui/material";

export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, authToken }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <>
            <CircularProgress />
          </>
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
