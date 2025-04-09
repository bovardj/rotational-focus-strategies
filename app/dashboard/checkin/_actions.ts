'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

// Insert a new row into the baseline_survey_responses table
export const insertBaselineSurvey = async (formData: FormData) => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }
    
    const supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_ANON_KEY || ''
    )
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

// Insert a new row into the daily_survey_responses table
export const insertDailySurvey = async (formData: FormData) => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }
    
    const supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_ANON_KEY || ''
    )
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


// Insert a new row into the end_survey_responses table
export const insertEndSurvey = async (formData: FormData) => {
    const { userId } = await auth()
    if (!userId) {
        return { message: 'No Logged In User' }
    }
    
    const supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_ANON_KEY || ''
    )
    const { error } = await supabase
        .from('end_survey_responses')
        .insert({
            user_id: userId,
            satisfaction_score: formData.get('satisfaction_score'),
            productivity_score: formData.get('productivity_score'),
            usefulness_score: formData.get('usefulness_score'),
            open_response: formData.get('open_response'),
        })
    if (error) {
        throw new Error('Error inserting response to baseline_survey_responses in Supabase: ' + error.message)
    }
    return { message: 'Response submitted!' }
}