import { describe, it, expect, beforeEach } from 'vitest'
import { useAccessibilityStore } from '../../src/store/accessibilityStore'

describe('useAccessibilityStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAccessibilityStore.setState({ highContrast: false })
  })

  it('should return default highContrast as false', () => {
    const state = useAccessibilityStore.getState()
    expect(state.highContrast).toBe(false)
  })

  it('should toggle highContrast', () => {
    const { toggleHighContrast } = useAccessibilityStore.getState()
    toggleHighContrast()
    expect(useAccessibilityStore.getState().highContrast).toBe(true)
  })

  it('should set highContrast to specific value', () => {
    const { setHighContrast } = useAccessibilityStore.getState()
    setHighContrast(true)
    expect(useAccessibilityStore.getState().highContrast).toBe(true)
    setHighContrast(false)
    expect(useAccessibilityStore.getState().highContrast).toBe(false)
  })
})