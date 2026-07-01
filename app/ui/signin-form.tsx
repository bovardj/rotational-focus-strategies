"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs/legacy";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  AtSymbolIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { useState } from "react";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOnMessage, setCapsLockOnMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");

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
    setFormError("");
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/dashboard");
      } else {
        setFormError("Sign in could not be completed. Please try again.");
      }
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
  };

  return (
    <form className="space-y-3" onSubmit={(e) => handleSubmit(e)}>
      <h1 className={`${lusitana.className} mb-4 text-2xl font-bold text-gray-900`}>Sign in</h1>
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
              type="text"
              inputMode="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email address"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
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
            Password
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 placeholder:text-gray-600"
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Enter password"
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
        </div>
      </div>
      <div role="alert" aria-live="assertive" className="text-sm text-red-800">
        {formError}
      </div>
      <Button className="mt-4 w-full">
        Sign in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" aria-hidden="true" />
      </Button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="rounded-sm font-medium text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2">
            Sign up
          </Link>
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Forgot your password?{" "}
          <Link href="/forgot-password" className="rounded-sm font-medium text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2">
            Reset password
          </Link>
        </p>
      </div>
    </form>
  );
}
