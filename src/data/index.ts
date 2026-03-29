// ============================================================
// DATA LOADER — Imports quiz content from /content/ JSON files
// ============================================================

import type { Question, ResultsData, Track } from '@/types'

// Lazy-load content (Vite handles JSON imports natively)
export async function loadQuestionsForTrack(track: Track): Promise<Question[]> {
  if (track === 'business') {
    const mod = await import('../../content/questions-business.json')
    return mod.default.questions as unknown as Question[]
  }
  if (track === 'general') {
    const mod = await import('../../content/questions-general.json')
    return mod.default.questions as unknown as Question[]
  }
  return []
}

export async function loadResults(): Promise<ResultsData> {
  const mod = await import('../../content/results.json')
  return mod.default as unknown as ResultsData
}

// Entry gate question (hardcoded — routes to track)
export const ENTRY_QUESTION: Question = {
  id: 'Q0',
  type: 'entry_gate',
  layout: 'card_full',
  question: 'Which of these is more you?',
  tags: ['entry', 'routing'],
  scoring: false,
  options: [
    {
      value: 'business',
      label: 'I run a business and want to know where AI fits',
      emoji: '🏢',
      description: 'Get your AI Readiness Score',
      routes_to: 'business',
    },
    {
      value: 'general',
      label: "I'm curious where I stand with AI personally",
      emoji: '🧠',
      description: 'Get your AI Personality Type',
      routes_to: 'general',
    },
  ],
}
