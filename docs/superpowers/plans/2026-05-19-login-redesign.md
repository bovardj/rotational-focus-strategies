# Login Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the sign-in, sign-up, and forgot-password pages into visual consistency with the style guide by fixing card borders, removing redundant nesting, correcting label sizes, styling error messages, fixing the unstyled verification step, and adding the app name above each form.

**Architecture:** Page wrappers own the card shell and app name header; form components render their content directly inside (no inner card div). This separates layout concerns (page) from form content (component). All changes are purely presentational — Clerk logic is untouched.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, Lusitana/Inter fonts, Heroicons, Clerk

---

### Task 1: Update all 3 auth page wrappers

**Files:**
- Modify: `app/sign-in/page.tsx`
- Modify: `app/sign-up/page.tsx`
- Modify: `app/forgot-password/page.tsx`

- [ ] **Step 1: Replace `app/sign-in/page.tsx`**

```tsx
import SigninForm from "@/app/ui/signin-form";
import { Suspense } from "react";
import { Metadata } from "next";
import { lusitana } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SigninPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-[400px] space-y-4 px-4">
        <div className="text-center">
          <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900`}>
            Rotational Focus Strategies
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A study on focus strategies for ADHD
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <Suspense>
            <SigninForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Replace `app/sign-up/page.tsx`**

```tsx
import SignupForm from "@/app/ui/signup-form";
import { Suspense } from "react";
import { Metadata } from "next";
import { lusitana } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an account to get started",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-[400px] space-y-4 px-4">
        <div className="text-center">
          <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900`}>
            Rotational Focus Strategies
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A study on focus strategies for ADHD
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <Suspense>
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Replace `app/forgot-password/page.tsx`**

```tsx
import ForgotPasswordForm from "@/app/ui/forgot-password-form";
import { Suspense } from "react";
import { Metadata } from "next";
import { lusitana } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-[400px] space-y-4 px-4">
        <div className="text-center">
          <h1 className={`${lusitana.className} text-2xl font-bold text-gray-900`}>
            Rotational Focus Strategies
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A study on focus strategies for ADHD
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <Suspense>
            <ForgotPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Run lint and build**

```bash
pnpm lint && pnpm build
```

Expected: 0 errors, build completes.

- [ ] **Step 5: Commit**

```bash
git add app/sign-in/page.tsx app/sign-up/page.tsx app/forgot-password/page.tsx
git commit -m "feat: add app name header and fix card styling on auth pages"
```

---

### Task 2: Fix `signin-form.tsx`

**Files:**
- Modify: `app/ui/signin-form.tsx`

- [ ] **Step 1: Replace `app/ui/signin-form.tsx` with the updated version**

Changes from current: remove inner `flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8` wrapper div; update heading to `font-bold mb-4` and text to "Sign in"; update labels from `text-xs` to `text-sm`.

```tsx
"use client";

import * as React from "react";
import { useSignIn } from "@clerk/nextjs/legacy";
import { useRouter } from "next/navigation";
import { lusitana } from "@/app/ui/fonts";
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

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOnMessage, setCapsLockOnMessage] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <form className="space-y-3" onSubmit={(e) => handleSubmit(e)}>
      <h1 className={`${lusitana.className} mb-4 text-2xl font-bold`}>Sign in</h1>
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
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handleKeyUp}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            <button
              type="button"
              onClick={handleClickShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-[18px] w-[18px]" />
              ) : (
                <EyeIcon className="h-[18px] w-[18px]" />
              )}
            </button>
            {capsLockOnMessage && (
              <div className="absolute bottom-[-20px] left-0 text-xs text-red-500">
                {capsLockOnMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      <Button className="mt-7 w-full">
        Sign in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Forgot your password?{" "}
          <Link href="/forgot-password" className="font-medium text-blue-600 hover:underline">
            Reset password
          </Link>
        </p>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Run lint and build**

```bash
pnpm lint && pnpm build
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add app/ui/signin-form.tsx
git commit -m "fix: update signin form styling to match style guide"
```

---

### Task 3: Fix `forgot-password-form.tsx`

**Files:**
- Modify: `app/ui/forgot-password-form.tsx`

- [ ] **Step 1: Replace `app/ui/forgot-password-form.tsx` with the updated version**

Changes from current: remove inner `flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8` wrapper div; add `font-bold` to heading; style error messages as `mt-2 text-sm text-red-600`.

```tsx
"use client";

import React, { useEffect, useState } from "react";
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
        <h1 className={`${lusitana.className} mb-4 text-2xl font-bold`}>
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
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <Button className="mt-7 w-full">
              Send password reset code{" "}
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
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
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter new password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleKeyUp}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              <button
                type="button"
                onClick={handleClickShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-[18px] w-[18px]" />
                ) : (
                  <EyeIcon className="h-[18px] w-[18px]" />
                )}
              </button>
              {capsLockOnMessage && (
                <div className="absolute bottom-[-20px] left-0 text-xs text-red-500">
                  {capsLockOnMessage}
                </div>
              )}
            </div>
            <label
              className="mb-3 mt-5 block text-sm font-medium text-gray-900"
              htmlFor="code"
            >
              Enter the password reset code that was sent to your email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <ChevronDoubleRightIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <Button className="mt-7 w-full">
              Reset{" "}
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </>
        )}

        {secondFactor && (
          <p className="mt-2 text-sm text-gray-600">
            2FA is required, but this UI does not handle that
          </p>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
```

- [ ] **Step 2: Run lint and build**

```bash
pnpm lint && pnpm build
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add app/ui/forgot-password-form.tsx
git commit -m "fix: update forgot-password form styling and error display"
```

---

### Task 4: Fix `signup-form.tsx` including verification step

**Files:**
- Modify: `app/ui/signup-form.tsx`

- [ ] **Step 1: Replace `app/ui/signup-form.tsx` with the updated version**

Changes from current: remove inner `flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8` wrapper div; update heading to `font-bold mb-4` and text to "Sign up"; update labels from `text-xs` to `text-sm`; fully style the `if (verifying)` branch; add `ChevronDoubleRightIcon` and `ArrowRightIcon` to imports.

```tsx
"use client";

import * as React from "react";
import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: unknown) {
      const clerkErr = err as { errors?: Array<{ code: string }> };
      if (clerkErr?.errors?.[0]?.code === "session_exists") {
        router.push("/dashboard");
        return;
      }
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  if (verifying) {
    return (
      <div>
        <h1 className={`${lusitana.className} mb-4 text-2xl font-bold`}>
          Verify your email
        </h1>
        <p className="mb-4 text-sm text-gray-500">
          Enter the verification code sent to your email address.
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
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter verification code"
            />
            <ChevronDoubleRightIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <Button className="mt-4 w-full">
            Verify <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h1 className={`${lusitana.className} mb-4 text-2xl font-bold`}>Sign up</h1>
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
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={emailAddress}
              required
              onChange={(e) => setEmailAddress(e.target.value)}
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div className="mt-4">
          <label
            className="mb-3 mt-5 block text-sm font-medium text-gray-900"
            htmlFor="password"
          >
            Password{" "}
            <span className="text-xs text-gray-500">(min 8 characters)</span>
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              required
              minLength={8}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handleKeyUp}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            <button
              type="button"
              onClick={handleClickShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-[18px] w-[18px]" />
              ) : (
                <EyeIcon className="h-[18px] w-[18px]" />
              )}
            </button>
            {capsLockOnMessage && (
              <div className="absolute bottom-[-20px] left-0 text-xs text-red-500">
                {capsLockOnMessage}
              </div>
            )}
          </div>
        </div>
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <Button className="mt-7 w-full">
        Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Run lint and build**

```bash
pnpm lint && pnpm build
```

Expected: 0 errors, build completes successfully.

- [ ] **Step 3: Commit**

```bash
git add app/ui/signup-form.tsx
git commit -m "feat: style signup form and verification step to match style guide"
```
