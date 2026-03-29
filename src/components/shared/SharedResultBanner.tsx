import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SharedResult } from '@/hooks/useSharedResult'

const CATEGORY_META: Record<string, { label: string; emoji: string; color: string }> = {
  ai_ready_operator:  { label: 'AI-Ready Operator',      emoji: '🚀', color: '#10B981' },
  ai_curious_builder: { label: 'AI-Curious Builder',     emoji: '⚡', color: '#3B82F6' },
  ai_aware_explorer:  { label: 'AI-Aware Explorer',      emoji: '🔍', color: '#F59E0B' },
  ai_newcomer:        { label: 'AI Newcomer',             emoji: '🌱', color: '#a1a1aa' },
  trailblazer:        { label: 'The Trailblazer',         emoji: '🔥', color: '#10B981' },
  explorer:           { label: 'The Explorer',            emoji: '🧭', color: '#3B82F6' },
  skeptic:            { label: 'The Thoughtful Skeptic',  emoji: '🤔', color: '#F59E0B' },
  fresh_start:        { label: 'The Fresh Start',         emoji: '✨', color: '#a1a1aa' },
}

interface SharedResultBannerProps {
  shared: SharedResult
  onDismiss: () => void
}

export function SharedResultBanner({ shared, onDismiss }: SharedResultBannerProps) {
  const [visible, setVisible] = useState(true)
  const meta = CATEGORY_META[shared.categoryId]

  if (!meta) return null

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{
            position: 'fixed',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            width: 'min(calc(100vw - 32px), 480px)',
            background: 'rgba(5, 5, 5, 0.92)',
            border: `1px solid ${meta.color}40`,
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px',
            backdropFilter: 'blur(12px)',
            boxShadow: `0 4px 32px rgba(0,0,0,0.6), 0 0 0 1px ${meta.color}20`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Score badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: `${meta.color}20`,
                border: `2px solid ${meta.color}60`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {meta.emoji}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                Someone shared their result with you 👀
              </p>
              <p style={{ margin: 0, marginTop: 2, fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                <span style={{ color: meta.color }}>{shared.score}/100</span>
                {' — '}
                {meta.label} {meta.emoji}
              </p>
              <p style={{ margin: 0, marginTop: 2, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Take the quiz to see how you compare ↓
              </p>
            </div>

            {/* Close */}
            <button
              onClick={handleDismiss}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                fontSize: 18,
                padding: '4px',
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
