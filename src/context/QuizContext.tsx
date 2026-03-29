import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { QuizState, QuizAction, Answer, Track } from '@/types'
import { createSession, addAnswer } from '@/lib'

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: QuizState = {
  phase: 'landing',
  session: createSession(),
  currentQuestionId: 'Q0',
  questionHistory: [],
  isAnimating: false,
}

// ============================================================
// REDUCER
// ============================================================

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        phase: 'quiz',
        currentQuestionId: 'Q0',
        questionHistory: [],
      }

    case 'ANSWER_QUESTION': {
      const { answer, nextQuestionId } = action
      const newSession = addAnswer(state.session, answer)
      const newHistory = [...state.questionHistory, state.currentQuestionId!]

      if (nextQuestionId === null) {
        return {
          ...state,
          session: newSession,
          phase: 'calculating',
          currentQuestionId: null,
          questionHistory: newHistory,
        }
      }

      return {
        ...state,
        session: newSession,
        currentQuestionId: nextQuestionId,
        questionHistory: newHistory,
      }
    }

    case 'SET_TRACK':
      return {
        ...state,
        session: { ...state.session, track: action.track as Track },
      }

    case 'GO_BACK': {
      if (state.questionHistory.length === 0) return state
      const prev = state.questionHistory[state.questionHistory.length - 1]
      const newHistory = state.questionHistory.slice(0, -1)
      // Remove the answer for current question
      const answers = state.session.answers.filter(
        a => a.questionId !== state.currentQuestionId,
      )
      return {
        ...state,
        session: { ...state.session, answers },
        currentQuestionId: prev ?? null,
        questionHistory: newHistory,
        phase: 'quiz',
      }
    }

    case 'COMPLETE_QUIZ':
      return {
        ...state,
        phase: 'results',
        session: {
          ...state.session,
          score: action.score,
          resultId: action.resultId,
          completedAt: Date.now(),
        },
      }

    case 'RESET':
      return {
        ...initialState,
        session: createSession(),
      }

    case 'SET_ANIMATING':
      return { ...state, isAnimating: action.value }

    default:
      return state
  }
}

// ============================================================
// CONTEXT
// ============================================================

interface QuizContextValue {
  state: QuizState
  dispatch: React.Dispatch<QuizAction>
  startQuiz: () => void
  answerQuestion: (answer: Answer, nextQuestionId: string | null) => void
  goBack: () => void
  completeQuiz: (score: number, resultId: string) => void
  resetQuiz: () => void
  setTrack: (track: Track) => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const startQuiz = useCallback(() => dispatch({ type: 'START_QUIZ' }), [])
  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), [])
  const resetQuiz = useCallback(() => dispatch({ type: 'RESET' }), [])
  const setTrack = useCallback((track: Track) => dispatch({ type: 'SET_TRACK', track }), [])

  const answerQuestion = useCallback(
    (answer: Answer, nextQuestionId: string | null) => {
      dispatch({ type: 'ANSWER_QUESTION', answer, nextQuestionId })
    },
    [],
  )

  const completeQuiz = useCallback(
    (score: number, resultId: string) => {
      dispatch({ type: 'COMPLETE_QUIZ', score, resultId })
    },
    [],
  )

  return (
    <QuizContext.Provider
      value={{ state, dispatch, startQuiz, answerQuestion, goBack, completeQuiz, resetQuiz, setTrack }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used inside QuizProvider')
  return ctx
}
