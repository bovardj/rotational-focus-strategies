'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding, initializeDaysCompleted, initializeDaysExpected } from './_actions'
import { lusitana } from '@/app/ui/fonts';
import { strategyDictionary } from '../lib/utils'
import { useState } from 'react';
import { Button } from '../ui/button';
import Collapse from '@geist-ui/react/esm/collapse/collapse';
import StrategyDescriptions from '@/app/ui/dashboard/strategy-descriptions';

export default function OnboardingComponent() {
  const [error, setError] = useState('')
  const { user } = useUser()
  const router = useRouter()
  const requiredStrategies = 3

  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleCheckboxChange = (item: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  const isValid = selectedItems.length === requiredStrategies;

  const handleSubmit = async (formData: FormData) => {
    const submitButton = document.getElementById('form_submit_button') as HTMLButtonElement;
    if (submitButton) {
      submitButton.innerText = 'Submitting...';
      submitButton.disabled = true;
      submitButton.classList.add('opacity-50');
    }

    const res = await completeOnboarding(formData)
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload()
      await initializeDaysCompleted()
      await initializeDaysExpected()
      router.push('/dashboard')
    }
    if (res?.error) {
      setError(res?.error)
    }
  }

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Welcome
      </h1>
      <div className="grid gap-6 grid-cols-1">
        <div>
          <p className="italic underline mb-4 text-lg md:text-lg sm:w-1/2 md:w-2/3 lg:w-1/2">
            Looking for the log out button?
          </p>
          <p className="mb-4 text-lg md:text-lg sm:w-1/2 md:w-2/3 lg:w-1/2">
            You can find it, along with account management, in the top right corner of the page (you may need to scroll up).
          </p>
        </div>
        <form action={handleSubmit}>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Select 3 focus strategies</h2>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Choose the strategies that you would like to use.
            </p>
          </div>
          {strategyDictionary.map((strategy, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`strategy-${index}`}
                name="strategy"
                value={strategy.href}
                className="mr-4"
                checked={selectedItems.includes(strategy.href)}
                onChange={() => handleCheckboxChange(strategy.href)}
                disabled={
                  selectedItems.length >= requiredStrategies &&
                  !selectedItems.includes(strategy.href)
                }
              />
              <div className="flex items-center sm:w-2/3 lg:w-1/2">
              <Collapse title={strategy.name} className="mb-4">
                <StrategyDescriptions strategy={strategy.href} />
              </Collapse>
              </div>
            </div>
          ))}
          <p className="text-red-600" id="strategy-error" style={{ display: 'none' }}>
            You must select exactly 3 strategies.
          </p>
            <div className="flex justify-center sm:w-2/3 lg:w-1/2">
            <Button id='form_submit_button' className={`mt-4 ${
              isValid ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!isValid}
            >
              Submit
            </Button>
            </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      </div>
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
    </div>
  </main>
  )
}