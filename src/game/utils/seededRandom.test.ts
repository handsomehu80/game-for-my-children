import { describe, it, expect } from 'vitest'
import { SeededRandom, generatePortalSeed } from './seededRandom'

describe('SeededRandom', () => {
  describe('next()', () => {
    it('should return numbers between 0 and 1', () => {
      const rng = new SeededRandom(12345)
      for (let i = 0; i < 100; i++) {
        const value = rng.next()
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(1)
      }
    })

    it('should produce deterministic sequence for same seed', () => {
      const rng1 = new SeededRandom(42)
      const rng2 = new SeededRandom(42)

      for (let i = 0; i < 10; i++) {
        expect(rng1.next()).toBe(rng2.next())
      }
    })

    it('should produce different sequences for different seeds', () => {
      const rng1 = new SeededRandom(42)
      const rng2 = new SeededRandom(123)

      const seq1 = Array.from({ length: 10 }, () => rng1.next())
      const seq2 = Array.from({ length: 10 }, () => rng2.next())

      expect(seq1).not.toEqual(seq2)
    })
  })

  describe('nextInt()', () => {
    it('should return integers within range', () => {
      const rng = new SeededRandom(12345)
      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(5, 10)
        expect(value).toBeGreaterThanOrEqual(5)
        expect(value).toBeLessThanOrEqual(10)
        expect(Number.isInteger(value)).toBe(true)
      }
    })

    it('should be deterministic for same seed', () => {
      const rng1 = new SeededRandom(999)
      const rng2 = new SeededRandom(999)

      for (let i = 0; i < 20; i++) {
        expect(rng1.nextInt(1, 100)).toBe(rng2.nextInt(1, 100))
      }
    })

    it('should handle edge case of single value range', () => {
      const rng = new SeededRandom(42)
      for (let i = 0; i < 20; i++) {
        expect(rng.nextInt(7, 7)).toBe(7)
      }
    })
  })

  describe('pick()', () => {
    it('should pick elements from array', () => {
      const rng = new SeededRandom(12345)
      const arr = ['a', 'b', 'c', 'd', 'e']

      const picked: string[] = []
      for (let i = 0; i < 50; i++) {
        const result = rng.pick(arr)
        if (result !== undefined) picked.push(result)
      }

      // All elements should have been picked at least once over 50 tries
      const uniquePicked = new Set(picked)
      expect(uniquePicked.size).toBe(arr.length)
    })

    it('should return undefined for empty array', () => {
      const rng = new SeededRandom(42)
      expect(rng.pick([])).toBeUndefined()
    })

    it('should be deterministic', () => {
      const rng1 = new SeededRandom(777)
      const rng2 = new SeededRandom(777)

      const arr = [1, 2, 3, 4, 5]
      for (let i = 0; i < 10; i++) {
        expect(rng1.pick(arr)).toBe(rng2.pick(arr))
      }
    })
  })

  describe('shuffle()', () => {
    it('should return array of same length', () => {
      const rng = new SeededRandom(42)
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const shuffled = rng.shuffle(arr)

      expect(shuffled.length).toBe(arr.length)
    })

    it('should contain all original elements', () => {
      const rng = new SeededRandom(42)
      const arr = [1, 2, 3, 4, 5]
      const shuffled = rng.shuffle(arr)

      const sortedOriginal = [...arr].sort()
      const sortedShuffled = [...shuffled].sort()
      expect(sortedShuffled).toEqual(sortedOriginal)
    })

    it('should not modify original array', () => {
      const rng = new SeededRandom(42)
      const arr = [1, 2, 3, 4, 5]
      const original = [...arr]
      rng.shuffle(arr)

      expect(arr).toEqual(original)
    })

    it('should be deterministic for same seed', () => {
      const rng1 = new SeededRandom(555)
      const rng2 = new SeededRandom(555)

      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      expect(rng1.shuffle(arr)).toEqual(rng2.shuffle(arr))
    })
  })

  describe('chance()', () => {
    it('should return true approximately for probability 1', () => {
      const rng = new SeededRandom(42)
      for (let i = 0; i < 100; i++) {
        expect(rng.chance(1)).toBe(true)
      }
    })

    it('should return false approximately for probability 0', () => {
      const rng = new SeededRandom(42)
      for (let i = 0; i < 100; i++) {
        expect(rng.chance(0)).toBe(false)
      }
    })

    it('should be roughly 50% for probability 0.5 over many trials', () => {
      const rng = new SeededRandom(12345)
      let trueCount = 0
      const trials = 10000

      for (let i = 0; i < trials; i++) {
        if (rng.chance(0.5)) trueCount++
      }

      // Should be between 45% and 55%
      const ratio = trueCount / trials
      expect(ratio).toBeGreaterThan(0.45)
      expect(ratio).toBeLessThan(0.55)
    })

    it('should be deterministic', () => {
      const rng1 = new SeededRandom(888)
      const rng2 = new SeededRandom(888)

      for (let i = 0; i < 20; i++) {
        expect(rng1.chance(0.3)).toBe(rng2.chance(0.3))
      }
    })
  })

  describe('reset()', () => {
    it('should reset to initial seed state', () => {
      const rng = new SeededRandom(42)
      const originalValues: number[] = []
      for (let i = 0; i < 5; i++) {
        originalValues.push(rng.next())
      }

      // Generate some more
      for (let i = 0; i < 5; i++) {
        rng.next()
      }

      rng.reset()

      // Should produce same sequence as beginning
      for (let i = 0; i < 5; i++) {
        expect(rng.next()).toBe(originalValues[i])
      }
    })
  })

  describe('getSeed()', () => {
    it('should return the original seed', () => {
      const rng = new SeededRandom(12345)
      expect(rng.getSeed()).toBe(12345)

      // Generate some values
      rng.next()
      rng.next()
      rng.next()

      // Seed should still be original
      expect(rng.getSeed()).toBe(12345)
    })
  })
})

describe('generatePortalSeed', () => {
  it('should generate a positive number', () => {
    const seed = generatePortalSeed('east')
    expect(seed).toBeGreaterThan(0)
  })

  it('should generate same seed for same oceanId and timestamp', () => {
    const seed1 = generatePortalSeed('east', 1234567890000)
    const seed2 = generatePortalSeed('east', 1234567890000)
    expect(seed1).toBe(seed2)
  })

  it('should generate different seeds for different oceanIds', () => {
    const seed1 = generatePortalSeed('east')
    const seed2 = generatePortalSeed('west')
    expect(seed1).not.toBe(seed2)
  })

  it('should generate different seeds for different timestamps', () => {
    const seed1 = generatePortalSeed('east', 1000000000000)
    const seed2 = generatePortalSeed('east', 2000000000000)
    expect(seed1).not.toBe(seed2)
  })

  it('should handle empty string oceanId', () => {
    const seed = generatePortalSeed('')
    expect(seed).toBeGreaterThan(0)
  })

  it('should handle special characters in oceanId', () => {
    const seed1 = generatePortalSeed('east_ocean')
    const seed2 = generatePortalSeed('east-ocean')
    expect(seed1).not.toBe(seed2)
  })

  it('should use Date.now() when timestamp not provided', () => {
    const seed1 = generatePortalSeed('east')

    // Seed should be a number in reasonable range
    expect(seed1).toBeGreaterThan(0)
    expect(seed1).toBeLessThanOrEqual(4294967296)
  })
})