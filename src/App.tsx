import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { QuizProvider, useQuiz } from '@/context/QuizContext'
import { LandingScreen, QuizScreen, CalculatingScreen } from '@/components/quiz'
import { ResultsScreen } from '@/components/results'
import { SharedResultBanner } from '@/components/shared/SharedResultBanner'
import { useSharedResult } from '@/hooks/useSharedResult'
import { SiteNavbar } from '@/components/site/SiteNavbar'
import { SiteFooter } from '@/components/site/SiteFooter'
import { MagneticCursor } from '@/components/ui/magnetic-cursor'

function QuizApp() {
  const { state } = useQuiz()
  const sharedResult = useSharedResult()
  const [bannerDismissed, setBannerDismissed] = useState(false)

  return (
    <div
      style={{
        background: 'var(--color-bg-base)',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SiteNavbar />

      {/* Social proof banner — shown when visiting a shared result link */}
      {sharedResult && !bannerDismissed && state.phase === 'landing' && (
        <SharedResultBanner shared={sharedResult} onDismiss={() => setBannerDismissed(true)} />
      )}

      <div style={{ flex: 1, paddingTop: '76px' }}>
        <AnimatePresence mode="wait">
          {state.phase === 'landing' && <LandingScreen key="landing" />}
          {state.phase === 'quiz' && <QuizScreen key="quiz" />}
          {state.phase === 'calculating' && <CalculatingScreen key="calculating" />}
          {state.phase === 'results' && <ResultsScreen key="results" />}
        </AnimatePresence>
      </div>

      {/* Footer only shows on landing and results — not during quiz flow */}
      {(state.phase === 'landing' || state.phase === 'results') && (
        <SiteFooter />
      )}
    </div>
  )
}

export default function App() {
  return (
    <QuizProvider>
      <MagneticCursor
        globalTargets
        scopeSelector="body"
        cursorSize={37.5}
        magneticFactor={0.2}
        hoverPadding={6}
        contrastBoost={1}
        blendMode="exclusion"
      >
        <QuizApp />
      </MagneticCursor>
    </QuizProvider>
  )
}
