import { useMemo } from 'react'
import type { Track } from '@/types'

export interface SharedResult {
  categoryId: string
  score: number
  track: Track
}

/**
 * Parses ?r=<categoryId>&s=<score>&t=<track> from the URL.
 * Returns null if the URL doesn't contain a shared result.
 */
export function useSharedResult(): SharedResult | null {
  return useMemo(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const r = params.get('r')
    const s = params.get('s')
    const t = params.get('t')
    if (!r || !s || !t) return null
    const score = parseInt(s, 10)
    if (isNaN(score) || score < 0 || score > 100) return null
    if (t !== 'business' && t !== 'general') return null
    return { categoryId: r, score, track: t as Track }
  }, [])
}
