import { createClient } from '@supabase/supabase-js'
import type { Answer, Track } from '@/types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Singleton client — null if env vars not set (prevents crashes in local dev without .env.local)
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

// ============================================================
// QUIZ RESULTS
// ============================================================

export interface QuizResultPayload {
  session_id: string
  track: Track
  score: number
  result_category_id: string
  result_category_label: string
  answers: Answer[]
  metadata?: Record<string, unknown>
}

/**
 * Saves a completed quiz result to Supabase.
 * Returns the inserted row id, or null on failure (non-blocking — quiz UX continues regardless).
 */
export async function saveQuizResult(payload: QuizResultPayload): Promise<string | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        session_id: payload.session_id,
        track: payload.track,
        score: payload.score,
        result_category_id: payload.result_category_id,
        result_category_label: payload.result_category_label,
        answers: payload.answers,
        metadata: payload.metadata ?? {},
      })
      .select('id')
      .single()

    if (error) {
      console.warn('[supabase] saveQuizResult failed:', error.message)
      return null
    }
    return data?.id ?? null
  } catch (e) {
    console.warn('[supabase] saveQuizResult error:', e)
    return null
  }
}

// ============================================================
// EMAIL CAPTURE
// ============================================================

export interface EmailCapturePayload {
  email: string
  result_id: string | null
  result_category_id: string
  score: number
  opted_in?: boolean
}

/**
 * Saves an email capture to Supabase.
 * Non-blocking — failures are logged but don't affect the user flow.
 */
export async function saveEmailCapture(payload: EmailCapturePayload): Promise<void> {
  if (!supabase) return
  try {
    const { error } = await supabase.from('email_captures').insert({
      email: payload.email,
      result_id: payload.result_id || null,
      result_category_id: payload.result_category_id,
      score: payload.score,
      opted_in: payload.opted_in ?? true,
    })
    if (error) {
      console.warn('[supabase] saveEmailCapture failed:', error.message)
    }
  } catch (e) {
    console.warn('[supabase] saveEmailCapture error:', e)
  }
}
