// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import {connectAuthEmulator, getAuth} from "firebase/auth";
// import * as firebaseui from 'firebaseui';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export let firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const firebaseClientAuth = getAuth(firebaseApp);

const getFirebaseEmulatorURL = () => {
    if(process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST) return process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
    throw new Error("provide FIREBASE_AUTH_EMULATOR_HOST variable in the development env")
}

if (process.env.NODE_ENV === 'development') {
    // Use emulator if developing
    connectAuthEmulator(firebaseClientAuth, getFirebaseEmulatorURL());
}
