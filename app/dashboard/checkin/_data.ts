'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
)

// Get the number of baseline days expected
export const getBaselineSurveysExpected = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { data, error } = await supabase
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

    const { data, error } = await supabase
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

    const { data, error } = await supabase
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

    const { data, error } = await supabase
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

    const { data, error } = await supabase
        .from('days_completed')
        .select('daily_surveys')
        .eq('user_id', userId)
        .single()

    if (error) {
        throw new Error('Error fetching daily surveys completed from Supabase: ' + error.message)
    }

    return data.daily_surveys
}

// Get if teh end survey is completed
export const getEndSurveyCompleted = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { data, error } = await supabase
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

    const { data, error } = await supabase
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

    const { data, error } = await supabase
        .from('days_completed')
        .select('daily_completed')
        .eq('user_id', userId)
        .single()

    if (error) {
        throw new Error('Error fetching daily completed from Supabase: ' + error.message)
    }

    return data.daily_completed
}
