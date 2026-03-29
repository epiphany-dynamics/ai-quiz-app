import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useQuiz } from '@/context/QuizContext'
import { useQuizNavigation } from '@/hooks'
import { MilestoneCelebration } from '@/components/shared'
import { QuestionCard } from './QuestionCard'

/** Show a micro-celebration every N correctly answered questions */
const MILESTONE_EVERY = 5

export function QuizScreen() {
  const { state, goBack } = useQuiz()
  const { currentQuestion, submitAnswer, progressPct, canGoBack } = useQuizNavigation()

  // Milestone celebration state
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestoneIndex, setMilestoneIndex] = useState(0)
  const prevAnsweredRef = useRef(0)

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false)
  }, [])

  // Detect milestone crossings
  useEffect(() => {
    const answered = state.questionHistory.length
    const prev = prevAnsweredRef.current

    if (answered > prev && answered > 0 && answered % MILESTONE_EVERY === 0) {
      setMilestoneIndex(m => m + 1)
      setShowCelebration(true)
    }

    prevAnsweredRef.current = answered
  }, [state.questionHistory.length])

  if (!currentQuestion) return null

  return (
    <>
      <AnimatePresence mode="wait">
        <QuestionCard
          key={state.currentQuestionId ?? 'question'}
          question={currentQuestion}
          onAnswer={submitAnswer}
          onBack={goBack}
          canGoBack={canGoBack}
          progressPct={progressPct}
          questionNumber={state.questionHistory.length + 1}
        />
      </AnimatePresence>

      {/* Milestone micro-celebration overlay */}
      <MilestoneCelebration
        show={showCelebration}
        milestoneIndex={milestoneIndex}
        onComplete={dismissCelebration}
      />
    </>
  )
}
