'use client'

import React, { useEffect, useState } from 'react'
import { useAuth, useSignIn } from '@clerk/nextjs'
import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { ArrowRightIcon, AtSymbolIcon, EyeIcon, EyeSlashIcon, KeyIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/app/ui/button'
import { lusitana } from './fonts'

const ForgotPasswordForm: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [secondFactor, setSecondFactor] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()

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
      router.push('/dashboard')
    }
  }, [isSignedIn, router])

  if (!isLoaded) {
    return null
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault()
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then((_) => { // eslint-disable-line
        setSuccessfulCreation(true)
        setError('')
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault()
    await signIn
      ?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === 'needs_second_factor') {
          setSecondFactor(true)
          setError('')
        } else if (result.status === 'complete') {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId })
          setError('')
        } else {
          console.log(result)
        }
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        setError(err.errors[0].longMessage)
      })
  }

  return (
    <div>
      <form onSubmit={!successfulCreation ? create : reset}>
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
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
            Send password reset code <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>
            {/* <button>Send password reset code</button> */}
            {error && <p>{error}</p>}
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
                htmlFor="password"
                >
                Enter the password reset code that was sent to your email
                </label>
            <div className="relative">
                <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                type="code"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                />
                <ChevronDoubleRightIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                
            </div>
            <Button className="mt-7 w-full">
                Reset <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            </Button>
            {/* <button>Reset</button> */}
            {error && <p>{error}</p>}
          </>
        )}

        {secondFactor && <p>2FA is required, but this UI does not handle that</p>}
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordForm