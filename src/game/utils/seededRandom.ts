/**
 * Seeded Random Number Generator for reproducible portal generation.
 * Used to ensure deterministic portal layout given the same seed (oceanId + timestamp).
 */

/**
 * Seeded random number generator using a linear congruential generator (LCG) algorithm.
 * Provides reproducible random numbers for game features like portal generation.
 */
export class SeededRandom {
  private seed: number
  private currentSeed: number

  constructor(seed: number) {
    this.seed = seed
    this.currentSeed = seed
  }

  /**
   * Generate next random number between 0 and 1 (exclusive).
   * Uses LCG algorithm: next = (a * current + c) mod m
   * Using values from Numerical Recipes for good statistical properties.
   */
  next(): number {
    // LCG parameters (Numerical Recipes)
    this.currentSeed = (this.currentSeed * 1664525 + 1013904223) % 4294967296
    return this.currentSeed / 4294967296
  }

  /**
   * Generate random integer between min and max (inclusive).
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  /**
   * Pick a random element from an array.
   * Returns undefined if array is empty.
   */
  pick<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined
    const index = this.nextInt(0, array.length - 1)
    return array[index]
  }

  /**
   * Shuffle an array in place using Fisher-Yates algorithm.
   * Returns a new shuffled array (does not modify original).
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i)
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  /**
   * Returns true with the given probability (0-1).
   * Example: chance(0.3) returns true 30% of the time.
   */
  chance(probability: number): boolean {
    return this.next() < probability
  }

  /**
   * Reset the generator to its initial seed.
   */
  reset(): void {
    this.currentSeed = this.seed
  }

  /**
   * Get the original seed value.
   */
  getSeed(): number {
    return this.seed
  }
}

/**
 * Generate a numeric seed from ocean ID and optional timestamp.
 * Combines string hash of oceanId with timestamp for unique but deterministic seeds.
 */
export function generatePortalSeed(oceanId: string, timestamp: number = Date.now()): number {
  // Simple string hash function
  let hash = 0
  for (let i = 0; i < oceanId.length; i++) {
    const char = oceanId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Combine hash with timestamp
  // Use XOR to mix them while preserving some randomness from timestamp
  const seed = (hash ^ (timestamp % 4294967296)) >>> 0

  // Ensure seed is positive and within valid range
  return seed === 0 ? 1 : seed
}