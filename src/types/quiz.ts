// ============================================================
// QUIZ TYPES
// Supports branching logic, adaptive questions, result scoring
// ============================================================

export type Track = 'entry' | 'business' | 'general'

export type QuestionType =
  | 'single_select'
  | 'multi_select'
  | 'scale'
  | 'free_text'
  | 'entry_gate'

export type LayoutType = 'list' | 'grid' | 'card_full' | 'scale' | 'scenario_cards' | 'slider'

export type ShowIfCondition = string | string[] | { not: string }

export interface FollowUp {
  type: 'free_text' | 'single_select'
  placeholder?: string
  max_chars?: number
  required?: boolean
  captured_as: string
}

export interface QuestionOption {
  value: string
  label: string
  tag?: string
  emoji?: string
  description?: string
  routes_to?: Track
  skips_to?: string
  follow_up?: FollowUp
  score?: number
}

export interface ScaleConfig {
  min: number
  max: number
  step?: number
  labels?: { min: string; max: string }
}

export interface BranchCondition {
  if: string           // option value that triggers branch
  skips_to?: string    // jump to this question id
  ends_track?: boolean
}

export interface ScoringConfig {
  method: 'direct' | 'count' | 'formula'
  max_points: number
  default_if_hidden?: number
  default_if_skipped?: number
  scale?: Array<{ selections?: number; range?: [number, number]; points: number }>
  none_option?: string
}

export interface Question {
  id: string
  type: QuestionType
  layout?: LayoutType
  track?: Track
  question: string
  sub_text?: string
  subtitle?: string
  tags?: string[]
  scoring?: boolean | ScoringConfig
  score_weight?: number
  options?: QuestionOption[]
  scale?: ScaleConfig
  branches?: BranchCondition[]
  required?: boolean
  max_selections?: number
  show_if?: Record<string, ShowIfCondition>
  variants?: Record<string, { options: QuestionOption[] }>
}

// ============================================================
// ANSWERS & STATE
// ============================================================

export interface Answer {
  questionId: string
  value: string | string[] | number
  followUpValue?: string
  track?: Track
  tags?: string[]
  score?: number
}

export interface QuizSession {
  id: string
  track: Track | null
  answers: Answer[]
  metadata: Record<string, string>
  startedAt: number
  completedAt?: number
  score?: number
  resultId?: string
}

// ============================================================
// RESULTS
// ============================================================

export interface InsightCard {
  id: string
  title: string
  body: string
}

export interface ResultCategory {
  id: string
  label: string
  range: [number, number]
  tagline: string
  color: string
  badge_emoji: string
  description: string
  insight_cards: InsightCard[]
  cta?: {
    label: string
    url: string
  }
}

export interface ResultPath {
  result_type: string
  description: string
  categories: ResultCategory[]
}

export interface ResultsData {
  version: string
  description: string
  paths: {
    business: ResultPath
    general: ResultPath
  }
}

// ============================================================
// QUIZ ENGINE STATE
// ============================================================

export type QuizPhase =
  | 'landing'
  | 'quiz'
  | 'calculating'
  | 'results'
  | 'share'

export interface QuizState {
  phase: QuizPhase
  session: QuizSession
  currentQuestionId: string | null
  questionHistory: string[]
  isAnimating: boolean
}

export type QuizAction =
  | { type: 'START_QUIZ' }
  | { type: 'ANSWER_QUESTION'; answer: Answer; nextQuestionId: string | null }
  | { type: 'GO_BACK' }
  | { type: 'SET_TRACK'; track: Track }
  | { type: 'COMPLETE_QUIZ'; score: number; resultId: string }
  | { type: 'RESET' }
  | { type: 'SET_ANIMATING'; value: boolean }
