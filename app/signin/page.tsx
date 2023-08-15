'use client'
import 'firebaseui/dist/firebaseui.css'
import {ui} from "@/app/lib/firebase/configClient";
import {useEffect, useRef} from "react";
import firebase from 'firebase/compat/app';

export default function FirebaseUi() {
    const loading = useRef(null);

    useEffect(() => {
        ui.start('#firebaseui', {
            signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
            signInSuccessUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/server`,
            // Other config options...
            callbacks: {
                signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    return true;
                },
                uiShown: function () {
                    // The widget is rendered.
                    // Hide the loader.
                    if (!loading || !loading.current) return;

                    loading.current.style.display = 'none';

                }
            },
        });
    }, [ui]);

    return (
        <>
            <h1 className="text-5xl flex justify-center mb-5">Login page</h1>
            <div id="firebaseui" className="firebaseui"></div>
            <div ref={loading}>Loading...</div>
        </>
    )
}
