import { motion } from 'framer-motion'
import { useQuiz } from '@/context/QuizContext'

const FEATURES = [
  { icon: 'bolt', text: 'Fast diagnostic' },
  { icon: 'target', text: 'Personalized roadmap' },
  { icon: 'chart', text: 'Actionable next steps' },
]

function FeatureIcon({ type }: { type: string }) {
  if (type === 'target') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 feature-icon">
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.25" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    )
  }

  if (type === 'chart') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 feature-icon">
        <path d="M5 19V9M12 19V5M19 19v-7" />
        <path d="M4 19h16" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 feature-icon">
      <path d="M13 2L5 13h6l-1 9 8-12h-6l1-8z" />
    </svg>
  )
}

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
      {/* Watermark logo background */}
      <div className="watermark-bg-container">
        <img
          src="/images/logos/new_geometric_mark.png"
          alt=""
          className="watermark-logo"
        />
      </div>

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
            background: 'var(--color-accent-ink)',
            boxShadow: 'var(--shadow-dot-glow)',
          }}
        />
        <span style={{ color: 'var(--color-text-readable)' }}>Free AI readiness check</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="text-glow mb-5 leading-none"
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 3.75rem)',
          fontWeight: 700,
          textWrap: 'balance',
          letterSpacing: '-0.04em',
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        What's Your{' '}
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>AI Readiness</span>
          <motion.span
            style={{
              position: 'absolute',
              bottom: '0.04em',
              left: '-2%',
              right: '-2%',
              height: '0.1em',
              background: 'var(--gradient-underline)',
              borderRadius: '0.1em',
              zIndex: 0,
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>{' '}
        Score?
      </motion.h1>

      {/* Sub */}
      <motion.p
        className="text-lg mb-10 max-w-md"
        style={{
          color: 'var(--color-text-readable)',
          lineHeight: 1.7,
          textWrap: 'pretty',
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        Find out where AI fits in your business and get a personalized roadmap for your next automation win.
      </motion.p>

      {/* Feature pills — staggered entry */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-10"
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
            className="feature-pill flex items-center gap-2 px-4 py-2 rounded-full text-sm card-glass"
            style={{ color: 'var(--color-text-readable)' }}
            variants={{
              hidden: { opacity: 0, y: 12, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <FeatureIcon type={f.icon} />
            {f.text}
          </motion.span>
        ))}
      </motion.div>

      {/* CTA — pill-shaped cream button */}
      <motion.button
        id="start-quiz"
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

      {/* Social proof */}
      <motion.p
        className="mt-4 text-sm"
        style={{ color: 'var(--color-text-readable)', letterSpacing: '0.02em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.82 }}
        transition={{ delay: 1.05 }}
      >
        No email required · Instant results
      </motion.p>

      {/* Secondary path — free audit */}
      <motion.a
        href="https://epiphanydynamics.ai/book"
        className="quiz-secondary-link mt-5"
        style={{ textDecoration: 'none' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
      >
        Prefer a call? Book a free audit →
      </motion.a>
    </motion.div>
  )
}
