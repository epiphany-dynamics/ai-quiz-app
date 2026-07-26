import { useEffect, useState } from 'react'

export type ThemeName = 'light' | 'dark'

function currentTheme(): ThemeName {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

/**
 * Reactive read of the <html data-theme> attribute. The attribute is owned
 * by the index.html bootstrap script and flipped by ThemeToggle; this hook
 * observes it so inline-styled accent colors can follow the active theme.
 */
export function useTheme(): ThemeName {
  const [theme, setTheme] = useState<ThemeName>(() => currentTheme())

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(currentTheme()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return theme
}
