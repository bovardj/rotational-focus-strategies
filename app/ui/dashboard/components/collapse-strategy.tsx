'use client'

import { Collapse } from '@geist-ui/react';
import StrategyDescriptions from '@/app/ui/dashboard/strategy-descriptions';

export default function CollapseStrategy({ strategyList: strategyList }: { strategyList: { name: string, href: string }[] }) {

    return (
        <>
            <div className="flex items-center sm:w-2/3 lg:w-1/2">
                <Collapse shadow title="Your Focus Strategies" className='bg-gray-50'>
                    {strategyList.map((strategy, index) => (
                        <div key={index} className="flex items-center">
                            <Collapse shadow title={strategy.name} className="bg-gray-50">
                                <StrategyDescriptions strategy={strategy.href} />
                            </Collapse>
                        </div>
                    ))}
                </Collapse>
            </div>

            {/* Below is an alternative approach to the UI */}
            {/* <h2 className="ml-4 text-2xl mt-6 underline">Your Focus Strategies</h2>
            {strategyList.map((strategy, index) => (
                    <div key={index} className="flex items-center">
                        <div className="flex items-center sm:w-2/3 lg:w-1/2">

                        <Collapse shadow title={strategy.name} className="bg-gray-50">
                            <StrategyDescriptions strategy={strategy.href} />
                        </Collapse>
                    </div>
                </div>
            ))} */}
        </>
    )
}