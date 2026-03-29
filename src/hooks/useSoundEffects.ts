import { useState, useCallback } from 'react'

export type SoundType = 'select' | 'correct' | 'milestone' | 'complete' | 'back'

export interface SoundEffectsHook {
  play: (sound: SoundType) => void
  isEnabled: boolean
  toggle: () => void
}

/**
 * Sound effect hooks — stubs ready to wire up Web Audio API or Howler.js.
 *
 * To enable real sounds:
 *   1. Add audio files to /public/sounds/ (select.mp3, correct.mp3, etc.)
 *   2. Replace the console.debug call below with: new Audio(`/sounds/${sound}.mp3`).play()
 *   3. Or install Howler.js for better mobile/Safari support
 *
 * Sounds are OFF by default — user must enable them.
 * localStorage key: 'quiz_sfx_enabled'
 */
export function useSoundEffects(): SoundEffectsHook {
  const [isEnabled, setIsEnabled] = useState(() => {
    try {
      return localStorage.getItem('quiz_sfx_enabled') === 'true'
    } catch {
      return false
    }
  })

  const play = useCallback(
    (sound: SoundType) => {
      if (!isEnabled) return
      // TODO: wire up actual audio files
      // Example: new Audio(`/sounds/${sound}.mp3`).play().catch(() => {})
      console.debug('[SFX]', sound)
    },
    [isEnabled],
  )

  const toggle = useCallback(() => {
    setIsEnabled(prev => {
      const next = !prev
      try {
        localStorage.setItem('quiz_sfx_enabled', String(next))
      } catch {}
      return next
    })
  }, [])

  return { play, isEnabled, toggle }
}
