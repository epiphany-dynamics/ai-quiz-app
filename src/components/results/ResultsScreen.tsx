import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '@/context/QuizContext'
import { loadResults } from '@/data'
import { getResultCategory, saveEmailCapture, saveQuizResult } from '@/lib'
import type { ResultCategory } from '@/types'
import { ScoreRing } from './ScoreRing'
import { SharePanel } from './SharePanel'
import { ConfettiParticles } from '@/components/shared'

// ============================================================
// OG META TAG UPDATER
// ============================================================

function updateOGMetaTags(categoryId: string, label: string, tagline: string, score: number) {
  const base = window.location.origin
  const ogImageUrl = `${base}/og/${categoryId}.svg`
  const title = `I scored ${score}/100 — ${label} | AI Readiness Quiz`
  const description = tagline

  const setMeta = (selector: string, attr: string, value: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null
    if (!el) {
      el = document.createElement('meta')
      document.head.appendChild(el)
    }
    el.setAttribute(attr, value)
  }

  document.title = title
  setMeta('meta[property="og:title"]', 'content', title)
  setMeta('meta[property="og:description"]', 'content', description)
  setMeta('meta[property="og:image"]', 'content', ogImageUrl)
  setMeta('meta[name="twitter:title"]', 'content', title)
  setMeta('meta[name="twitter:description"]', 'content', description)
  setMeta('meta[name="twitter:image"]', 'content', ogImageUrl)
  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image')
}

// ============================================================
// EMAIL CAPTURE
// ============================================================

async function submitEmailCapture(email: string, resultId: string, score: number, categoryId: string): Promise<void> {
  await saveEmailCapture({ email, result_id: resultId, result_category_id: categoryId, score, opted_in: true })
}

// ============================================================
// INSIGHT CARD
// ============================================================

interface InsightCardProps {
  title: string
  body: string
  color: string
  index: number
  icon: string
}

function InsightCard({ title, body, color, index, icon }: InsightCardProps) {
  return (
    <motion.div
      style={{
        background: 'var(--color-bg-card)',
        border: `1px solid ${color}30`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px 20px 20px 16px',
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 + index * 0.15, ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: 3,
          borderRadius: 2,
          background: color,
          alignSelf: 'stretch',
          flexShrink: 0,
          boxShadow: `0 0 8px ${color}60`,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <h3 style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', margin: 0, fontFamily: 'League Spartan, sans-serif' }}>
            {title}
          </h3>
        </div>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: 0 }}>
          {body}
        </p>
      </div>
    </motion.div>
  )
}

// ============================================================
// EMAIL CAPTURE FORM
// ============================================================

interface EmailFormProps {
  resultId: string
  categoryId: string
  score: number
  tierLabel: string
  tierTagline: string
  track: string
  insightCards: Array<{ title: string; body: string }>
  answers: Record<string, string | string[] | number>
}

function EmailForm({ resultId, categoryId, score, tierLabel, tierTagline, track, insightCards, answers }: EmailFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!email.includes('@')) return
      setStatus('submitting')
      try {
        // Save to Supabase (non-blocking)
        submitEmailCapture(email, resultId, score, categoryId)

        // Send results email to user + notify Patrick
        const res = await fetch('/api/submit-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            score,
            tier: categoryId,
            tierLabel,
            tierTagline,
            track,
            insightCards: insightCards.slice(0, 3),
            answers,
          }),
        })

        if (!res.ok) throw new Error('Email send failed')
        setStatus('done')
      } catch {
        setStatus('error')
      }
    },
    [email, resultId, score, categoryId, tierLabel, tierTagline, track, insightCards, answers],
  )

  if (status === 'done') {
    return (
      <motion.div
        style={{ textAlign: 'center', padding: '16px 0' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <span style={{ fontSize: 32 }}>✅</span>
        <p style={{ marginTop: 8, fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Check your inbox — your results just landed
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
          Sent to {email}
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={status === 'submitting'}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-default)',
            color: 'var(--color-text-primary)',
            fontSize: '0.9rem',
            outline: 'none',
            fontFamily: 'Poppins, sans-serif',
          }}
        />
        <motion.button
          type="submit"
          className="btn-primary"
          disabled={status === 'submitting' || !email}
          whileTap={{ scale: 0.96 }}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {status === 'submitting' ? 'Sending...' : 'Send my results'}
        </motion.button>
      </div>
      {status === 'error' && (
        <p style={{ fontSize: '0.8rem', color: '#f87171', margin: 0 }}>
          Something went wrong — try again.
        </p>
      )}
    </form>
  )
}

// ============================================================
// INSIGHT CARD ICONS
// ============================================================
const CARD_ICONS = ['💡', '⚡', '🎯', '🚀', '🔥', '🧠']

// ============================================================
// RESULTS SCREEN
// ============================================================

export function ResultsScreen() {
  const { state, resetQuiz } = useQuiz()
  const [category, setCategory] = useState<ResultCategory | null>(null)
  const [savedResultId, setSavedResultId] = useState<string | null>(null)
  const [showShare, setShowShare] = useState(false)
  const [burstDone, setBurstDone] = useState(false)

  const { score, resultId, track } = state.session

  // Build flat answers map for the email report API
  const answersMap: Record<string, string | string[] | number> = {}
  state.session.answers.forEach(a => { answersMap[a.questionId] = a.value })

  useEffect(() => {
    if (!track || score === undefined) return
    loadResults().then(async results => {
      const categories =
        track === 'business' ? results.paths.business.categories : results.paths.general.categories
      const cat = getResultCategory(score, categories)
      setCategory(cat)
      if (cat) {
        updateOGMetaTags(cat.id, cat.label, cat.tagline, score)
        const fallbackId = typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
        const dbId = await saveQuizResult({
          session_id: resultId ?? fallbackId,
          track,
          score,
          result_category_id: cat.id,
          result_category_label: cat.label,
          answers: state.session.answers,
        })
        setSavedResultId(dbId)
      }
    })
  }, [track, score, resultId, state.session.answers])

  useEffect(() => {
    const t = setTimeout(() => setBurstDone(true), 1500)
    return () => clearTimeout(t)
  }, [])

  if (!category || score === undefined) return null

  return (
    <motion.div
      style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Confetti burst */}
      {!burstDone && (
        <div
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            zIndex: 80,
            pointerEvents: 'none',
          }}
        >
          <ConfettiParticles count={36} spread={280} originX={0} originY={0} />
        </div>
      )}

      <div className="quiz-container py-10 flex flex-col gap-8">

        {/* Score Header */}
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20 }}
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScoreRing score={score} color={category.color} />

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 180, damping: 18 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4 }}>
              <motion.span
                style={{ fontSize: 36 }}
                animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {category.badge_emoji}
              </motion.span>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{category.label}</h1>
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: category.color, margin: 0 }}>
              {category.tagline}
            </p>
          </motion.div>

          <motion.p
            style={{ fontSize: '1rem', maxWidth: 420, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {category.description}
          </motion.p>
        </motion.div>

        {/* Insight Cards */}
        <div>
          <motion.h2
            style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, marginBottom: 14 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            Your AI Opportunity Breakdown
          </motion.h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {category.insight_cards.slice(0, 3).map((card, i) => (
              <InsightCard
                key={card.id}
                title={card.title}
                body={card.body}
                color={category.color}
                index={i}
                icon={CARD_ICONS[i % CARD_ICONS.length]}
              />
            ))}
          </div>
        </div>

        {/* Share — positioned above CTA while dopamine is fresh */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <motion.button
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setShowShare(s => !s)}
            whileTap={{ scale: 0.96 }}
          >
            {showShare ? '✕ Close' : '📤 Share your score'}
          </motion.button>

          <AnimatePresence>
            {showShare && category && score !== undefined && track && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="card" style={{ marginBottom: 0 }}>
                  <SharePanel
                    categoryId={category.id}
                    categoryLabel={category.label}
                    score={score}
                    track={track}
                    color={category.color}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tier-aware CTA — warm leads get call, cool leads get email nurture */}
        {/* Warm = top 2 tiers of either track → Calendly first */}
        {(category.id === 'ai_ready_operator' || category.id === 'ai_curious_builder' || category.id === 'trailblazer' || category.id === 'explorer') ? (
          <>
            {/* WARM: Calendly CTA first */}
            <motion.div
              style={{
                background: 'linear-gradient(135deg, rgba(240,239,235,0.06) 0%, rgba(240,239,235,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: '0 0 30px rgba(240,239,235,0.04)',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, marginTop: 0 }}>
                {category.id === 'ai_ready_operator'
                  ? "Let's build your AI stack"
                  : category.id === 'trailblazer'
                    ? 'Take your AI game to the next level'
                    : 'Ready to find your first win?'}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 18, marginTop: 0 }}>
                {category.id === 'ai_ready_operator'
                  ? "You're ready to move. A 15-minute call maps the fastest path from where you are to a fully automated operation."
                  : category.id === 'trailblazer'
                    ? "You're ahead of 95% of people. A quick chat about advanced AI workflows and personal automation could unlock your next level."
                    : "A free 15-minute AI workflow review finds the one thing that'll save you the most time this month."}
              </p>
              <motion.a
                href="https://epiphanydynamics.ai/book"
                className="btn-primary"
                style={{ display: 'inline-flex', textDecoration: 'none' }}
                whileTap={{ scale: 0.97 }}
              >
                Book free call
              </motion.a>
            </motion.div>

            {/* WARM: Email as secondary */}
            <motion.div
              style={{
                background: 'rgba(240, 239, 235, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15 }}
            >
              <p style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: 10, marginTop: 0, color: 'var(--color-text-secondary)' }}>
                Not ready for a call? Get your detailed breakdown by email instead.
              </p>
              <EmailForm resultId={savedResultId ?? ''} categoryId={category.id} score={score} tierLabel={category.label} tierTagline={category.tagline} track={track!} insightCards={category.insight_cards} answers={answersMap} />
            </motion.div>
          </>
        ) : (
          <>
            {/* COOL: Email capture first */}
            <motion.div
              style={{
                background: 'linear-gradient(135deg, rgba(240,239,235,0.06) 0%, rgba(240,239,235,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                boxShadow: '0 0 30px rgba(240,239,235,0.04)',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4, marginTop: 0 }}>
                {(category.id === 'ai_newcomer' || category.id === 'fresh_start')
                  ? 'Get your personal AI starter guide'
                  : 'Get your custom AI roadmap'}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 14, marginTop: 0 }}>
                {(category.id === 'ai_newcomer' || category.id === 'fresh_start')
                  ? "We'll send you 3 specific things to try this week based on your answers — no jargon, no pressure."
                  : "We'll send a custom breakdown of the 3 best AI starting points for your situation — no spam, one email."}
              </p>
              <EmailForm resultId={savedResultId ?? ''} categoryId={category.id} score={score} tierLabel={category.label} tierTagline={category.tagline} track={track!} insightCards={category.insight_cards} answers={answersMap} />
            </motion.div>

            {/* COOL: Soft Calendly nudge as secondary */}
            <motion.div
              style={{
                textAlign: 'center',
                padding: '12px 0',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 8, marginTop: 0 }}>
                Want to talk through your results with a real person?
              </p>
              <motion.a
                href="https://epiphanydynamics.ai/book"
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-bg-cream)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Book a free 15-min chat
              </motion.a>
            </motion.div>
          </>
        )}

        {/* Retake */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <motion.button
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={resetQuiz}
            whileTap={{ scale: 0.96 }}
          >
            Retake quiz
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.footer
          style={{
            textAlign: 'center',
            paddingBottom: 24,
            marginTop: 8,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Built by{' '}
            <a
              href="https://epiphanydynamics.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-bg-cream)', textDecoration: 'none' }}
            >
              Epiphany Dynamics
            </a>{' '}
            · AI Automation for Modern Business
          </p>
        </motion.footer>

      </div>
    </motion.div>
  )
}
