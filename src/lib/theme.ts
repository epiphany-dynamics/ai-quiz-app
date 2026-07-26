import type { ThemeName } from '@/hooks/useTheme'

/**
 * Result-category accent colors (#10B981 etc.) are tuned for the dark canvas.
 * As TEXT on the light paper background they fail contrast, so text usages
 * swap to a darkened variant in light mode. Decorative strokes, ring fills,
 * and accent bars keep the vivid original in both themes.
 */
const LIGHT_TEXT_ACCENTS: Record<string, string> = {
  '#10B981': '#047857', // emerald-600 -> emerald-700
  '#3B82F6': '#1D4ED8', // blue-500 -> blue-700
  '#8B5CF6': '#6D28D9', // violet-500 -> violet-700
  '#F59E0B': '#B45309', // amber-500 -> amber-700
  '#a1a1aa': '#52525b', // zinc-400 -> zinc-600
}

export function accentTextColor(color: string, theme: ThemeName): string {
  return theme === 'light' ? (LIGHT_TEXT_ACCENTS[color] ?? color) : color
}
