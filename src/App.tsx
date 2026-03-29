import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { QuizProvider, useQuiz } from '@/context/QuizContext'
import { LandingScreen, QuizScreen, CalculatingScreen } from '@/components/quiz'
import { ResultsScreen } from '@/components/results'
import { SharedResultBanner } from '@/components/shared/SharedResultBanner'
import { useSharedResult } from '@/hooks/useSharedResult'

function QuizApp() {
  const { state } = useQuiz()
  const sharedResult = useSharedResult()
  const [bannerDismissed, setBannerDismissed] = useState(false)

  return (
    <div
      style={{
        background: 'var(--color-bg-base)',
        minHeight: '100dvh',
      }}
    >
      {/* Social proof banner — shown when visiting a shared result link */}
      {sharedResult && !bannerDismissed && state.phase === 'landing' && (
        <SharedResultBanner shared={sharedResult} onDismiss={() => setBannerDismissed(true)} />
      )}

      <AnimatePresence mode="wait">
        {state.phase === 'landing' && <LandingScreen key="landing" />}
        {state.phase === 'quiz' && <QuizScreen key="quiz" />}
        {state.phase === 'calculating' && <CalculatingScreen key="calculating" />}
        {state.phase === 'results' && <ResultsScreen key="results" />}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <QuizProvider>
      <QuizApp />
    </QuizProvider>
  )
}
