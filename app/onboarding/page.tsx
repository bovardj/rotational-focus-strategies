'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { completeOnboarding, initializeDaysCompleted } from './_actions'
import { lusitana } from '@/app/ui/fonts';
import { strategies } from '../lib/utils'
import { useState } from 'react';
import { Button } from '../ui/button';
import Breadcrumbs from '../ui/strategies/breadcrumbs';

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

  // const formattedStrategy = strategies.find(
  //   (strat) => strat.href === strategy,
  // )?.name || strategy;

  const isValid = selectedItems.length === requiredStrategies;

  const handleSubmit = async (formData: FormData) => {
  // const handleSubmit = async (event: FormEvent) => {
  //   event.preventDefault()
  //   if (!isValid) {
  //     setError(`You must select exactly ${requiredStrategies} strategies.`)
  //     return
  //   }

  //   const formData = new FormData(event.currentTarget as HTMLFormElement)
    
    // const selectedStrategies = formData.getAll('strategy') as string[]
    // console.log('Form data:', formData)
    // console.log('Selected strategies:', selectedStrategies)

    // return

    const res = await completeOnboarding(formData)
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload()
      await initializeDaysCompleted()
      router.push('/dashboard')
    }
    if (res?.error) {
      setError(res?.error)
    }

    // await initializeDaysCompleted()
    // if (res?.message) {
    //   // Reloads the user's data from the Clerk API
    //   await user?.reload()
    //   router.push('/')
    // }
    // if (res?.error) {
    //   setError(res?.error)
    // }
  }

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Welcome
      </h1>
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"> */}
      <div className="grid gap-6 grid-cols-1">
        <form action={handleSubmit}>
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Select 3 focus strategies</h2>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Choose the strategies that you would like to use.
            </p>
          </div>
          {strategies.map((strategy, index) => (
            <div key={index} className="flex items-center">
              {/* <Breadcrumbs
                breadcrumbs={[
                  { label: 'Focus Strategies', href: '/dashboard/strategies' },
                  {
                    label: formattedStrategy,
                    href: `/dashboard/strategies/${strategy}/`,
                    active: true,
                  },
                ]}
              /> */}
              <input
                type="checkbox"
                id={`strategy-${index}`}
                name="strategy"
                value={strategy.href}
                className="mr-2"
                checked={selectedItems.includes(strategy.href)}
                onChange={() => handleCheckboxChange(strategy.href)}
                disabled={
                  selectedItems.length >= requiredStrategies &&
                  !selectedItems.includes(strategy.href)
                }
              />
              <label htmlFor={`strategy-${index}`}>{strategy.name}</label>
            </div>
          ))}
          <p className="text-red-600" id="strategy-error" style={{ display: 'none' }}>
            You must select exactly 3 strategies.
          </p>
          {/* <script>
            {`
              document.addEventListener('DOMContentLoaded', () => {
                const checkboxes = document.querySelectorAll('input[name="strategies"]');
                const errorElement = document.getElementById('strategy-error');
                checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
              const selected = Array.from(checkboxes).filter(cb => cb.checked);
              if (selected.length === 3) {
                errorElement.style.display = 'none';
              } else {
                errorElement.style.display = 'block';
              }
            });
                });
              });
            `}
          </script> */}
          <Button className={`mt-4 ${
              isValid ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!isValid}
          >
            Submit
          </Button>

          {/* <button
            type="submit"
            className={`mt-4 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
              isValid ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!isValid}
          >
            Submit
          </button> */}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>


        {/* <div> */}
          {/* <h1>Welcome</h1> */}
          {/* <form onSubmit={handleSubmit}>
            <div>
              <label>Application Name</label>
              <p>Enter the name of your application.</p>
              <input type="text" name="applicationName" required />
            </div>

            <div>
              <label>Application Type</label>
              <p>Describe the type of your application.</p>
              <input type="text" name="applicationType" required />
            </div>
            {error && <p className="text-red-600">Error: {error}</p>}
            <button type="submit">Submit</button>
          </form> */}
        {/* </div> */}
      </div>
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
    </div>
  </main>

  )
  // (
    // <div>
    //   <h1>Welcome</h1>
    //   <form action={handleSubmit}>
    //     <div>
    //       <label>Application Name</label>
    //       <p>Enter the name of your application.</p>
    //       <input type="text" name="applicationName" required />
    //     </div>

    //     <div>
    //       <label>Application Type</label>
    //       <p>Describe the type of your application.</p>
    //       <input type="text" name="applicationType" required />
    //     </div>
    //     {error && <p className="text-red-600">Error: {error}</p>}
    //     <button type="submit">Submit</button>
    //   </form>
    // </div>
  // )
}