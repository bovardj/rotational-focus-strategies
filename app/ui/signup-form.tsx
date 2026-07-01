"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useSignUp } from "@clerk/nextjs/legacy";
import { useRouter, useSearchParams } from "next/navigation";
import { lusitana } from "@/app/ui/fonts";
import { Button } from "@/app/ui/button";
import {
  ArrowRightIcon,
  AtSymbolIcon,
  ChevronDoubleRightIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOnMessage, setCapsLockOnMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [verifyError, setVerifyError] = useState("");

  const verifyHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (verifying && verifyHeadingRef.current) {
      verifyHeadingRef.current.focus();
    }
  }, [verifying]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;
    setEmailError("");
    setPasswordError("");
    setFormError("");
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ message: string; code: string }> };
      const code = clerkError.errors?.[0]?.code;
      const message = clerkError.errors?.[0]?.message ?? "Something went wrong. Please try again.";
      if (code === "form_identifier_exists") {
        setEmailError("An account with this email already exists.");
      } else if (code === "form_param_format_invalid") {
        setEmailError("Please enter a valid email address.");
      } else if (code === "form_password_pwned") {
        setPasswordError("This password has appeared in a data breach. Please choose a different one.");
      } else if (code === "form_password_too_short" || code === "form_password_size_too_small") {
        setPasswordError("Password must be at least 8 characters.");
      } else {
        setFormError(message);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;
    setVerifyError("");
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push("/dashboard");
      } else {
        setVerifyError("Verification could not be completed. Please try again.");
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ code: string; message: string }> };
      if (clerkErr?.errors?.[0]?.code === "session_exists") {
        router.push("/dashboard");
        return;
      }
      const code = clerkErr.errors?.[0]?.code;
      if (code === "form_code_incorrect") {
        setVerifyError("Incorrect code. Please check your email and try again.");
      } else if (code === "verification_expired") {
        setVerifyError("The verification code has expired. Please go back and try again.");
      } else {
        setVerifyError(clerkErr.errors?.[0]?.message ?? "Something went wrong. Please try again.");
      }
    }
  };

  if (verifying) {
    return (
      <div>
        <h1
          ref={verifyHeadingRef}
          tabIndex={-1}
          className={`${lusitana.className} mb-4 text-2xl font-bold text-gray-900`}
        >
          Verify your email
        </h1>
        <p className="mb-4 text-sm text-gray-700">
          Enter the verification code sent to{" "}
          <span className="font-medium text-gray-900">{emailAddress}</span>.
        </p>
        <form onSubmit={handleVerify}>
          <label
            htmlFor="code"
            className="mb-3 block text-sm font-medium text-gray-900"
          >
            Verification code
          </label>
          <div className="relative">
            <input
              id="code"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="one-time-code"
              className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 placeholder:text-gray-600"
              placeholder="Enter verification code"
            />
            <ChevronDoubleRightIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div role="alert" aria-live="assertive" className="mt-1 text-sm text-red-800">
            {verifyError}
          </div>
          <Button className="mt-4 w-full">
            Verify <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" aria-hidden="true" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h1 className={`${lusitana.className} mb-4 text-2xl font-bold text-gray-900`}>Sign up</h1>
      <div className="w-full">
        <div>
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
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email address"
              value={emailAddress}
              required
              onChange={(e) => setEmailAddress(e.target.value)}
            />
            <AtSymbolIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div role="alert" aria-live="assertive" className="mt-1 text-sm text-red-800">
            {emailError}
          </div>
        </div>
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-sm font-medium text-gray-900"
            htmlFor="password"
          >
            Password{" "}
            <span className="text-xs text-gray-700">(min 8 characters)</span>
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 placeholder:text-gray-600"
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              value={password}
              required
              placeholder="Enter password"
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
        </div>
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <div role="alert" aria-live="assertive" className="text-sm text-red-800">
        {formError}
      </div>
      <Button className="mt-4 w-full">
        Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" aria-hidden="true" />
      </Button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="rounded-sm font-medium text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
