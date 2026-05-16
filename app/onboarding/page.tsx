"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  completeOnboarding,
  initializeDaysCompleted,
  initializeDaysExpected,
} from "./_actions";
import { lusitana } from "@/app/ui/fonts";
import { strategyDictionary } from "../lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import StrategyDescriptions from "@/app/ui/dashboard/strategy-descriptions";

export default function OnboardingComponent() {
  const [error, setError] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const requiredStrategies = 3;

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggleOpen = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) { next.delete(index); } else { next.add(index); }
      return next;
    });
  };

  const handleCheckboxChange = (item: string) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  const isValid = selectedItems.length === requiredStrategies;

  const handleSubmit = async (formData: FormData) => {
    const submitButton = document.getElementById(
      "form_submit_button"
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.innerText = "Submitting...";
      submitButton.disabled = true;
      submitButton.classList.add("opacity-50");
    }

    const res = await completeOnboarding(formData);
    if (res?.message) {
      // Reloads the user's data from the Clerk API
      await user?.reload();
      await initializeDaysCompleted();
      await initializeDaysExpected();
      router.push("/dashboard");
    }
    if (res?.error) {
      setError(res?.error);
    }
  };

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Welcome to Rotational Focus Strategies{user?.primaryEmailAddress?.emailAddress ? `, ${user.primaryEmailAddress.emailAddress}` : ""}
      </h1>
      <div className="grid gap-6 grid-cols-1">
        <form action={handleSubmit}>
          <div className="flex items-baseline justify-between max-w-2xl mb-2">
            <h2 className="text-lg font-semibold">Select 3 focus strategies</h2>
            <span className={`flex items-center gap-1 text-sm font-medium tabular-nums ${isValid ? "text-blue-700" : "text-gray-500"}`}>
              {isValid && (
                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
              {selectedItems.length} of 3 selected
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Expand a card to learn more before selecting.
          </p>
          {strategyDictionary.map((strategy, index) => {
            const isSelected = selectedItems.includes(strategy.href);
            const isDisabled =
              selectedItems.length >= requiredStrategies && !isSelected;
            const isOpen = openIndices.has(index);
            return (
              <div
                key={index}
                className={`mb-3 max-w-2xl rounded-lg border-2 shadow-sm transition-colors duration-150
                  ${isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}
                  ${isDisabled ? "opacity-50" : ""}`}
              >
                <div
                  className="flex cursor-pointer select-none items-center gap-3 px-4 py-3"
                  onClick={() => toggleOpen(index)}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) handleCheckboxChange(strategy.href);
                    }}
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors
                      ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-500 bg-white"}
                      ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {isSelected && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`flex-1 text-sm font-medium ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                    {strategy.name}
                  </span>
                  <svg
                    className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""} ${isSelected ? "text-blue-500" : "text-gray-500"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className={`border-t px-4 py-3 text-sm ${isSelected ? "border-blue-200" : "border-gray-200"}`}>
                      <StrategyDescriptions strategy={strategy.href} />
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="strategy"
                  value={strategy.href}
                  checked={isSelected}
                  onChange={() => handleCheckboxChange(strategy.href)}
                  className="sr-only"
                />
              </div>
            );
          })}

          <div className="flex justify-center max-w-2xl mt-1">
            <Button
              id="form_submit_button"
              className={`mt-4 ${
                isValid ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isValid}
            >
              Submit
            </Button>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      </div>
    </main>
  );
}
