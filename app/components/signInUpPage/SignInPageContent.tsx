"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { useUpdateUser } from "@/providers/Users";
import { useAuthContext } from "@/app/context/AuthContext";
import logo from "@/public/homfli-logo.svg";
import homeImage from "@/public/header-hero.jpg";
import { BuildingOffice2Icon, ShieldCheckIcon } from "@heroicons/react/24/outline";

type Mode = "signin" | "signup";

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/popup-blocked":
      return "Pop-up was blocked by your browser. Please allow pop-ups for this site.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in method.";
    case "auth/requires-recent-login":
      return "Please sign in again to continue.";
    default:
      return "Something went wrong. Please try again.";
  }
}

async function registerInDatabase(params: {
  email: string;
  displayName: string;
  providerId: string;
  firebaseUID: string;
}) {
  await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}

export default function SignInPageContent() {
  const updateUser = useUpdateUser({});
  const updateUserRef = useRef(updateUser);
  const { user } = useAuthContext();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    updateUserRef.current = updateUser;
  }, [updateUser]);

  useEffect(() => {
    if (user) router.replace("/profile/myAccount");
  }, [router, user]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signInWithPopup(firebaseClientAuth, new GoogleAuthProvider());
      const fbUser = result.user;
      const token = await fbUser.getIdToken();
      const additionalUserInfo = getAdditionalUserInfo(result);

      if (additionalUserInfo?.isNewUser) {
        await registerInDatabase({
          email: fbUser.email ?? "",
          displayName: fbUser.displayName ?? "",
          providerId: fbUser.providerData[0]?.providerId ?? "google.com",
          firebaseUID: fbUser.uid,
        });
      } else if (fbUser.displayName) {
        await updateUserRef.current
          .mutateAsync({ displayName: fbUser.displayName, authToken: token })
          .catch(console.error);
      }

      router.replace("/profile/myAccount");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setError(getFirebaseErrorMessage(err.code));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(firebaseClientAuth, email, password);
      const token = await result.user.getIdToken();
      if (result.user.displayName) {
        await updateUserRef.current
          .mutateAsync({ displayName: result.user.displayName, authToken: token })
          .catch(console.error);
      }
      router.replace("/profile/myAccount");
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(firebaseClientAuth, email, password);
      const fbUser = result.user;

      await registerInDatabase({
        email: fbUser.email ?? "",
        displayName: displayName.trim() || (fbUser.email ?? "").split("@")[0],
        providerId: "password",
        firebaseUID: fbUser.uid,
      });

      router.replace("/profile/myAccount");
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <section className="signin-page bg-[#f6f8fb]">
      <div className="container flex min-h-[calc(100vh-98px)] items-center py-12 lg:py-16">
        <div className="grid w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left panel */}
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
                {mode === "signin"
                  ? "Return to your property workspace."
                  : "Start your property journey."}
              </p>
              <p className="mt-4 max-w-md text-base leading-7 text-white/80">
                {mode === "signin"
                  ? "Sign in to continue saving homes, managing listings, and working with your property activity in one place."
                  : "Create a free account to save properties, place listings, and manage your real estate activity."}
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

          {/* Right panel */}
          <div className="flex items-center px-5 py-10 sm:px-8 md:px-12 lg:px-14">
            <div className="mx-auto w-full max-w-[440px]">
              <div className="mb-8">
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
                  {mode === "signin" ? "Sign in to Homfli" : "Create an account"}
                </h1>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {mode === "signin"
                    ? "Access saved properties, listing tools, and your profile."
                    : "Join Homfli to place listings, save homes, and more."}
                </p>
              </div>

              {/* Mode toggle */}
              <div className="mb-6 flex rounded-lg border border-slate-200 p-1">
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    mode === "signin"
                      ? "bg-[#1F5FD6] text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    mode === "signup"
                      ? "bg-[#1F5FD6] text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Create account
                </button>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:p-6">
                {mode === "signin" ? (
                  <form id="sign-in-form" onSubmit={handleEmailSignIn} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className={inputClass}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className={inputClass}
                        placeholder="••••••••"
                      />
                    </div>

                    {error && (
                      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-lg bg-[#1F5FD6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? "Signing in…" : "Sign in"}
                    </button>
                  </form>
                ) : (
                  <form id="sign-up-form" onSubmit={handleEmailSignUp} className="space-y-4">
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Full name
                      </label>
                      <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        autoComplete="name"
                        className={inputClass}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email address
                      </label>
                      <input
                        id="signup-email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className={inputClass}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Password
                      </label>
                      <input
                        id="signup-password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className={inputClass}
                        placeholder="At least 6 characters"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Confirm password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className={inputClass}
                        placeholder="••••••••"
                      />
                    </div>

                    {error && (
                      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full rounded-lg bg-[#1F5FD6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? "Creating account…" : "Create account"}
                    </button>
                  </form>
                )}

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 uppercase tracking-wide text-slate-400">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  id="google-sign-in"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
