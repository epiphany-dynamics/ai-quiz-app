import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuiz } from '@/context/QuizContext'
import { loadQuestionsForTrack, loadResults } from '@/data'
import { computeBusinessScore, computeGeneralScore, getResultCategory } from '@/lib'

const STEPS = [
  'Analyzing your responses…',
  'Calculating your score…',
  'Building your insights…',
  'Almost done…',
]

export function CalculatingScreen() {
  const { state, completeQuiz } = useQuiz()

  useEffect(() => {
    async function calculate() {
      const { session } = state
      if (!session.track) return

      const [questions, results] = await Promise.all([
        loadQuestionsForTrack(session.track),
        loadResults(),
      ])

      const score =
        session.track === 'business'
          ? computeBusinessScore(session, questions)
          : computeGeneralScore(session, questions)

      const categories =
        session.track === 'business'
          ? results.paths.business.categories
          : results.paths.general.categories

      const category = getResultCategory(score, categories)
      const resultId = category?.id ?? 'unknown'

      // Artificial delay for the dramatic effect
      await new Promise(r => setTimeout(r, 2800))
      completeQuiz(score, resultId)
    }

    calculate()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      className="quiz-container flex flex-col items-center justify-center min-h-dvh gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated rings */}
      <div className="relative w-24 h-24">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid',
              borderColor: 'rgba(240, 239, 235, 0.25)',
            }}
            animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeOut',
            }}
          />
        ))}
        <div
          className="absolute inset-0 flex items-center justify-center text-4xl rounded-full"
          style={{ background: 'rgba(240, 239, 235, 0.05)' }}
        >
          🧠
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col items-center gap-3">
        {STEPS.map((step, i) => (
          <motion.p
            key={step}
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0, 1, 0.5] }}
            transition={{
              delay: i * 0.7,
              duration: 0.8,
              times: [0, 0.3, 1],
            }}
          >
            {step}
          </motion.p>
        ))}
      </div>
    </motion.div>
  )
}
