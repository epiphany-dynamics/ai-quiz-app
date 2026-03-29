import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Track } from '@/types'

// ============================================================
// SHARE URL BUILDER
// ============================================================

export function buildShareUrl(categoryId: string, score: number, track: Track): string {
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://epiphany.help'
  const params = new URLSearchParams({ r: categoryId, s: String(score), t: track })
  return `${base}/?${params.toString()}`
}

function buildShareText(score: number, label: string, track: Track): string {
  if (track === 'business') {
    return `I scored ${score}/100 on the AI Readiness Quiz — I'm a "${label}" 🚀 Find out yours:`
  }
  return `I scored ${score}/100 on the AI Readiness Quiz — I'm "${label}" 🧠 How AI-ready are you?`
}

// ============================================================
// SHARE BUTTON
// ============================================================

interface ShareBtnProps {
  icon: string
  label: string
  onClick: () => void
  color?: string
  highlight?: boolean
}

function ShareBtn({ icon, label, onClick, color, highlight }: ShareBtnProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.03 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '14px 10px',
        borderRadius: 'var(--radius-lg)',
        background: highlight ? (color ? `${color}20` : 'rgba(240,239,235,0.08)') : 'var(--color-bg-card)',
        border: `1px solid ${highlight && color ? `${color}40` : 'var(--color-border-default)'}`,
        cursor: 'pointer',
        flex: 1,
        minWidth: 70,
      }}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </motion.button>
  )
}

// ============================================================
// SHARE PANEL
// ============================================================

interface SharePanelProps {
  categoryId: string
  categoryLabel: string
  score: number
  track: Track
  color: string
}

export function SharePanel({ categoryId, categoryLabel, score, track, color }: SharePanelProps) {
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const shareUrl = buildShareUrl(categoryId, score, track)
  const shareText = buildShareText(score, categoryLabel, track)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setStatus('Link copied!')
      setTimeout(() => { setCopied(false); setStatus(null) }, 2200)
    } catch {
      const el = document.createElement('input')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setStatus('Link copied!')
      setTimeout(() => { setCopied(false); setStatus(null) }, 2200)
    }
  }

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setStatus('Opening Twitter/X…')
    setTimeout(() => setStatus(null), 2000)
  }

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setStatus('Opening Facebook…')
    setTimeout(() => setStatus(null), 2000)
  }

  const handleSMS = () => {
    const body = encodeURIComponent(`${shareText}\n${shareUrl}`)
    window.location.href = `sms:?body=${body}`
    setStatus('Opening Messages…')
    setTimeout(() => setStatus(null), 2000)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `I'm a ${categoryLabel}!`, text: shareText, url: shareUrl })
      } catch {
        // user cancelled
      }
    }
  }

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      {/* Score result preview pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px',
          background: `${color}12`,
          border: `1px solid ${color}30`,
          borderRadius: 'var(--radius-full)',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <span style={{ fontWeight: 700, color }}>📊 {score}/100</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>{categoryLabel}</span>
        <span style={{ opacity: 0.5, marginLeft: 'auto', fontSize: '0.75rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {shareUrl.replace('https://', '')}
        </span>
      </div>

      {/* Share buttons row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <ShareBtn
          icon={copied ? '✅' : '🔗'}
          label={copied ? 'Copied!' : 'Copy Link'}
          onClick={handleCopy}
          color={color}
          highlight={copied}
        />
        <ShareBtn icon="𝕏" label="Twitter/X" onClick={handleTwitter} />
        <ShareBtn icon="💬" label="Text/SMS" onClick={handleSMS} />
        <ShareBtn icon="👥" label="Facebook" onClick={handleFacebook} />
        {hasNativeShare && (
          <ShareBtn icon="📤" label="More…" onClick={handleNativeShare} color={color} highlight />
        )}
      </div>

      {/* Status toast */}
      <AnimatePresence>
        {status && (
          <motion.p
            key={status}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: '0.8rem',
              color,
              textAlign: 'center',
              margin: 0,
              fontWeight: 500,
            }}
          >
            {status}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Social proof note */}
      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>
        When friends click your link, they'll see your result first 👀 then take the quiz
      </p>
    </motion.div>
  )
}
