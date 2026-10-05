/**
 * Unit Tests for Adaptive Recommendation Algorithm
 * server/src/services/recommender.ts
 */

import { describe, it, expect } from 'vitest';
import {
  calculateUCBBonus,
  calculateNoveltyBonus,
  calculateMasteryGap,
  calculateRecommendationScore,
  recommendNextKnowledgePoint,
  recommendKnowledgePoints,
  getWeakPoints,
  getStrongPoints,
  recommendDifficulty,
  checkPrerequisites,
  calculateContributionScore,
  RecommendationInput
} from '../../server/src/services/recommender';
import type { KnowledgeMastery } from '../../server/src/types';

// Mock KnowledgeMastery factory
function createMockMastery(probability: number, attempts: number): KnowledgeMastery {
  return {
    attempts,
    correctCount: Math.round(probability * attempts),
    lastAttemptAt: attempts > 0 ? new Date().toISOString() : null,
    evidenceHistory: [],
    bayesianParams: { alpha: 1 + Math.round(probability * attempts), beta: 1 + attempts - Math.round(probability * attempts) },
    masteryProbability: probability
  };
}

describe('Recommender Service - Unit Tests', () => {
  describe('calculateUCBBonus', () => {
    it('should return sqrt(2*log(total+1)) when attemptsOnKp is 0 (unexplored)', () => {
      const bonus = calculateUCBBonus(100, 0);
      const expected = Math.sqrt(2 * Math.log(101));
      expect(bonus).toBeCloseTo(expected, 5);
    });

    it('should return sqrt(2*log(total)/attempts) for explored kp', () => {
      const bonus = calculateUCBBonus(100, 10);
      const expected = Math.sqrt(2 * Math.log(100) / 10);
      expect(bonus).toBeCloseTo(expected, 5);
    });

    it('should handle totalAttempts = 0', () => {
      const bonus = calculateUCBBonus(0, 0);
      expect(bonus).toBe(Math.sqrt(2 * Math.log(1))); // sqrt(0) = 0
    });

    it('should decrease as attemptsOnKp increases', () => {
      const bonus1 = calculateUCBBonus(100, 1);
      const bonus2 = calculateUCBBonus(100, 10);
      const bonus3 = calculateUCBBonus(100, 50);
      expect(bonus1).toBeGreaterThan(bonus2);
      expect(bonus2).toBeGreaterThan(bonus3);
    });
  });

  describe('calculateNoveltyBonus', () => {
    it('should return 1 when maxAttempts is 0', () => {
      expect(calculateNoveltyBonus(0, 0)).toBe(1);
    });

    it('should return 1 when attemptsOnKp is 0 (completely novel)', () => {
      expect(calculateNoveltyBonus(0, 10)).toBe(1);
    });

    it('should return 0 when attemptsOnKp equals maxAttempts', () => {
      expect(calculateNoveltyBonus(10, 10)).toBe(0);
    });

    it('should return value between 0 and 1 for partial attempts', () => {
      const bonus = calculateNoveltyBonus(5, 10);
      expect(bonus).toBeGreaterThan(0);
      expect(bonus).toBeLessThan(1);
      expect(bonus).toBe(0.5);
    });

    it('should decrease linearly as attempts increase', () => {
      expect(calculateNoveltyBonus(0, 10)).toBe(1);
      expect(calculateNoveltyBonus(5, 10)).toBe(0.5);
      expect(calculateNoveltyBonus(10, 10)).toBe(0);
    });
  });

  describe('calculateMasteryGap', () => {
    it('should return 1 - masteryProbability', () => {
      expect(calculateMasteryGap(0.8)).toBeCloseTo(0.2, 10);
      expect(calculateMasteryGap(0.5)).toBeCloseTo(0.5, 10);
      expect(calculateMasteryGap(0.0)).toBeCloseTo(1.0, 10);
    });

    it('should be higher for low mastery (needs more practice)', () => {
      const lowGap = calculateMasteryGap(0.2);
      const highGap = calculateMasteryGap(0.8);
      expect(lowGap).toBeGreaterThan(highGap);
    });
  });

  describe('calculateRecommendationScore', () => {
    it('should return a valid RecommendationScore object', () => {
      const result = calculateRecommendationScore(0.5, 5, 100);
      expect(result).toHaveProperty('knowledgePointId', '');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('masteryGap');
      expect(result).toHaveProperty('ucbBonus');
      expect(result).toHaveProperty('noveltyBonus');
    });

    it('should prioritize low mastery (high gap)', () => {
      const lowMastery = calculateRecommendationScore(0.2, 5, 100);
      const highMastery = calculateRecommendationScore(0.9, 5, 100);
      expect(lowMastery.masteryGap).toBeGreaterThan(highMastery.masteryGap);
    });

    it('should use real maxAttempts for novelty bonus (BUG-001 regression)', () => {
      const smallMax = calculateRecommendationScore(0.5, 5, 100, 5);
      const largeMax = calculateRecommendationScore(0.5, 5, 100, 100);
      // Same attemptsOnKp, larger maxAttempts => smaller attempts/max ratio => higher novelty bonus
      expect(largeMax.noveltyBonus).toBeGreaterThan(smallMax.noveltyBonus);
      expect(calculateNoveltyBonus(5, 5)).toBe(0);
      expect(calculateNoveltyBonus(5, 100)).toBe(0.95);
    });
  });

  describe('recommendNextKnowledgePoint', () => {
    const mockMastery: Record<string, KnowledgeMastery> = {
      'math_algebra': createMockMastery(0.9, 20),   // High mastery, many attempts
      'math_geometry': createMockMastery(0.3, 5),   // Low mastery, few attempts
      'chinese_reading': createMockMastery(0.5, 10) // Medium mastery
    };

    it('should return null when knowledgeMastery is empty', () => {
      const result = recommendNextKnowledgePoint({
        playerId: 'p1',
        knowledgeMastery: {},
        totalAttempts: 0
      });
      expect(result).toBeNull();
    });

    it('should return the kpId with highest score (weakest point)', () => {
      const result = recommendNextKnowledgePoint({
        playerId: 'p1',
        knowledgeMastery: mockMastery,
        totalAttempts: 100
      });
      // math_geometry has lowest mastery (0.3) and few attempts - should be recommended
      expect(result).toBe('math_geometry');
    });

    it('should exclude kpIds in excludeKpIds list', () => {
      const result = recommendNextKnowledgePoint({
        playerId: 'p1',
        knowledgeMastery: mockMastery,
        totalAttempts: 100,
        excludeKpIds: ['math_geometry']
      });
      expect(result).not.toBe('math_geometry');
    });

    it('should handle single knowledge point', () => {
      const result = recommendNextKnowledgePoint({
        playerId: 'p1',
        knowledgeMastery: { 'math_algebra': createMockMastery(0.9, 20) },
        totalAttempts: 20
      });
      expect(result).toBe('math_algebra');
    });
  });

  describe('recommendKnowledgePoints', () => {
    const mockMastery: Record<string, KnowledgeMastery> = {
      'kp1': createMockMastery(0.9, 20),
      'kp2': createMockMastery(0.3, 5),
      'kp3': createMockMastery(0.5, 10),
      'kp4': createMockMastery(0.2, 2),
      'kp5': createMockMastery(0.7, 15)
    };

    it('should return empty array when knowledgeMastery is empty', () => {
      const result = recommendKnowledgePoints({
        playerId: 'p1',
        knowledgeMastery: {},
        totalAttempts: 0
      }, 5);
      expect(result).toEqual([]);
    });

    it('should return specified number of recommendations', () => {
      const result = recommendKnowledgePoints({
        playerId: 'p1',
        knowledgeMastery: mockMastery,
        totalAttempts: 100
      }, 3);
      expect(result).toHaveLength(3);
    });

    it('should return weak points first (lowest mastery)', () => {
      const result = recommendKnowledgePoints({
        playerId: 'p1',
        knowledgeMastery: mockMastery,
        totalAttempts: 100
      }, 5);
      // kp4 (0.2) and kp2 (0.3) should be first
      expect(result[0]).toBe('kp4');
      expect(result[1]).toBe('kp2');
    });

    it('should not include excluded kpIds', () => {
      const result = recommendKnowledgePoints({
        playerId: 'p1',
        knowledgeMastery: mockMastery,
        totalAttempts: 100,
        excludeKpIds: ['kp4']
      }, 5);
      expect(result).not.toContain('kp4');
    });

    it('should return all when count exceeds available kps', () => {
      const result = recommendKnowledgePoints({
        playerId: 'p1',
        knowledgeMastery: mockMastery,
        totalAttempts: 100
      }, 10);
      expect(result).toHaveLength(5);
    });
  });

  describe('getWeakPoints', () => {
    const mockMastery: Record<string, KnowledgeMastery> = {
      'kp1': createMockMastery(0.8, 10),
      'kp2': createMockMastery(0.25, 5),
      'kp3': createMockMastery(0.5, 8),
      'kp4': createMockMastery(0.15, 3),
      'kp5': createMockMastery(0.9, 20)
    };

    it('should return kps with mastery below threshold', () => {
      const result = getWeakPoints(mockMastery, 0.3);
      expect(result).toContain('kp2');
      expect(result).toContain('kp4');
    });

    it('should not include kps with 0 attempts', () => {
      const masteryWithZero = {
        ...mockMastery,
        'kp6': createMockMastery(0.1, 0) // Never attempted
      };
      const result = getWeakPoints(masteryWithZero, 0.3);
      expect(result).not.toContain('kp6');
    });

    it('should be sorted by mastery probability ascending', () => {
      const result = getWeakPoints(mockMastery, 0.3);
      // kp4 has 0.15, kp2 has 0.25
      expect(result[0]).toBe('kp4');
      expect(result[1]).toBe('kp2');
    });

    it('should return empty array when no weak points', () => {
      const strongMastery: Record<string, KnowledgeMastery> = {
        'kp1': createMockMastery(0.9, 10)
      };
      const result = getWeakPoints(strongMastery, 0.3);
      expect(result).toEqual([]);
    });
  });

  describe('getStrongPoints', () => {
    const mockMastery: Record<string, KnowledgeMastery> = {
      'kp1': createMockMastery(0.85, 10),
      'kp2': createMockMastery(0.25, 5),
      'kp3': createMockMastery(0.75, 8),
      'kp4': createMockMastery(0.9, 15),
      'kp5': createMockMastery(0.5, 20)
    };

    it('should return kps with mastery >= threshold', () => {
      const result = getStrongPoints(mockMastery, 0.8);
      expect(result).toContain('kp1');
      expect(result).toContain('kp4');
    });

    it('should be sorted by mastery probability descending', () => {
      const result = getStrongPoints(mockMastery, 0.8);
      expect(result[0]).toBe('kp4'); // 0.9
      expect(result[1]).toBe('kp1'); // 0.85
    });

    it('should return empty array when no strong points', () => {
      const weakMastery: Record<string, KnowledgeMastery> = {
        'kp1': createMockMastery(0.3, 10)
      };
      const result = getStrongPoints(weakMastery, 0.8);
      expect(result).toEqual([]);
    });
  });

  describe('recommendDifficulty', () => {
    it('should return gradeLevel when no knowledge points', () => {
      const result = recommendDifficulty({}, 5);
      expect(result).toBe(5);
    });

    it('should return gradeLevel for low avg mastery (< 0.3)', () => {
      const mastery: Record<string, KnowledgeMastery> = {
        'kp1': createMockMastery(0.2, 5)
      };
      const result = recommendDifficulty(mastery, 5);
      expect(result).toBe(5);
    });

    it('should return gradeLevel + 1 for medium avg mastery (0.3 - 0.6)', () => {
      const mastery: Record<string, KnowledgeMastery> = {
        'kp1': createMockMastery(0.4, 5)
      };
      const result = recommendDifficulty(mastery, 5);
      expect(result).toBe(6);
    });

    it('should return gradeLevel + 2 for high avg mastery (>= 0.6)', () => {
      const mastery: Record<string, KnowledgeMastery> = {
        'kp1': createMockMastery(0.7, 5)
      };
      const result = recommendDifficulty(mastery, 5);
      expect(result).toBe(7);
    });
  });

  describe('checkPrerequisites', () => {
    const mastery: Record<string, KnowledgeMastery> = {
      'basic_algebra': createMockMastery(0.9, 10),
      'advanced_algebra': createMockMastery(0.5, 5)
    };

    it('should return true when kp has no prerequisites', () => {
      const result = checkPrerequisites('some_kp', mastery, {});
      expect(result).toBe(true);
    });

    it('should return true when all prerequisites are met', () => {
      const prereqMap = {
        'advanced_algebra': ['basic_algebra']
      };
      const result = checkPrerequisites('advanced_algebra', mastery, prereqMap, 0.4);
      expect(result).toBe(true);
    });

    it('should return false when prerequisites are not met', () => {
      const prereqMap = {
        'advanced_algebra': ['basic_algebra']
      };
      const lowMastery = {
        'basic_algebra': createMockMastery(0.3, 10)
      };
      const result = checkPrerequisites('advanced_algebra', lowMastery, prereqMap, 0.4);
      expect(result).toBe(false);
    });

    it('should respect custom minMastery threshold', () => {
      const prereqMap = {
        'advanced_algebra': ['basic_algebra']
      };
      // Mastery is 0.9, should pass minMastery 0.4 but fail 0.95
      expect(checkPrerequisites('advanced_algebra', mastery, prereqMap, 0.4)).toBe(true);
    });
  });

  describe('calculateContributionScore', () => {
    it('should calculate correct score for solo contributions', () => {
      const score = calculateContributionScore(10, 0, 0, 0);
      expect(score).toBe(40); // 10 * 4
    });

    it('should calculate correct score for primary contributions', () => {
      const score = calculateContributionScore(0, 10, 0, 0);
      expect(score).toBe(30); // 10 * 3
    });

    it('should calculate correct score for secondary contributions', () => {
      const score = calculateContributionScore(0, 0, 10, 0);
      expect(score).toBe(20); // 10 * 2
    });

    it('should calculate correct score for assisted contributions', () => {
      const score = calculateContributionScore(0, 0, 0, 10);
      expect(score).toBe(10); // 10 * 1
    });

    it('should handle mixed contributions', () => {
      const score = calculateContributionScore(5, 3, 2, 1);
      // (5*4) + (3*3) + (2*2) + (1*1) = 20 + 9 + 4 + 1 = 34
      expect(score).toBe(34);
    });

    it('should return 0 when all counts are 0', () => {
      const score = calculateContributionScore(0, 0, 0, 0);
      expect(score).toBe(0);
    });
  });
});
