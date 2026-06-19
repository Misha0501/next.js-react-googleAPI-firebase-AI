"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { getFirebaseErrorMessage } from "@/app/lib/firebase/getFirebaseErrorMessage";
import logo from "@/public/homfli-logo.svg";
import { Button } from "@/app/components/shared/Button";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const ForgotPasswordPageContent = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(firebaseClientAuth, email, {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        // Don't reveal whether an account exists for this email.
        setIsSubmitted(true);
      } else {
        setError(getFirebaseErrorMessage(err.code));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="signin-page bg-[#f6f8fb]">
      <div className="mx-auto flex min-h-[calc(100vh-98px)] w-full max-w-screen-sm items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:p-8">
          <Image
            className="mb-10 h-6 w-auto"
            width={111}
            height={19}
            src={logo}
            alt="Homfli logo"
          />

          {!isSubmitted ? (
            <>
              <h1 className="text-2xl font-semibold text-slate-950">
                Reset your password
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter the email address linked to your account and we&apos;ll
                send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
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

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  loading={isLoading}
                  fullWidth
                  className="rounded-lg"
                >
                  {isLoading ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-slate-950">
                Check your email
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                If an account exists for{" "}
                <span className="font-medium text-slate-900">{email}</span>,
                we&apos;ve sent a link to reset your password. Check your
                inbox and spam folder.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-6 text-sm font-medium text-[#1F5FD6] hover:underline"
              >
                Try a different email
              </button>
            </>
          )}

          <Link
            href="/signin"
            className="mt-8 block text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPageContent;
