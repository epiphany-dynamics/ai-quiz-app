import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Question, Answer } from '@/types'

interface QuestionCardProps {
  question: Question
  onAnswer: (answer: Answer) => void
  onBack: () => void
  canGoBack: boolean
  progressPct: number
  questionNumber: number
  onTap?: () => void
}

export function QuestionCard({
  question,
  onAnswer,
  onBack,
  canGoBack,
  progressPct,
  questionNumber,
  onTap,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | string[] | null>(null)
  const [followUpValue, setFollowUpValue] = useState('')
  const [confirming, setConfirming] = useState<string | null>(null)

  const handleOptionClick = useCallback(
    (value: string) => {
      onTap?.()

      if (question.type === 'multi_select') {
        setSelected(prev => {
          const arr = Array.isArray(prev) ? prev : []
          const max = question.max_selections ?? 99
          if (arr.includes(value)) return arr.filter(v => v !== value)
          if (arr.length >= max) return arr
          return [...arr, value]
        })
      } else {
        setSelected(value)
        const option = question.options?.find(o => o.value === value)
        const hasFollowUp = !!option?.follow_up

        if (question.type === 'entry_gate') {
          setConfirming(value)
          setTimeout(() => {
            onAnswer({ questionId: question.id, value, track: question.track })
          }, 220)
        } else if (!hasFollowUp) {
          setConfirming(value)
          setTimeout(() => {
            onAnswer({
              questionId: question.id,
              value,
              track: question.track,
              tags: question.tags,
            })
          }, 280)
        }
      }
    },
    [question, onAnswer, onTap],
  )

  const handleSubmit = useCallback(() => {
    if (!selected) return
    onAnswer({
      questionId: question.id,
      value: selected,
      followUpValue: followUpValue || undefined,
      track: question.track,
      tags: question.tags,
    })
  }, [selected, followUpValue, question, onAnswer])

  const isEntryGate = question.type === 'entry_gate'
  const isMulti = question.type === 'multi_select'
  const isScale = question.type === 'scale'
  const isScenario = question.layout === 'scenario_cards'
  const hasOptions = question.options && question.options.length > 0
  const scaleMin = question.scale?.min ?? 1
  const scaleDefault = String(Math.round((scaleMin + (question.scale?.max ?? 10)) / 2))

  return (
    <motion.div
      key={question.id}
      className="quiz-container py-8 flex flex-col min-h-dvh"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.28, ease: [0.2, 0.21, 0, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {canGoBack ? (
          <motion.button
            className="btn-ghost"
            onClick={onBack}
            whileTap={{ scale: 0.93 }}
          >
            ← Back
          </motion.button>
        ) : (
          <div />
        )}
        <motion.span
          className="text-sm font-mono"
          style={{ color: 'var(--color-text-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Q{questionNumber}
        </motion.span>
      </div>

      {/* Progress bar */}
      {!isEntryGate && (
        <div className="progress-track mb-8">
          <motion.div
            className="progress-fill"
            initial={{ width: `${Math.max(progressPct - 12, 0)}%` }}
            animate={{ width: `${progressPct}%` }}
            transition={{
              type: 'spring',
              stiffness: 90,
              damping: 18,
              mass: 0.8,
            }}
          />
        </div>
      )}

      {/* Question text */}
      <div className="mb-8 flex-1">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold mb-2 leading-snug"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, ease: 'easeOut' }}
        >
          {question.question}
        </motion.h2>
        {(question.sub_text || question.subtitle) && (
          <motion.p
            className="text-sm mt-2"
            style={{ color: 'var(--color-text-muted)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.14 }}
          >
            {question.sub_text ?? question.subtitle}
          </motion.p>
        )}
        {isMulti && (
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {question.max_selections
              ? `Pick up to ${question.max_selections}`
              : 'Select all that apply'}
          </p>
        )}

        {/* Options — standard list/grid */}
        {hasOptions && !isScenario && (
          <motion.div
            className={`mt-6 ${
              question.layout === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'
            } ${isEntryGate ? 'flex flex-col gap-4' : ''}`}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.055 } },
            }}
          >
            {question.options!.map(option => {
              const isSelected = Array.isArray(selected)
                ? selected.includes(option.value)
                : selected === option.value
              const isConfirming = confirming === option.value

              return (
                <motion.div
                  key={option.value}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { ease: 'easeOut' } },
                  }}
                >
                  <motion.button
                    className={`card-interactive w-full text-left ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(option.value)}
                    whileTap={{ scale: 0.96 }}
                    animate={
                      isConfirming
                        ? { scale: [1, 1.035, 1.0] }
                        : isSelected
                          ? { scale: [0.97, 1.0] }
                          : { scale: 1 }
                    }
                    transition={
                      isConfirming
                        ? { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                        : { duration: 0.15 }
                    }
                    style={
                      isConfirming
                        ? {
                            borderColor: 'rgba(240, 239, 235, 0.6)',
                            boxShadow: '0 0 32px rgba(240, 239, 235, 0.2)',
                            background: 'rgba(240, 239, 235, 0.06)',
                          }
                        : isSelected && !isEntryGate
                          ? {
                              borderColor: 'rgba(240, 239, 235, 0.4)',
                              boxShadow: '0 0 20px rgba(240, 239, 235, 0.12)',
                            }
                          : {}
                    }
                  >
                    <div className="flex items-center gap-3">
                      {option.emoji && (
                        <motion.span
                          className="text-2xl leading-none"
                          animate={isConfirming ? { scale: [1, 1.3, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {option.emoji}
                        </motion.span>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div
                            className="text-sm mt-0.5"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {option.description}
                          </div>
                        )}
                      </div>
                      <AnimatePresence>
                        {isSelected && !isEntryGate && (
                          <motion.span
                            style={{ color: 'var(--color-bg-cream)' }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          >
                            ✓
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Follow-up text field */}
                    {isSelected && option.follow_up?.type === 'free_text' && (
                      <AnimatePresence>
                        <motion.div
                          className="mt-3"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          onClick={e => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            placeholder={option.follow_up.placeholder ?? ''}
                            maxLength={option.follow_up.max_chars}
                            value={followUpValue}
                            onChange={e => setFollowUpValue(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                            style={{
                              background: 'var(--color-bg-elevated)',
                              border: '1px solid var(--color-border-default)',
                              color: 'var(--color-text-primary)',
                            }}
                          />
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </motion.button>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Scenario Cards layout */}
        {hasOptions && isScenario && (
          <motion.div
            className="mt-6 flex flex-col gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {question.options!.map((option, idx) => {
              const isSelected = selected === option.value
              const isConfirming = confirming === option.value
              const letter = String.fromCharCode(65 + idx)

              return (
                <motion.div
                  key={option.value}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <motion.button
                    className={`card-interactive w-full text-left ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(option.value)}
                    whileTap={{ scale: 0.97 }}
                    animate={
                      isConfirming
                        ? { scale: [1, 1.03, 1.0] }
                        : { scale: 1 }
                    }
                    transition={
                      isConfirming
                        ? { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                        : { duration: 0.15 }
                    }
                    style={
                      isSelected || isConfirming
                        ? {
                            borderColor: isConfirming
                              ? 'rgba(240, 239, 235, 0.6)'
                              : 'rgba(240, 239, 235, 0.35)',
                            background: 'rgba(240, 239, 235, 0.04)',
                          }
                        : {}
                    }
                  >
                    <div className="flex items-start gap-3">
                      <motion.span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                        animate={
                          isConfirming
                            ? { scale: [1, 1.4, 1], backgroundColor: 'rgba(240, 239, 235, 0.2)' }
                            : {}
                        }
                        style={{
                          background: isSelected
                            ? 'rgba(240, 239, 235, 0.15)'
                            : 'var(--color-bg-elevated)',
                          color: isSelected ? 'var(--color-bg-cream)' : 'var(--color-text-muted)',
                        }}
                      >
                        {letter}
                      </motion.span>
                      <p className="text-sm leading-relaxed flex-1">{option.label}</p>
                    </div>
                  </motion.button>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Scale / Slider question */}
        {isScale && question.scale && (
          <div className="mt-8">
            <div className="text-center mb-4">
              <motion.span
                className="text-4xl font-bold"
                style={{ color: 'var(--color-bg-cream)', fontFamily: 'League Spartan, sans-serif' }}
                key={Array.isArray(selected) ? selected.join(',') : (selected ?? scaleDefault)}
                initial={{ scale: 0.85, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {selected ?? scaleDefault}
              </motion.span>
              <span className="text-lg ml-1" style={{ color: 'var(--color-text-muted)' }}>
                / {question.scale.max}
              </span>
            </div>
            <input
              type="range"
              min={question.scale.min}
              max={question.scale.max}
              step={question.scale.step ?? 1}
              value={selected !== null ? Number(selected) : Number(scaleDefault)}
              onChange={e => setSelected(e.target.value)}
              className="w-full"
              style={{ accentColor: 'var(--color-bg-cream)' }}
            />
            {question.scale.labels && (
              <div
                className="flex justify-between mt-2 text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <span>{question.scale.labels.min}</span>
                <span>{question.scale.labels.max}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit button for multi-select, scale, or single-select with follow-up */}
      {(isMulti || isScale || (selected && question.options?.find(o => o.value === selected)?.follow_up)) && (
        <motion.button
          className="btn-primary w-full mt-4"
          onClick={handleSubmit}
          disabled={!selected || (Array.isArray(selected) && selected.length === 0)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          Continue →
        </motion.button>
      )}
    </motion.div>
  )
}
