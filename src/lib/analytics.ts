import type { Track } from '@/types'

declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams?: Record<string, unknown>,
    ) => void
  }
}

interface QuizCompletedParams {
  sessionId: string
  track: Track
  score: number
  resultId: string
}

const trackedQuizCompletions = new Set<string>()

export function trackQuizCompleted({ sessionId, track, score, resultId }: QuizCompletedParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  if (trackedQuizCompletions.has(sessionId)) return
  trackedQuizCompletions.add(sessionId)

  window.gtag('event', 'quiz_completed', {
    event_category: 'conversion',
    session_id: sessionId,
    quiz_track: track,
    score,
    result_category_id: resultId,
  })
}
