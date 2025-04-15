'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || '',
    {
        async accessToken() {
            return (await auth()).getToken()
        }
    }
)

// Insert a new row into the baseline_survey_responses table
export const insertBaselineSurvey = async (formData: FormData) => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { error } = await supabase
        .from('baseline_survey_responses')
        .insert({
            user_id: userId,
            satisfaction_score: formData.get('satisfaction_score'),
            productivity_score: formData.get('productivity_score'),
            open_response: formData.get('open_response'),
            submission_date: formData.get('submission_date')
        })
    if (error) {
        throw new Error('Error inserting response to baseline_survey_responses in Supabase: ' + error.message)
    }
    return { message: 'Response submitted!' }
}

// Add 1 to the number of baseline surveys completed
export const setBaselineSurveysCompleted = async (baselineSurveysCompleted: bigint, daysCompleted: bigint) => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    console.log('Setting Baseline Surveys Completed:', baselineSurveysCompleted)

    const { error } = await supabase
        .from('days_completed')
        .update({
            days_completed: daysCompleted,
            baseline_surveys: baselineSurveysCompleted
        })
        .eq('user_id', userId)
    if (error) {
        throw new Error('Error setting baseline surveys completed in Supabase: ' + error.message)
    }
    return { message: 'Baseline surveys completed set!' }
}

// Set baseline_completed to true
export const setBaselineCompleted = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { error } = await supabase
        .from('days_completed')
        .update({
            baseline_completed: true
        })
        .eq('user_id', userId)
    if (error) {
        throw new Error('Error setting baseline completed in Supabase: ' + error.message)
    }
    return { message: 'Baseline completed set to true!' }
}

// Insert a new row into the daily_survey_responses table
export const insertDailySurvey = async (formData: FormData) => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }
    

    const { error } = await supabase
        .from('daily_survey_responses')
        .insert({
            user_id: userId,
            satisfaction_score: formData.get('satisfaction_score'),
            productivity_score: formData.get('productivity_score'),
            used_strategy: formData.get('used_strategy'),
            strategy_response: formData.get('strategy_response'),
            open_response: formData.get('open_response'),
            submission_date: formData.get('submission_date')
        })
    if (error) {
        throw new Error('Error inserting response to daily_survey_responses in Supabase: ' + error.message)
    }
    return { message: 'Response submitted!' }
}

// Add 1 to the number of daily surveys completed
export const setDailySurveysCompleted = async (dailySurveysCompleted: bigint, daysCompleted: bigint) => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    console.log('Setting Daily Surveys Completed:', dailySurveysCompleted)

    const { error } = await supabase
        .from('days_completed')
        .update({
            days_completed: daysCompleted,
            daily_surveys: dailySurveysCompleted
        })
        .eq('user_id', userId)
    if (error) {
        throw new Error('Error setting daily surveys completed in Supabase: ' + error.message)
    }
    return { message: 'Daily surveys completed set!' }
}

// Set daily_completed to true
export const setDailyCompleted = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { error } = await supabase
        .from('days_completed')
        .update({
            daily_completed: true
        })
        .eq('user_id', userId)
    if (error) {
        throw new Error('Error setting daily completed in Supabase: ' + error.message)
    }
    return { message: 'Daily completed set to true!' }
}

// Insert a new row into the end_survey_responses table
export const insertEndSurvey = async (formData: FormData) => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    let gender_identity_other: string | null
    let racial_identity_other: string | null

    const gender_identity = formData.getAll('gender_identity')
    const racial_identity = formData.getAll('racial_identity')
    if (gender_identity.includes('other')) {
        gender_identity_other = formData.get('gender_identity_other') as string | null
    } else { gender_identity_other = null }
    if (racial_identity.includes('other')) {
        racial_identity_other = formData.get('racial_identity_other') as string | null
    } else { racial_identity_other = null }
    

    const { error } = await supabase
        .from('end_survey_responses')
        .insert({
            user_id: userId,
            satisfaction_score: formData.get('satisfaction_score'),
            productivity_score: formData.get('productivity_score'),
            usefulness_score: formData.get('usefulness_score'),
            open_response: formData.get('open_response'),
            gender_identity: gender_identity,
            gender_identity_other: gender_identity_other,
            racial_identity: racial_identity,
            racial_identity_other: racial_identity_other,
        })
    if (error) {
        throw new Error('Error inserting response to baseline_survey_responses in Supabase: ' + error.message)
    }
    return { message: 'Response submitted!' }
}

// Set end_survey_completed to true
export const setEndSurveyCompleted = async () => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }

    const { error } = await supabase
        .from('days_completed')
        .update({
            end_survey_completed: true
        })
        .eq('user_id', userId)
    if (error) {
        throw new Error('Error setting end survey completed in Supabase: ' + error.message)
    }
    return { message: 'End survey completed set to true!' }
}