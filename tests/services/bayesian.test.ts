/**
 * Unit Tests for Bayesian Mastery Calculation
 * server/src/services/bayesian.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  updateBayesianParams,
  calculateDecayAdjustedMastery,
  getMasteryStatus,
  getInitialBayesianParams,
  createKnowledgeMastery,
  recordAnswer,
  calculateParentMastery,
  getKnowledgePointName,
  generateParentGuidance,
  LAMBDA_DECAY
} from '../../server/src/services/bayesian';

describe('Bayesian Service - Unit Tests', () => {
  describe('updateBayesianParams', () => {
    it('should return uniform prior (0.5) for initial params', () => {
      const result = updateBayesianParams({
        alphaPrior: 1.0,
        betaPrior: 1.0,
        correctCount: 0,
        incorrectCount: 0
      });
      expect(result.masteryProbability).toBe(0.5);
      expect(result.alphaPosterior).toBe(1.0);
      expect(result.betaPosterior).toBe(1.0);
    });

    it('should increase mastery for correct answer', () => {
      const result = updateBayesianParams({
        alphaPrior: 1.0,
        betaPrior: 1.0,
        correctCount: 1,
        incorrectCount: 0
      });
      expect(result.masteryProbability).toBe(2/3); // (1+1)/(1+1+1) = 2/3
      expect(result.alphaPosterior).toBe(2.0);
      expect(result.betaPosterior).toBe(1.0);
    });

    it('should decrease mastery for incorrect answer', () => {
      const result = updateBayesianParams({
        alphaPrior: 1.0,
        betaPrior: 1.0,
        correctCount: 0,
        incorrectCount: 1
      });
      expect(result.masteryProbability).toBe(1/3); // 1/(1+1+1) = 1/3
      expect(result.alphaPosterior).toBe(1.0);
      expect(result.betaPosterior).toBe(2.0);
    });

    it('should handle multiple correct answers', () => {
      const result = updateBayesianParams({
        alphaPrior: 1.0,
        betaPrior: 1.0,
        correctCount: 5,
        incorrectCount: 0
      });
      expect(result.masteryProbability).toBe(6/7); // (1+5)/(1+5+1) = 6/7
      expect(result.alphaPosterior).toBe(6.0);
      expect(result.betaPosterior).toBe(1.0);
    });

    it('should handle mixed correct and incorrect answers', () => {
      const result = updateBayesianParams({
        alphaPrior: 2.0,
        betaPrior: 3.0,
        correctCount: 3,
        incorrectCount: 2
      });
      expect(result.alphaPosterior).toBe(5.0); // 2+3
      expect(result.betaPosterior).toBe(5.0); // 3+2
      expect(result.masteryProbability).toBe(0.5);
    });

    it('should not exceed 1.0 mastery probability', () => {
      const result = updateBayesianParams({
        alphaPrior: 100.0,
        betaPrior: 1.0,
        correctCount: 10,
        incorrectCount: 0
      });
      expect(result.masteryProbability).toBeLessThanOrEqual(1.0);
    });

    it('should not go below 0.0 mastery probability', () => {
      const result = updateBayesianParams({
        alphaPrior: 1.0,
        betaPrior: 100.0,
        correctCount: 0,
        incorrectCount: 10
      });
      expect(result.masteryProbability).toBeGreaterThanOrEqual(0.0);
    });
  });

  describe('calculateDecayAdjustedMastery', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-06-20T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return original mastery when lastAttemptAt is null', () => {
      const result = calculateDecayAdjustedMastery(0.8, null);
      expect(result).toBe(0.8);
    });

    it('should return original mastery when attempt was just now', () => {
      const result = calculateDecayAdjustedMastery(0.8, '2026-06-20T12:00:00Z');
      expect(result).toBeCloseTo(0.8);
    });

    it('should decay towards 0.5 as time increases', () => {
      // Mastery 0.8, 7 days ago with lambda=0.05
      // decayFactor = exp(-0.05 * 7) = exp(-0.35) ≈ 0.705
      // adjusted = 0.8 * 0.705 + 0.5 * 0.295 ≈ 0.7115
      const result = calculateDecayAdjustedMastery(0.8, '2026-06-13T12:00:00Z');
      expect(result).toBeLessThan(0.8);
      expect(result).toBeGreaterThan(0.5);
    });

    it('should use custom lambda value', () => {
      const result1 = calculateDecayAdjustedMastery(0.8, '2026-06-13T12:00:00Z', 0.05);
      const result2 = calculateDecayAdjustedMastery(0.8, '2026-06-13T12:00:00Z', 0.1);
      // Higher lambda = faster decay = mastery moves faster towards 0.5
      // result2 should be closer to 0.5 (smaller since 0.5 < 0.8)
      expect(result2).toBeLessThan(result1);
    });

    it('should clamp result between 0 and 1', () => {
      const result = calculateDecayAdjustedMastery(1.0, '2026-01-01T12:00:00Z');
      expect(result).toBeLessThanOrEqual(1.0);
      expect(result).toBeGreaterThanOrEqual(0.0);
    });

    it('should handle very old attempts (nearly full decay)', () => {
      // About 100 days with lambda=0.05
      // decayFactor = exp(-0.05 * 100) ≈ 0.0067
      // adjusted ≈ 0.5 * (1 + 0.0067) ≈ 0.503
      const result = calculateDecayAdjustedMastery(0.9, '2026-03-12T12:00:00Z');
      expect(result).toBeGreaterThan(0.49);
      expect(result).toBeLessThan(0.51);
    });
  });

  describe('getMasteryStatus', () => {
    it('should return "unmastered" for probability < 0.30', () => {
      expect(getMasteryStatus(0.0)).toBe('unmastered');
      expect(getMasteryStatus(0.15)).toBe('unmastered');
      expect(getMasteryStatus(0.29)).toBe('unmastered');
    });

    it('should return "learning" for 0.30 <= probability < 0.60', () => {
      expect(getMasteryStatus(0.30)).toBe('learning');
      expect(getMasteryStatus(0.45)).toBe('learning');
      expect(getMasteryStatus(0.59)).toBe('learning');
    });

    it('should return "basically_mastered" for 0.60 <= probability < 0.80', () => {
      expect(getMasteryStatus(0.60)).toBe('basically_mastered');
      expect(getMasteryStatus(0.70)).toBe('basically_mastered');
      expect(getMasteryStatus(0.79)).toBe('basically_mastered');
    });

    it('should return "mastered" for probability >= 0.80', () => {
      expect(getMasteryStatus(0.80)).toBe('mastered');
      expect(getMasteryStatus(0.90)).toBe('mastered');
      expect(getMasteryStatus(1.0)).toBe('mastered');
    });
  });

  describe('getInitialBayesianParams', () => {
    it('should return default alpha and beta priors', () => {
      const params = getInitialBayesianParams();
      expect(params.alpha).toBe(1.0);
      expect(params.beta).toBe(1.0);
    });
  });

  describe('createKnowledgeMastery', () => {
    it('should create a new mastery record with zero attempts', () => {
      const mastery = createKnowledgeMastery();
      expect(mastery.attempts).toBe(0);
      expect(mastery.correctCount).toBe(0);
      expect(mastery.lastAttemptAt).toBeNull();
      expect(mastery.evidenceHistory).toEqual([]);
      expect(mastery.masteryProbability).toBe(0.5);
    });

    it('should have valid bayesian params', () => {
      const mastery = createKnowledgeMastery();
      expect(mastery.bayesianParams.alpha).toBe(1.0);
      expect(mastery.bayesianParams.beta).toBe(1.0);
    });
  });

  describe('recordAnswer', () => {
    it('should increment attempts and correctCount for correct answer', () => {
      const initial = createKnowledgeMastery();
      const result = recordAnswer(initial, true);

      expect(result.attempts).toBe(1);
      expect(result.correctCount).toBe(1);
      expect(result.lastAttemptAt).not.toBeNull();
      expect(result.evidenceHistory.length).toBe(1);
      expect(result.evidenceHistory[0].result).toBe('correct');
    });

    it('should increment attempts but not correctCount for incorrect answer', () => {
      const initial = createKnowledgeMastery();
      const result = recordAnswer(initial, false);

      expect(result.attempts).toBe(1);
      expect(result.correctCount).toBe(0);
    });

    it('should update bayesian params after correct answer', () => {
      const initial = createKnowledgeMastery();
      const result = recordAnswer(initial, true);

      expect(result.bayesianParams.alpha).toBe(2.0); // 1 + 1
      expect(result.bayesianParams.beta).toBe(1.0);  // 1 + 0
      expect(result.masteryProbability).toBe(2/3);
    });

    it('should update bayesian params after incorrect answer', () => {
      const initial = createKnowledgeMastery();
      const result = recordAnswer(initial, false);

      expect(result.bayesianParams.alpha).toBe(1.0); // 1 + 0
      expect(result.bayesianParams.beta).toBe(2.0);  // 1 + 1
      expect(result.masteryProbability).toBe(1/3);
    });

    it('should accumulate multiple answers correctly', () => {
      let mastery = createKnowledgeMastery();

      // 3 correct, 1 incorrect
      mastery = recordAnswer(mastery, true);
      mastery = recordAnswer(mastery, true);
      mastery = recordAnswer(mastery, false);
      mastery = recordAnswer(mastery, true);

      expect(mastery.attempts).toBe(4);
      expect(mastery.correctCount).toBe(3);
      expect(mastery.bayesianParams.alpha).toBe(4.0); // 1 + 3
      expect(mastery.bayesianParams.beta).toBe(2.0);  // 1 + 1
      expect(mastery.masteryProbability).toBe(4/6);    // 0.666...
    });

    it('should preserve evidence history', () => {
      let mastery = createKnowledgeMastery();
      mastery = recordAnswer(mastery, true);
      mastery = recordAnswer(mastery, false);

      expect(mastery.evidenceHistory.length).toBe(2);
      expect(mastery.evidenceHistory[0].result).toBe('correct');
      expect(mastery.evidenceHistory[1].result).toBe('incorrect');
    });

    it('should not mutate the original mastery object', () => {
      const initial = createKnowledgeMastery();
      recordAnswer(initial, true);

      expect(initial.attempts).toBe(0);
      expect(initial.correctCount).toBe(0);
    });
  });

  describe('calculateParentMastery', () => {
    it('should return 0.5 when no children provided', () => {
      const result = calculateParentMastery([]);
      expect(result).toBe(0.5);
    });

    it('should return 0.5 when all weights are zero', () => {
      const result = calculateParentMastery([
        { knowledgePointId: 'kp1', masteryProbability: 0.9, weight: 0 },
        { knowledgePointId: 'kp2', masteryProbability: 0.3, weight: 0 }
      ]);
      expect(result).toBe(0.5);
    });

    it('should calculate weighted average correctly', () => {
      const result = calculateParentMastery([
        { knowledgePointId: 'kp1', masteryProbability: 0.8, weight: 2 },
        { knowledgePointId: 'kp2', masteryProbability: 0.4, weight: 2 }
      ]);
      expect(result).toBeCloseTo(0.6, 5); // (0.8*2 + 0.4*2) / 4 = 2.4/4
    });

    it('should handle different weights', () => {
      const result = calculateParentMastery([
        { knowledgePointId: 'kp1', masteryProbability: 1.0, weight: 3 },
        { knowledgePointId: 'kp2', masteryProbability: 0.0, weight: 1 }
      ]);
      expect(result).toBe(0.75); // (1*3 + 0*1) / 4 = 3/4
    });
  });

  describe('getKnowledgePointName', () => {
    it('should parse kpId with subject_prefix format', () => {
      const name = getKnowledgePointName('math_algebra_basic');
      expect(name).toBe('MATH - algebra basic');
    });

    it('should handle simple kpId without underscores', () => {
      const name = getKnowledgePointName('algebra');
      expect(name).toBe('algebra');
    });

    it('should uppercase the subject', () => {
      const name = getKnowledgePointName('chinese_pangram');
      expect(name).toContain('CHINESE');
    });
  });

  describe('generateParentGuidance', () => {
    it('should recommend basics re-teaching for very low mastery (< 0.15)', () => {
      const guidance = generateParentGuidance('math_algebra', 0.1);
      expect(guidance).toContain('基础概念');
    });

    it('should recommend reviewing basics for low mastery (< 0.30)', () => {
      const guidance = generateParentGuidance('math_algebra', 0.2);
      expect(guidance).toContain('复习');
    });

    it('should recommend practice for higher mastery', () => {
      const guidance = generateParentGuidance('math_algebra', 0.4);
      expect(guidance).toContain('练习题');
    });
  });

  describe('LAMBDA_DECAY constant', () => {
    it('should be defined as 0.05', () => {
      expect(LAMBDA_DECAY).toBe(0.05);
    });
  });
});
