'use client'

import * as React from 'react'
import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
// import { SignUpForm } from '@/app/ui/signup-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { lusitana } from '@/app/ui/fonts'
import { Button } from '@/app/ui/button'
import {
    ArrowRightIcon,
    AtSymbolIcon,
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
    UserIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')
  const router = useRouter()

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

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

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      // Set 'verifying' true to display second form
      // and capture the OTP code
      setVerifying(true)
    } catch (err: any) { // eslint-disable-line
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle the submission of the verification form
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.push('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err: any) { // eslint-disable-line
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2))
    }
  }

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <>
        <h1>Verify your email</h1>
        <form onSubmit={handleVerify}>
          <label id="code">Enter your verification code</label>
          <input value={code} id="code" name="code" onChange={(e) => setCode(e.target.value)} />
          <button type="submit">Verify</button>
        </form>
      </>
    )
  }

  // Display the initial sign-up form to capture the email and password
  return (
    <>
      {/* <h1>Sign up</h1> */}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Please sign up to continue.
          </h1>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="firstName"
              >
                First Name
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="firstName"
                  type="string"
                  name="firstName"
                  placeholder="Enter your first name"
                  required
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="lastName"
                  type="string"
                  name="lastName"
                  placeholder="Enter your last name"
                  required
                />
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
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
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password <span className="text-xs text-gray-500">(min 8 characters)</span>
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
        {/* <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div> */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                    href="/sign-in"
                    className="font-medium text-blue-600 hover:underline"
                >
                    Sign in
                </Link>
            </p>
          </div>
        </div>
      </form>
    </>
  )
}