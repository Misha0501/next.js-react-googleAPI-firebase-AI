"use client";
import { useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { useUpdateUser } from "@/providers/Users";

export default function SignInPageContent() {
  // UI instance for login / signup
  const loading = useRef<HTMLDivElement>(null);
  const updateUser = useUpdateUser({});

  useEffect(() => {
    let ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseClientAuth);

    ui.start("#firebaseui", {
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      signInSuccessUrl: `/profile/myAccount`,
      // Other config options...
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          const displayName = authResult.user.displayName;
          const authToken = authResult.user.accessToken;
          // Update user profile
          updateUser
            .mutateAsync({ displayName, authToken })
            .catch(console.error);
          return true;
        },
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          if (!loading || !loading.current) return;

          loading.current.style.display = "none";
        },
      },
    });
  }, []);

  return (
    <>
      <div className="py-12">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl flex justify-center mb-6 text-gray-600">Sign-in/up</h1>
            <div className={"text-l text-gray-500"}>Use one of the following methods to login or register</div>
          </div>
          <div id="firebaseui" className="firebaseui"></div>
          <div ref={loading}>Loading...</div>
        </div>
      </div>
    </>
  );
}
