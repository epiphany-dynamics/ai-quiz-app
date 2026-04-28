import { motion } from 'framer-motion'
import { useQuiz } from '@/context/QuizContext'

const FEATURES = [
  { emoji: '⚡', text: '3 minutes or less' },
  { emoji: '🎯', text: 'Personalized to your situation' },
  { emoji: '📊', text: 'Actionable score & insights' },
]

export function LandingScreen() {
  const { startQuiz } = useQuiz()

  return (
    <motion.div
      className="quiz-container ambient-glow flex flex-col items-center justify-center min-h-dvh py-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Badge */}
      <motion.div
        className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium card-glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{
            background: 'var(--color-bg-cream)',
            boxShadow: '0 0 8px rgba(240, 239, 235, 0.5)',
          }}
        />
        <span style={{ color: 'var(--color-text-secondary)' }}>Free · Takes 3 minutes</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="text-glow mb-5 leading-none"
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: 400,
          textWrap: 'balance',
          letterSpacing: '-0.02em',
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        What's Your{' '}
        <em style={{ fontStyle: 'italic', opacity: 0.85 }}>AI Readiness Score?</em>
      </motion.h1>

      {/* Sub */}
      <motion.p
        className="text-lg mb-10 max-w-md"
        style={{
          color: 'var(--color-text-secondary)',
          lineHeight: 1.7,
          textWrap: 'pretty',
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        Find out exactly where AI fits in your business or daily life
        and get a personalized roadmap in under 3 minutes.
      </motion.p>

      {/* Feature pills — staggered entry */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-12"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.6 } },
        }}
      >
        {FEATURES.map(f => (
          <motion.span
            key={f.text}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm card-glass"
            style={{ color: 'var(--color-text-secondary)' }}
            variants={{
              hidden: { opacity: 0, y: 12, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>{f.emoji}</span>
            {f.text}
          </motion.span>
        ))}
      </motion.div>

      {/* CTA — pill-shaped cream button */}
      <motion.button
        className="btn-primary text-lg px-12 py-4"
        onClick={startQuiz}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        Start the Quiz
      </motion.button>

      {/* Secondary path — book a call */}
      <motion.a
        href="https://epiphanydynamics.ai/book"
        className="btn-secondary mt-5"
        style={{ textDecoration: 'none' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
      >
        Rather talk to someone? Book a free call
      </motion.a>

      {/* Social proof */}
      <motion.p
        className="mt-6 text-sm"
        style={{ color: 'var(--color-text-muted)', letterSpacing: '0.02em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.05 }}
      >
        No email required · Instant results
      </motion.p>
    </motion.div>
  )
}
