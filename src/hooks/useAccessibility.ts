import { useAccessibilityStore } from '../store/accessibilityStore'
import { useMemo } from 'react'

export function useAccessibility() {
  const highContrast = useAccessibilityStore((s) => s.highContrast)
  const setHighContrast = useAccessibilityStore((s) => s.setHighContrast)
  const toggleHighContrast = useAccessibilityStore((s) => s.toggleHighContrast)

  const isReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  return { highContrast, setHighContrast, toggleHighContrast, isReducedMotion }
}