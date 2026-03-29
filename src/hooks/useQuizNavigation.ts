import { useState, useEffect, useCallback } from 'react'
import { useQuiz } from '@/context/QuizContext'
import { loadQuestionsForTrack, ENTRY_QUESTION } from '@/data'
import { getNextQuestionId, resolveVariantQuestion, estimateVisibleQuestions } from '@/lib'
import type { Question, Answer, Track } from '@/types'

export function useQuizNavigation() {
  const { state, answerQuestion, setTrack, completeQuiz } = useQuiz()
  const [questions, setQuestions] = useState<Question[]>([ENTRY_QUESTION])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(ENTRY_QUESTION)

  // Load questions when track is known
  useEffect(() => {
    if (!state.session.track) return
    loadQuestionsForTrack(state.session.track).then(trackQuestions => {
      setQuestions([ENTRY_QUESTION, ...trackQuestions])
    })
  }, [state.session.track])

  // Sync current question from state — resolve variants if needed
  useEffect(() => {
    if (!state.currentQuestionId) {
      setCurrentQuestion(null)
      return
    }
    const q = questions.find(q => q.id === state.currentQuestionId) ?? null
    if (!q) {
      setCurrentQuestion(null)
      return
    }
    // Resolve industry/context variants for questions like A7
    if (q.variants) {
      setCurrentQuestion(resolveVariantQuestion(q, state.session.answers, questions))
    } else {
      setCurrentQuestion(q)
    }
  }, [state.currentQuestionId, questions, state.session.answers])

  const submitAnswer = useCallback(
    async (answer: Answer) => {
      if (!currentQuestion) return

      // Handle track routing from entry gate
      if (currentQuestion.type === 'entry_gate') {
        const track = answer.value as Track
        setTrack(track)

        const trackQuestions = await loadQuestionsForTrack(track)
        const allQuestions = [ENTRY_QUESTION, ...trackQuestions]
        setQuestions(allQuestions)

        const nextId = getNextQuestionId(
          currentQuestion,
          answer,
          allQuestions,
          state.session.answers,
        )
        answerQuestion(answer, nextId)
        return
      }

      const nextId = getNextQuestionId(
        currentQuestion,
        answer,
        questions,
        state.session.answers,
      )
      answerQuestion(answer, nextId)
    },
    [currentQuestion, questions, answerQuestion, setTrack, state.session.answers, completeQuiz],
  )

  // Dynamic progress: count visible questions remaining
  const answeredCount = state.questionHistory.length
  const trackQuestions = questions.filter(q => q.track === state.session.track)
  const visibleTotal = estimateVisibleQuestions(trackQuestions, state.session.answers)
  const totalEstimate = Math.max(visibleTotal, answeredCount + 1)
  const progressPct = Math.min(Math.round((answeredCount / totalEstimate) * 100), 95)

  return {
    currentQuestion,
    questions,
    submitAnswer,
    progress: answeredCount,
    progressPct,
    canGoBack: state.questionHistory.length > 0,
  }
}
