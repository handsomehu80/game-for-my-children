import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AccessibilityState {
  highContrast: boolean
  setHighContrast: (enabled: boolean) => void
  toggleHighContrast: () => void
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      highContrast: false,
      setHighContrast: (enabled) => set({ highContrast: enabled }),
      toggleHighContrast: () => set({ highContrast: !get().highContrast }),
    }),
    { name: 'game_accessibility' }
  )
)