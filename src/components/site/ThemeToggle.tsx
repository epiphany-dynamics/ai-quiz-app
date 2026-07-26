import { useEffect, useState } from 'react'

type ThemeName = 'light' | 'dark'

/**
 * ThemeToggle — flips light/dark, mirroring the main site's navbar toggle.
 *
 * - Reads the initial theme from the data-theme attribute the no-flash
 *   bootstrap script in index.html set on <html> (icon matches first paint).
 * - On click, flips data-theme on <html> and persists to localStorage.theme.
 * - Icon: lit bulb in dark mode ("switch to light"), moon in light mode
 *   ("switch to dark"). Inline SVGs, colored via currentColor.
 * - 44x44 min tap target, aria-label + aria-pressed.
 */

function BulbIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M12 3a6 6 0 0 0-3.9 10.55c.72.62 1.16 1.44 1.32 2.34l.1.61h4.96l.1-.61c.16-.9.6-1.72 1.32-2.34A6 6 0 0 0 12 3z"
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
      />
      <path d="M9.7 19.5h4.6" />
      <path d="M10.6 22h2.8" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.2 14.2A8.2 8.2 0 0 1 9.8 3.8a8.2 8.2 0 1 0 10.4 10.4z" />
    </svg>
  )
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeName>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
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
      className={`inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full transition-colors duration-200 cursor-pointer ${className}`}
    >
      {/* Pre-mount: render a neutral bulb outline so markup is stable.
          After mount we swap to the theme-aware icon. */}
      {!mounted ? <BulbIcon filled={false} /> : theme === 'dark' ? <BulbIcon filled /> : <MoonIcon />}
    </button>
  )
}
