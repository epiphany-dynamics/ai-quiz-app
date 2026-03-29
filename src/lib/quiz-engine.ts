// ============================================================
// QUIZ ENGINE — Branching logic, scoring, navigation
// ============================================================

import type { Question, Answer, QuizSession, Track, ResultCategory, ShowIfCondition } from '@/types'

// ============================================================
// SHOW_IF EVALUATION
// ============================================================

function evaluateShowIf(
  showIf: Record<string, ShowIfCondition>,
  answers: Answer[],
): boolean {
  for (const [questionId, condition] of Object.entries(showIf)) {
    const answer = answers.find(a => a.questionId === questionId)
    const rawValue = answer?.value
    const value = rawValue !== undefined
      ? (Array.isArray(rawValue) ? rawValue[0] : rawValue)
      : null

    if (typeof condition === 'string') {
      if (value !== condition) return false
    } else if (Array.isArray(condition)) {
      if (!value || !(condition as string[]).includes(String(value))) return false
    } else if (typeof condition === 'object' && 'not' in condition) {
      if (value === condition.not) return false
    }
  }
  return true
}

// ============================================================
// BRANCHING / NAVIGATION
// ============================================================

/**
 * Determines the next question ID given the current question, answer, and session history.
 * Respects show_if conditions — skips questions whose conditions aren't met.
 * Returns null if the track is complete.
 */
export function getNextQuestionId(
  current: Question,
  answer: Answer,
  allQuestions: Question[],
  sessionAnswers: Answer[] = [],
): string | null {
  // Build combined answers (previous + this one) for show_if evaluation
  const allAnswers = [
    ...sessionAnswers.filter(a => a.questionId !== answer.questionId),
    answer,
  ]

  const selectedValue = Array.isArray(answer.value)
    ? answer.value[0]
    : String(answer.value)

  // Entry gate: route to first question of chosen track
  if (current.type === 'entry_gate' && current.options) {
    const selected = current.options.find(o => o.value === selectedValue)
    if (selected?.routes_to) return getFirstQuestionForTrack(selected.routes_to, allQuestions)
  }

  // Option-level skip (explicit skips_to on option)
  if (current.options) {
    const selected = current.options.find(o => o.value === selectedValue)
    if (selected?.skips_to) return findNextVisible(selected.skips_to, allQuestions, allAnswers)
  }

  // Question-level branches
  if (current.branches) {
    const branch = current.branches.find(b => b.if === selectedValue)
    if (branch?.ends_track) return null
    if (branch?.skips_to) return findNextVisible(branch.skips_to, allQuestions, allAnswers)
  }

  // Default: next question in track order, skip any that fail show_if
  return findNextInTrack(current, allQuestions, allAnswers)
}

/** Returns the first visible question at or after the given ID (respecting show_if). */
function findNextVisible(
  startId: string,
  allQuestions: Question[],
  answers: Answer[],
): string | null {
  const idx = allQuestions.findIndex(q => q.id === startId)
  if (idx === -1) return null
  for (let i = idx; i < allQuestions.length; i++) {
    const q = allQuestions[i]
    if (!q.show_if || evaluateShowIf(q.show_if, answers)) return q.id
  }
  return null
}

/** Default: find next question after current in the same track, skipping show_if failures. */
function findNextInTrack(
  current: Question,
  allQuestions: Question[],
  answers: Answer[],
): string | null {
  const trackQs = allQuestions.filter(
    q => (q.track === current.track || !q.track) && q.id !== 'Q0',
  )
  const currentIdx = trackQs.findIndex(q => q.id === current.id)
  if (currentIdx === -1) return null

  for (let i = currentIdx + 1; i < trackQs.length; i++) {
    const q = trackQs[i]
    if (!q.show_if || evaluateShowIf(q.show_if, answers)) return q.id
  }
  return null
}

function getFirstQuestionForTrack(track: Track, allQuestions: Question[]): string | null {
  const first = allQuestions.find(q => q.track === track)
  return first?.id ?? null
}

// ============================================================
// VARIANT RESOLUTION (for A7-style scenario questions)
// ============================================================

/**
 * Resolves a variant question's options based on session answers.
 * A7 has industry variants keyed by the A1 tag value.
 */
export function resolveVariantQuestion(
  question: Question,
  sessionAnswers: Answer[],
  questions: Question[],
): Question {
  if (!question.variants) return question

  // Find the personalization token answer (A1 for industry)
  const industryAnswer = sessionAnswers.find(a => {
    const q = questions.find(q => q.id === a.questionId)
    return q?.tags?.some(t => t.startsWith('personalization_token:industry'))
  })

  if (!industryAnswer) {
    const fallback = question.variants['other'] ?? Object.values(question.variants)[0]
    return { ...question, options: fallback?.options ?? [] }
  }

  // Map the option value to its tag
  const industryQ = questions.find(q => q.id === industryAnswer.questionId)
  const selectedOption = industryQ?.options?.find(
    o =>
      o.value ===
      (Array.isArray(industryAnswer.value) ? industryAnswer.value[0] : industryAnswer.value),
  )
  const industryTag = selectedOption?.tag ?? 'other'

  const variant = question.variants[industryTag] ?? question.variants['other']
  return { ...question, options: variant?.options ?? [] }
}

// ============================================================
// SCORING
// ============================================================

/**
 * Compute score for a single question given its answer.
 * Returns the points earned or null if question doesn't contribute to score.
 */
function scoreQuestion(question: Question, answer: Answer | undefined): number | null {
  const scoring = question.scoring
  if (!scoring || scoring === false) return null

  // If this question was never answered (skipped via branching)
  if (!answer) {
    if (typeof scoring === 'object' && 'default_if_hidden' in scoring) {
      return scoring.default_if_hidden ?? null
    }
    if (typeof scoring === 'object' && 'default_if_skipped' in scoring) {
      return scoring.default_if_skipped ?? null
    }
    return null
  }

  if (typeof scoring !== 'object') {
    // Legacy boolean: look for score on the selected option
    if (question.type === 'single_select' || question.type === 'entry_gate') {
      const val = Array.isArray(answer.value) ? answer.value[0] : answer.value
      const opt = question.options?.find(o => o.value === val)
      return opt?.score ?? null
    }
    return null
  }

  const { method } = scoring

  if (method === 'direct') {
    const val = Array.isArray(answer.value) ? answer.value[0] : answer.value
    const opt = question.options?.find(o => o.value === val)
    return opt?.score ?? null
  }

  if (method === 'count') {
    const values = Array.isArray(answer.value) ? answer.value : [answer.value]
    // If 'none' option selected, score = 0
    if (scoring.none_option && values.includes(scoring.none_option)) return 0
    const count = values.length
    const scale = scoring.scale ?? []
    // Find highest matching scale entry
    const entry = [...scale]
      .filter(s => 'selections' in s && s.selections !== undefined && count >= (s.selections ?? 0))
      .pop()
    return entry?.points ?? 0
  }

  if (method === 'formula') {
    // Scale-based formula for slider/scale questions
    const val = Number(answer.value)
    const scale = scoring.scale ?? []
    const entry = scale.find(s => {
      if ('range' in s && s.range) {
        return val >= s.range[0] && val <= s.range[1]
      }
      return false
    })
    return entry?.points ?? 0
  }

  return null
}

/**
 * Computes the AI readiness score (0–100) for the business track.
 */
export function computeBusinessScore(session: QuizSession, questions: Question[]): number {
  return computeTrackScore(session, questions)
}

/**
 * Computes the AI readiness score (0–100) for the general track.
 */
export function computeGeneralScore(session: QuizSession, questions: Question[]): number {
  return computeTrackScore(session, questions)
}

function computeTrackScore(session: QuizSession, questions: Question[]): number {
  let total = 0

  for (const question of questions) {
    const answer = session.answers.find(a => a.questionId === question.id)
    const pts = scoreQuestion(question, answer)
    if (pts !== null) total += pts
  }

  return Math.max(0, Math.min(100, Math.round(total)))
}

/**
 * Gets the result category that matches a given score.
 */
export function getResultCategory(
  score: number,
  categories: ResultCategory[],
): ResultCategory | null {
  return (
    categories.find(c => score >= c.range[0] && score <= c.range[1]) ??
    categories[categories.length - 1] ??
    null
  )
}

// ============================================================
// PROGRESS
// ============================================================

/**
 * Estimates total visible questions for a track given current answers.
 */
export function estimateVisibleQuestions(
  questions: Question[],
  sessionAnswers: Answer[],
): number {
  return questions.filter(
    q => !q.show_if || evaluateShowIf(q.show_if, sessionAnswers),
  ).length
}

// ============================================================
// SESSION MANAGEMENT
// ============================================================

export function createSession(): QuizSession {
  return {
    id: typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    track: null,
    answers: [],
    metadata: {},
    startedAt: Date.now(),
  }
}

export function addAnswer(session: QuizSession, answer: Answer): QuizSession {
  const existing = session.answers.findIndex(a => a.questionId === answer.questionId)
  const answers =
    existing >= 0
      ? session.answers.map((a, i) => (i === existing ? answer : a))
      : [...session.answers, answer]

  return { ...session, answers }
}

export function getProgress(currentIndex: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0
  return Math.round((currentIndex / totalQuestions) * 100)
}

// ============================================================
// SHARING
// ============================================================

export function buildShareText(score: number, label: string, track: Track): string {
  if (track === 'business') {
    return `I scored ${score}/100 on the AI Readiness Quiz — "${label}". Find out your score at epiphanydynamics.ai 🚀`
  }
  return `I scored ${score}/100 on the AI Readiness Quiz — "${label}". How ready are you for AI? epiphanydynamics.ai`
}

export function buildShareUrl(resultId: string): string {
  const base =
    typeof window !== 'undefined' ? window.location.origin : 'https://epiphanydynamics.ai'
  return `${base}/?result=${resultId}`
}
