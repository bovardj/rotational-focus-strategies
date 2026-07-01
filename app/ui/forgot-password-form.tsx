"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSignIn } from "@clerk/nextjs/legacy";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  AtSymbolIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { lusitana } from "./fonts";
import Link from "next/link";

const ForgotPasswordForm: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [codeError, setCodeError] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOnMessage, setCapsLockOnMessage] = useState("");

  const newPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (successfulCreation && newPasswordRef.current) {
      newPasswordRef.current.focus();
    }
  }, [successfulCreation]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const capsLockOn = e.getModifierState("CapsLock");
    if (capsLockOn) {
      setCapsLockOnMessage("Caps Lock is on");
    } else {
      setCapsLockOnMessage("");
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  async function create(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!signIn) return;
    setEmailError("");
    setFormError("");
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setSuccessfulCreation(true);
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; code: string }> };
      const code = clerkError.errors?.[0]?.code;
      if (code === "form_param_format_invalid") {
        setEmailError("Please enter a valid email address.");
      } else if (code === "form_identifier_not_found") {
        setEmailError("No account found with that email address.");
      } else {
        setFormError(clerkError.errors?.[0]?.message ?? "Something went wrong. Please try again.");
      }
    }
  }

  async function reset(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!signIn) return;
    setPasswordError("");
    setCodeError("");
    setFormError("");
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      if (result && result.status === "needs_second_factor") {
        setSecondFactor(true);
      } else if (result && result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setFormError("Reset could not be completed. Please try again.");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; code: string }> };
      const errCode = clerkError.errors?.[0]?.code;
      if (errCode === "form_password_too_short" || errCode === "form_password_size_too_small") {
        setPasswordError("Password must be at least 8 characters.");
      } else if (errCode === "form_password_pwned") {
        setPasswordError("This password has appeared in a data breach. Please choose a different one.");
      } else if (errCode === "form_code_incorrect") {
        setCodeError("Incorrect code. Please check your email and try again.");
      } else if (errCode === "verification_expired") {
        setCodeError("The reset code has expired. Please request a new one.");
      } else {
        setFormError(clerkError.errors?.[0]?.message ?? "Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div>
      <form onSubmit={!successfulCreation ? create : reset}>
        <h1 className={`${lusitana.className} mb-4 text-2xl font-bold text-gray-900`}>
          Forgot password?
        </h1>
        {!successfulCreation && (
          <>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="email"
            >
              Email address
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 placeholder:text-gray-600"
                id="email"
                type="text"
                inputMode="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <AtSymbolIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div role="alert" aria-live="assertive" className="mt-1 text-sm text-red-800">
              {emailError}
            </div>
            <div role="alert" aria-live="assertive" className="mt-1 text-sm text-red-800">
              {formError}
            </div>
            <Button className="mt-4 w-full">
              Send password reset code{" "}
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" aria-hidden="true" />
            </Button>
          </>
        )}

        {successfulCreation && (
          <>
            <p className="mb-4 text-sm text-gray-700">
              Enter the reset code sent to{" "}
              <span className="font-medium text-gray-900">{email}</span>.
            </p>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="password"
            >
              New password{" "}
              <span className="text-xs text-gray-700">(min 8 characters)</span>
            </label>
            <div className="relative">
              <input
                ref={newPasswordRef}
                className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 placeholder:text-gray-600"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Enter new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyUp}
              />
              <KeyIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              <button
                type="button"
                onClick={handleClickShowPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-1"
              >
                {showPassword ? (
                  <EyeSlashIcon aria-hidden="true" className="h-4.5 w-4.5" />
                ) : (
                  <EyeIcon aria-hidden="true" className="h-4.5 w-4.5" />
                )}
              </button>
            </div>
            <div aria-live="polite" className="mt-1 min-h-4 text-xs text-red-800">
              {capsLockOnMessage}
            </div>
            <div role="alert" aria-live="assertive" className="mt-1 text-sm text-red-800">
              {passwordError}
            </div>
            <label
              className="mb-3 mt-4 block text-sm font-medium text-gray-900"
              htmlFor="code"
            >
              Reset code
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 placeholder:text-gray-600"
                id="code"
                type="text"
                autoComplete="one-time-code"
                placeholder="Enter reset code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <ChevronDoubleRightIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div role="alert" aria-live="assertive" className="mt-1 text-sm text-red-800">
              {codeError}
            </div>
            <div role="alert" aria-live="assertive" className="mt-1 text-sm text-red-800">
              {formError}
            </div>
            <Button className="mt-4 w-full">
              Reset password{" "}
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" aria-hidden="true" />
            </Button>
          </>
        )}

        {secondFactor && (
          <p className="mt-2 text-sm text-gray-600">
            2FA is required, but this UI does not handle that
          </p>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-1 rounded-sm"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
