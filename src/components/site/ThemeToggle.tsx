import { useEffect, useState } from 'react'

type ThemeName = 'light' | 'dark'

/**
 * ThemeToggle — lightbulb icon in the navbar that flips light/dark.
 * Exact port of the main site's toggle (epiphanydynamics.ai), with the
 * phosphor LightbulbFilament/Moon glyphs inlined (fill=currentColor,
 * viewBox 0 0 256 256) so no icon dependency is needed.
 *
 * - Reads the initial theme from the data-theme attribute the no-flash
 *   bootstrap script set on <html> (so the icon matches what painted).
 * - On click, flips data-theme on <html> and persists to localStorage.theme.
 * - Icon morphs: lit bulb (dark) <-> moon (light).
 * - Fully keyboard-accessible with an aria-pressed state.
 */

const PHOSPHOR = {
  bulbFill:
    'M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-50.34,2.34a8,8,0,0,0-11.32,0L128,132.69l-26.34-26.35a8,8,0,0,0-11.32,11.32L120,147.31V184a8,8,0,0,0,16,0V147.31l29.66-29.65A8,8,0,0,0,165.66,106.34Z',
  bulbRegular:
    'M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.5C39.74,56.83,78.26,17.15,125.88,16A88,88,0,0,1,216,104Zm-16,0a72,72,0,0,0-73.74-72c-39,.92-70.47,33.39-70.26,72.39a71.64,71.64,0,0,0,27.64,56.3h0A32,32,0,0,1,96,186v6h24V147.31L90.34,117.66a8,8,0,0,1,11.32-11.32L128,132.69l26.34-26.35a8,8,0,0,1,11.32,11.32L136,147.31V192h24v-6a32.12,32.12,0,0,1,12.47-25.35A71.65,71.65,0,0,0,200,104Z',
  moonRegular:
    'M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z',
} as const

function PhosphorIcon({ path, size }: { path: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeName>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as ThemeName) || 'dark'
    setTheme(current)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next: ThemeName = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage can be blocked in private/sandboxed contexts. The DOM theme
      // already changed, so keep React state/icon in sync instead of throwing.
    }
    setTheme(next)
  }

  const buttonLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={buttonLabel}
      title={buttonLabel}
      aria-pressed={theme === 'light'}
      className={`theme-toggle inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-strong text-ink-muted hover:text-ink cursor-pointer ${className}`}
    >
      {/* SSR + pre-hydration: render a neutral lit bulb so markup is stable.
          After mount we swap to the theme-aware icon. */}
      {!mounted ? (
        <PhosphorIcon path={PHOSPHOR.bulbRegular} size={20} />
      ) : theme === 'dark' ? (
        // Dark theme: show a LIT bulb (click to dim → light mode)
        <PhosphorIcon path={PHOSPHOR.bulbFill} size={20} />
      ) : (
        // Light theme: show a moon (click to return to dark mode)
        <PhosphorIcon path={PHOSPHOR.moonRegular} size={18} />
      )}
    </button>
  )
}
