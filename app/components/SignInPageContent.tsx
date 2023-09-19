"use client";
// import "firebaseui/dist/firebaseui.css";
import { useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";

export default function SignInPageContent() {

  // UI instance for login / signup
  const loading = useRef(null);

  useEffect(() => {
    let ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseClientAuth);

    ui.start("#firebaseui", {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: `${process.env.VERSEL_URL || process.env.NEXT_PUBLIC_VERSEL_URL || process.env.NEXT_PUBLIC_SITE_URL}/profile/myProperties`,
      // Other config options...
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          return true;
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          if (!loading || !loading.current) return;

          loading.current.style.display = "none";

        }
      }
    });
  }, []);

  return (
    <>
      <h1 className="text-5xl flex justify-center mb-5">Login</h1>
      <div id="firebaseui" className="firebaseui"></div>
      <div ref={loading}>Loading...</div>
    </>
  );
}
