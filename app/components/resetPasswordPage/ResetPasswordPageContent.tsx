"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { firebaseClientAuth } from "@/app/lib/firebase/configClient";
import { getFirebaseErrorMessage } from "@/app/lib/firebase/getFirebaseErrorMessage";
import logo from "@/public/homfli-logo.svg";
import { Button } from "@/app/components/shared/Button";

type CodeState = "verifying" | "valid" | "invalid";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const ResetPasswordPageContent = () => {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [codeState, setCodeState] = useState<CodeState>(
    oobCode ? "verifying" : "invalid",
  );
  const [codeError, setCodeError] = useState<string | null>(
    oobCode
      ? null
      : "This reset link is missing or malformed. Please request a new one.",
  );
  const [email, setEmail] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!oobCode) return;

    verifyPasswordResetCode(firebaseClientAuth, oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setCodeState("valid");
      })
      .catch((err: any) => {
        setCodeError(getFirebaseErrorMessage(err.code));
        setCodeState("invalid");
      });
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!oobCode) return;

    setError(null);
    setIsLoading(true);
    try {
      await confirmPasswordReset(firebaseClientAuth, oobCode, password);
      setIsComplete(true);
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
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

          {codeState === "verifying" && (
            <p className="text-sm text-slate-600">
              Verifying your reset link…
            </p>
          )}

          {codeState === "invalid" && (
            <>
              <h1 className="text-2xl font-semibold text-slate-950">
                Link expired or invalid
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {codeError}
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 inline-block text-sm font-medium text-[#1F5FD6] hover:underline"
              >
                Request a new reset link
              </Link>
            </>
          )}

          {codeState === "valid" && !isComplete && (
            <>
              <h1 className="text-2xl font-semibold text-slate-950">
                Set a new password
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {email
                  ? `Choose a new password for ${email}.`
                  : "Choose a new password for your account."}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    New password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
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
                  <label
                    htmlFor="confirmNewPassword"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Confirm new password
                  </label>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
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
                  {isLoading ? "Updating password…" : "Update password"}
                </Button>
              </form>
            </>
          )}

          {isComplete && (
            <>
              <h1 className="text-2xl font-semibold text-slate-950">
                Password updated
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Your password has been changed. You can now sign in with your
                new password.
              </p>
              <Link
                href="/signin"
                className="mt-6 inline-block rounded-lg bg-[#1F5FD6] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#184FB5]"
              >
                Go to sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPageContent;
