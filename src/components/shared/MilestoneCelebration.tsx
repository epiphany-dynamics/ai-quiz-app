import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConfettiParticles } from './ConfettiParticles'

const MILESTONE_MESSAGES = [
  { emoji: '🔥', text: "You're on fire!" },
  { emoji: '⚡', text: 'Keep crushing it!' },
  { emoji: '🚀', text: 'Halfway there!' },
  { emoji: '💡', text: 'Getting warmer…' },
  { emoji: '🎯', text: 'Locked in!' },
]

interface MilestoneCelebrationProps {
  show: boolean
  milestoneIndex: number
  onComplete: () => void
  duration?: number
}

export function MilestoneCelebration({
  show,
  milestoneIndex,
  onComplete,
  duration = 1400,
}: MilestoneCelebrationProps) {
  const msg = MILESTONE_MESSAGES[milestoneIndex % MILESTONE_MESSAGES.length]

  useEffect(() => {
    if (!show) return
    const t = setTimeout(onComplete, duration)
    return () => clearTimeout(t)
  }, [show, duration, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Confetti burst from center */}
          <div style={{ position: 'relative' }}>
            <ConfettiParticles count={28} spread={220} />

            {/* Central badge */}
            <motion.div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '20px 32px',
                borderRadius: 20,
                background: 'rgba(5, 5, 5, 0.9)',
                border: '1px solid rgba(240, 239, 235, 0.2)',
                boxShadow: '0 0 40px rgba(240, 239, 235, 0.15)',
                backdropFilter: 'blur(12px)',
              }}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.1, 1.0], opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                style={{ fontSize: 48, lineHeight: 1 }}
                animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {msg.emoji}
              </motion.span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#f0f0f0',
                  letterSpacing: '-0.01em',
                  fontFamily: 'Instrument Serif, Georgia, serif',
                }}
              >
                {msg.text}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
