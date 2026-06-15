"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [error, setError] = useState("");

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

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then(() => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <div>
      <form onSubmit={!successfulCreation ? create : reset}>
        <h1 className={`${lusitana.className} mb-4 text-2xl font-bold text-gray-900`}>
          Forgot Password?
        </h1>
        {!successfulCreation && (
          <>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="email"
            >
              Provide your email address
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <AtSymbolIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <Button className="mt-7 w-full">
              Send password reset code{" "}
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" aria-hidden="true" />
            </Button>
            {error && <p className="mt-2 text-sm text-red-800">{error}</p>}
          </>
        )}

        {successfulCreation && (
          <>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="password"
            >
              Enter your new password
            </label>
            <div className="relative">
              <input
                ref={newPasswordRef}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Enter new password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyUp}
              />
              <KeyIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              <button
                type="button"
                onClick={handleClickShowPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-1"
              >
                {showPassword ? (
                  <EyeSlashIcon aria-hidden="true" className="h-[18px] w-[18px]" />
                ) : (
                  <EyeIcon aria-hidden="true" className="h-[18px] w-[18px]" />
                )}
              </button>
              <div aria-live="polite" className="absolute bottom-[-20px] left-0 text-xs text-red-800">
                {capsLockOnMessage}
              </div>
            </div>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="code"
            >
              Enter the password reset code that was sent to your email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
                id="code"
                type="text"
                autoComplete="one-time-code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <ChevronDoubleRightIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <Button className="mt-7 w-full">
              Reset{" "}
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" aria-hidden="true" />
            </Button>
            {error && <p className="mt-2 text-sm text-red-800">{error}</p>}
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
