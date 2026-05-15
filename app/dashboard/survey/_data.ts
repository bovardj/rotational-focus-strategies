'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
        {
            async accessToken() {
                return (await auth()).getToken()
            }
        }
    )
}

function getServiceSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
    )
}

// days_expected never changes after onboarding — cache it indefinitely per user.
async function getDaysExpected(userId: string) {
    return unstable_cache(
        async () => {
            const { data, error } = await getServiceSupabase()
                .from('days_expected')
                .select('baseline_days, daily_days')
                .eq('user_id', userId)
                .single()
            if (error) throw new Error('Error fetching days_expected: ' + error.message)
            return data
        },
        [userId, 'days-expected'],
        { revalidate: false, tags: [`days-expected-${userId}`] }
    )()
}

// Fetch all dashboard count data in 2 queries instead of 6 individual calls.
// Use this in dashboard/page.tsx; the individual functions below remain for survey-form.tsx.
export async function getDashboardCounts() {
    const { userId } = await auth()
    if (!userId) return null

    const supabase = getSupabase()

    const [completedResult, daysExpected] = await Promise.all([
        supabase
            .from('days_completed')
            .select('baseline_completed, baseline_surveys, daily_surveys, end_survey_completed')
            .eq('user_id', userId)
            .single(),
        getDaysExpected(userId),
    ])

    if (completedResult.error) throw new Error('Error fetching days_completed: ' + completedResult.error.message)

    return {
        baselineCompleted: completedResult.data.baseline_completed as boolean,
        baselineSurveysCompleted: completedResult.data.baseline_surveys as number,
        dailySurveysCompleted: completedResult.data.daily_surveys as number,
        endSurveyCompleted: completedResult.data.end_survey_completed as boolean,
        baselineSurveysExpected: daysExpected.baseline_days as number,
        dailySurveysExpected: daysExpected.daily_days as number,
    }
}

// Get the number of baseline days expected
export const getBaselineSurveysExpected = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { data, error } = await getSupabase()
        .from('days_expected')
        .select('baseline_days')
        .eq('user_id', userId)
        .single()

    if (error) {
        throw new Error('Error fetching baseline days expected from Supabase: ' + error.message)
    }

    return data.baseline_days
}

// Get the number of daily days expected
export const getDailySurveysExpected = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { data, error } = await getSupabase()
        .from('days_expected')
        .select('daily_days')
        .eq('user_id', userId)
        .single()

    if (error) {
        throw new Error('Error fetching daily days expected from Supabase: ' + error.message)
    }

    return data.daily_days
}

// Get the number of days completed
export const getDaysCompleted = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { data, error } = await getSupabase()
        .from('days_completed')
        .select('days_completed')
        .eq('user_id', userId)
        .single()

    if (error) {
        throw new Error('Error fetching days completed from Supabase: ' + error.message)
    }

    return data.days_completed
}

// Get the number of baseline surveys completed
export const getBaselineSurveysCompleted = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { data, error } = await getSupabase()
        .from('days_completed')
        .select('baseline_surveys')
        .eq('user_id', userId)
        .single()

    if (error) {
        throw new Error('Error fetching baseline surveys completed from Supabase: ' + error.message)
    }

    return data.baseline_surveys
}

// Get the number of daily surveys completed
export const getDailySurveysCompleted = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { data, error } = await getSupabase()
        .from('days_completed')
        .select('daily_surveys')
        .eq('user_id', userId)
        .single()

    if (error) {
        throw new Error('Error fetching daily surveys completed from Supabase: ' + error.message)
    }

    return data.daily_surveys
}

// Get if the end survey is completed
export const getEndSurveyCompleted = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { data, error } = await getSupabase()
        .from('days_completed')
        .select('end_survey_completed')
        .eq('user_id', userId)
        .single()

    if (error) {
        throw new Error('Error fetching end survey completed from Supabase: ' + error.message)
    }

    return data.end_survey_completed
}

// Get baseline_completed 
export const getBaselineCompleted = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { data, error } = await getSupabase()
        .from('days_completed')
        .select('baseline_completed')
        .eq('user_id', userId)
        .single()

    if (error) {
        throw new Error('Error fetching baseline completed from Supabase: ' + error.message)
    }

    return data.baseline_completed
}

// Get daily_completed
export const getDailyCompleted = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { data, error } = await getSupabase()
        .from('days_completed')
        .select('daily_completed')
        .eq('user_id', userId)
        .single()

    if (error) {
        throw new Error('Error fetching daily completed from Supabase: ' + error.message)
    }

    return data.daily_completed
}
