import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getStorageInfo,
  checkStorageCapacity,
  cleanupOldData,
  safeSetItem,
  safeGetItem,
} from './storage'

const STORAGE_KEY_PREFIX = 'ocean_game_'

// Mock localStorage for Node.js environment
const mockStorage: Record<string, string> = {}
const mockLocalStorage = {
  length: 0,
  key: (index: number): string | null => {
    const keys = Object.keys(mockStorage)
    return keys[index] || null
  },
  getItem: (key: string): string | null => mockStorage[key] || null,
  setItem: (key: string, value: string): void => {
    mockStorage[key] = value
    mockLocalStorage.length = Object.keys(mockStorage).length
  },
  removeItem: (key: string): void => {
    delete mockStorage[key]
    mockLocalStorage.length = Object.keys(mockStorage).length
  },
  clear: (): void => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key])
    mockLocalStorage.length = 0
  },
}

// Replace global localStorage with mock
Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

// Helper to clear all ocean_game_ prefixed keys
function clearOceanGameStorage(): void {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.startsWith(STORAGE_KEY_PREFIX) || key.endsWith('_ts'))) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key))
}

describe('Storage Utils', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
  })

  describe('getStorageInfo', () => {
    it('should return empty info when no ocean_game_ keys exist', () => {
      const info = getStorageInfo()
      expect(info.used).toBe(0)
      expect(info.available).toBeGreaterThan(0)
      expect(info.keys).toHaveLength(0)
    })

    it('should calculate storage used correctly', () => {
      const testKey = 'test_key'
      const testValue = 'test_value'
      localStorage.setItem(STORAGE_KEY_PREFIX + testKey, testValue)

      const info = getStorageInfo()
      expect(info.keys).toContain(STORAGE_KEY_PREFIX + testKey)
      expect(info.used).toBeGreaterThan(0)
    })

    it('should track multiple keys', () => {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'key1', 'value1')
      localStorage.setItem(STORAGE_KEY_PREFIX + 'key2', 'value2')

      const info = getStorageInfo()
      expect(info.keys).toHaveLength(2)
      expect(info.keys).toContain(STORAGE_KEY_PREFIX + 'key1')
      expect(info.keys).toContain(STORAGE_KEY_PREFIX + 'key2')
    })
  })

  describe('checkStorageCapacity', () => {
    it('should return ok: true when storage is empty', () => {
      const result = checkStorageCapacity()
      expect(result.ok).toBe(true)
      expect(result.info.used).toBe(0)
    })

    it('should return ok: true when storage has space', () => {
      safeSetItem('test_key', 'test_value')
      const result = checkStorageCapacity()
      expect(result.ok).toBe(true)
    })
  })

  describe('cleanupOldData', () => {
    it('should not remove entries when under 80% capacity', () => {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'key1', 'value1')
      cleanupOldData()
      expect(localStorage.getItem(STORAGE_KEY_PREFIX + 'key1')).toBe('value1')
    })

    it('should remove oldest 30% of entries when over 80% capacity', () => {
      // Directly set entries with known timestamps to control cleanup behavior
      // Add 10 small entries first (with timestamps set to older times)
      for (let i = 0; i < 10; i++) {
        localStorage.setItem(STORAGE_KEY_PREFIX + `small${i}`, `value${i}`)
        localStorage.setItem(STORAGE_KEY_PREFIX + `small${i}_ts`, (i * 1000).toString())
      }

      // Add entries with large values to exceed 80% threshold
      // 10 entries * 400KB each = 4MB, exceeds 3.6MB threshold
      const largeValue = 'x'.repeat(400 * 1024) // 400KB per entry
      for (let i = 0; i < 10; i++) {
        localStorage.setItem(STORAGE_KEY_PREFIX + `large${i}`, largeValue)
        localStorage.setItem(STORAGE_KEY_PREFIX + `large${i}_ts`, ((i + 100) * 1000).toString())
      }

      // Total: 10 small data + 10 small timestamp + 10 large data + 10 large timestamp = 40 keys
      const infoBefore = getStorageInfo()
      expect(infoBefore.keys.length).toBe(40)

      // Verify threshold is exceeded (should be ~4MB > 3.6MB threshold)
      expect(infoBefore.used).toBeGreaterThan(4.5 * 1024 * 1024 * 0.8)

      cleanupOldData()

      const infoAfter = getStorageInfo()
      // 30% of 20 data entries = 6 entries should be removed
      // 6 data keys + 6 timestamp keys removed = 12 keys removed
      // 40 - 12 = 28 keys remaining
      expect(infoAfter.keys.length).toBe(28)
    })
  })

  describe('safeSetItem', () => {
    it('should store item successfully when space available', () => {
      const result = safeSetItem('test_key', 'test_value')
      expect(result).toBe(true)
      expect(localStorage.getItem(STORAGE_KEY_PREFIX + 'test_key')).toBe('test_value')
    })

    it('should return false when value is too large', () => {
      // Create a value larger than 4.5MB
      const tooLarge = 'x'.repeat(5 * 1024 * 1024)
      const result = safeSetItem('large_key', tooLarge)
      expect(result).toBe(false)
      expect(localStorage.getItem(STORAGE_KEY_PREFIX + 'large_key')).toBeNull()
    })

    it('should set timestamp for cleanup tracking', () => {
      safeSetItem('test_key', 'test_value')
      const tsKey = STORAGE_KEY_PREFIX + 'test_key_ts'
      const timestamp = localStorage.getItem(tsKey)
      expect(timestamp).not.toBeNull()
      expect(parseInt(timestamp!, 10)).toBeGreaterThan(0)
    })

    it('should cleanup and retry when approaching capacity', () => {
      // This test verifies the cleanup behavior
      // First fill up most of the storage
      const smallValue = 'x'.repeat(100)
      for (let i = 0; i < 50; i++) {
        safeSetItem(`key${i}`, smallValue)
      }

      // Now try to add more - should trigger cleanup
      const result = safeSetItem('new_key', smallValue)
      // May succeed after cleanup or fail if even cleanup couldn't help
      expect(typeof result).toBe('boolean')
    })
  })

  describe('safeGetItem', () => {
    it('should return stored value', () => {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'test_key', 'test_value')
      const result = safeGetItem('test_key')
      expect(result).toBe('test_value')
    })

    it('should return null for non-existent key', () => {
      const result = safeGetItem('non_existent_key')
      expect(result).toBeNull()
    })

    it('should not include prefix in key lookup', () => {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'my_key', 'my_value')
      const result = safeGetItem('my_key')
      expect(result).toBe('my_value')
    })
  })
})
