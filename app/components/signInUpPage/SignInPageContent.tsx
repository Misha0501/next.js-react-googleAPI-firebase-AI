"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { useUpdateUser } from "@/providers/Users";
import { useAuthContext } from "@/app/context/AuthContext";
import logo from "@/public/homfli-logo.svg";
import homeImage from "@/public/header-hero.jpg";
import {
  BuildingOffice2Icon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function SignInPageContent() {
  const loading = useRef<HTMLDivElement>(null);
  const updateUser = useUpdateUser({});
  const updateUserRef = useRef(updateUser);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    updateUserRef.current = updateUser;
  }, [updateUser]);

  useEffect(() => {
    if (user) {
      router.replace("/profile/myAccount");
    }
  }, [router, user]);

  useEffect(() => {
    let ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseClientAuth);

    ui.start("#firebaseui", {
      signInFlow: "popup",
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
          updateUserRef.current
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
    <section className="signin-page bg-[#f6f8fb]">
      <div className="container flex min-h-[calc(100vh-98px)] items-center py-12 lg:py-16">
        <div className="grid w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden min-h-[660px] overflow-hidden lg:block">
            <Image
              src={homeImage}
              alt="Warm home interior"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
            <div className="absolute inset-x-0 bottom-0 p-10 text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                <ShieldCheckIcon className="h-5 w-5" />
                Secure account access
              </div>
              <p className="max-w-md text-4xl font-semibold leading-tight">
                Return to your property workspace.
              </p>
              <p className="mt-4 max-w-md text-base leading-7 text-white/80">
                Sign in to continue saving homes, managing listings, and
                working with your property activity in one place.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold">100+</p>
                  <p className="mt-1 text-sm text-white/75">listed homes</p>
                </div>
                <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold">24/7</p>
                  <p className="mt-1 text-sm text-white/75">account access</p>
                </div>
                <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold">EU</p>
                  <p className="mt-1 text-sm text-white/75">Euro pricing</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center px-5 py-10 sm:px-8 md:px-12 lg:px-14">
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-10">
                <Image
                  className="mb-10 h-6 w-auto"
                  width={111}
                  height={19}
                  src={logo}
                  alt="Homfli logo"
                />
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-[#1F5FD6]">
                  <BuildingOffice2Icon className="h-4 w-4" />
                  Real estate account
                </div>
                <h1 className="text-[34px] font-semibold leading-tight tracking-normal text-slate-950 md:text-[42px]">
                  Sign in to Homfli
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Access saved properties, listing tools, and your profile with
                  a secure email or Google sign-in.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-6">
                <div id="firebaseui" className="firebaseui"></div>
                <div
                  ref={loading}
                  className="flex min-h-[160px] items-center justify-center text-sm font-medium text-slate-500"
                >
                  Loading secure sign-in...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
