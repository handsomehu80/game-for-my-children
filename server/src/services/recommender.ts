import {
  KnowledgeMastery,
  RecommendationScore
} from '../types';

// UCB + Weak-point first recommendation algorithm

const WEIGHT_GAP = 0.5;        // Mastery gap weight
const WEIGHT_UCB = 0.3;        // Upper Confidence Bound weight
const WEIGHT_NOVELTY = 0.2;    // Novelty bonus weight

export interface RecommendationInput {
  playerId: string;
  knowledgeMastery: Record<string, KnowledgeMastery>;
  totalAttempts: number;
  excludeKpIds?: string[];
}

/**
 * Calculate UCB (Upper Confidence Bound) bonus
 * Encourages exploration of less-attempted knowledge points
 */
export function calculateUCBBonus(
  totalAttempts: number,
  attemptsOnKp: number
): number {
  if (attemptsOnKp === 0) {
    return Math.sqrt(2 * Math.log(totalAttempts + 1));
  }
  return Math.sqrt(2 * Math.log(totalAttempts) / attemptsOnKp);
}

/**
 * Calculate novelty bonus for knowledge points with fewer attempts
 */
export function calculateNoveltyBonus(
  attemptsOnKp: number,
  maxAttempts: number
): number {
  if (maxAttempts === 0) return 1;
  return 1 - Math.min(attemptsOnKp / maxAttempts, 1);
}

/**
 * Calculate mastery gap (1 - mastery probability)
 * Higher gap = more urgent to practice
 */
export function calculateMasteryGap(masteryProbability: number): number {
  return 1 - masteryProbability;
}

/**
 * Calculate recommendation score for a knowledge point
 * Score = gap * w_gap + ucb * w_ucb + novelty * w_novelty
 */
export function calculateRecommendationScore(
  masteryProbability: number,
  attemptsOnKp: number,
  totalAttempts: number,
  maxAttempts: number = 10
): RecommendationScore {
  const masteryGap = calculateMasteryGap(masteryProbability);
  const ucbBonus = calculateUCBBonus(totalAttempts, attemptsOnKp);
  const noveltyBonus = calculateNoveltyBonus(
    attemptsOnKp,
    maxAttempts // real max attempts across knowledge points, normalized against max
  );

  const score =
    masteryGap * WEIGHT_GAP +
    ucbBonus * WEIGHT_UCB +
    noveltyBonus * WEIGHT_NOVELTY;

  return {
    knowledgePointId: '',
    score,
    masteryGap,
    ucbBonus,
    noveltyBonus
  };
}

/**
 * Recommend the best knowledge point to practice next
 */
export function recommendNextKnowledgePoint(
  input: RecommendationInput
): string | null {
  const { knowledgeMastery, totalAttempts, excludeKpIds = [] } = input;

  const kpEntries = Object.entries(knowledgeMastery).filter(
    ([kpId]) => !excludeKpIds.includes(kpId)
  );

  if (kpEntries.length === 0) {
    return null;
  }

  const maxAttempts = Math.max(...kpEntries.map(([, km]) => km.attempts), 1);

  const scoredKps = kpEntries.map(([kpId, km]) => {
    const ucbBonus = calculateUCBBonus(totalAttempts, km.attempts);
    const noveltyBonus = calculateNoveltyBonus(km.attempts, maxAttempts);
    const masteryGap = calculateMasteryGap(km.masteryProbability);

    const score =
      masteryGap * WEIGHT_GAP +
      ucbBonus * WEIGHT_UCB +
      noveltyBonus * WEIGHT_NOVELTY;

    return { kpId, score };
  });

  // Sort by score descending
  scoredKps.sort((a, b) => b.score - a.score);

  return scoredKps[0]?.kpId || null;
}

/**
 * Recommend multiple knowledge points for a study session
 */
export function recommendKnowledgePoints(
  input: RecommendationInput,
  count: number = 5
): string[] {
  const { knowledgeMastery, totalAttempts, excludeKpIds = [] } = input;

  const kpEntries = Object.entries(knowledgeMastery).filter(
    ([kpId]) => !excludeKpIds.includes(kpId)
  );

  if (kpEntries.length === 0) {
    return [];
  }

  const maxAttempts = Math.max(...kpEntries.map(([, km]) => km.attempts), 1);

  const scoredKps = kpEntries.map(([kpId, km]) => {
    const ucbBonus = calculateUCBBonus(totalAttempts, km.attempts);
    const noveltyBonus = calculateNoveltyBonus(km.attempts, maxAttempts);
    const masteryGap = calculateMasteryGap(km.masteryProbability);

    const score =
      masteryGap * WEIGHT_GAP +
      ucbBonus * WEIGHT_UCB +
      noveltyBonus * WEIGHT_NOVELTY;

    return { kpId, score };
  });

  // Sort by score descending and take top N
  scoredKps.sort((a, b) => b.score - a.score);

  return scoredKps.slice(0, count).map(s => s.kpId);
}

/**
 * Get weak points (mastery < threshold)
 */
export function getWeakPoints(
  knowledgeMastery: Record<string, KnowledgeMastery>,
  threshold: number = 0.3
): string[] {
  return Object.entries(knowledgeMastery)
    .filter(([, km]) => km.masteryProbability < threshold && km.attempts > 0)
    .sort((a, b) => a[1].masteryProbability - b[1].masteryProbability)
    .map(([kpId]) => kpId);
}

/**
 * Get strong points (mastery >= threshold)
 */
export function getStrongPoints(
  knowledgeMastery: Record<string, KnowledgeMastery>,
  threshold: number = 0.8
): string[] {
  return Object.entries(knowledgeMastery)
    .filter(([, km]) => km.masteryProbability >= threshold)
    .sort((a, b) => b[1].masteryProbability - a[1].masteryProbability)
    .map(([kpId]) => kpId);
}

/**
 * Determine recommended difficulty based on average mastery
 */
export function recommendDifficulty(
  knowledgeMastery: Record<string, KnowledgeMastery>,
  gradeLevel: number
): number {
  const masteries = Object.values(knowledgeMastery);

  if (masteries.length === 0) {
    return gradeLevel;
  }

  const avgMastery = masteries.reduce((sum, km) => sum + km.masteryProbability, 0) / masteries.length;

  if (avgMastery < 0.3) {
    return gradeLevel;
  } else if (avgMastery < 0.6) {
    return gradeLevel + 1;
  } else {
    return gradeLevel + 2;
  }
}

/**
 * Check if prerequisite knowledge points are met
 */
export function checkPrerequisites(
  kpId: string,
  knowledgeMastery: Record<string, KnowledgeMastery>,
  prerequisiteMap: Record<string, string[]>,
  minMastery: number = 0.4
): boolean {
  const prerequisites = prerequisiteMap[kpId];

  if (!prerequisites || prerequisites.length === 0) {
    return true;
  }

  return prerequisites.every(preKpId => {
    const mastery = knowledgeMastery[preKpId];
    return mastery && mastery.masteryProbability >= minMastery;
  });
}

/**
 * Calculate contribution score for co-op mode
 */
export function calculateContributionScore(
  soloCount: number,
  primaryCount: number,
  secondaryCount: number,
  assistedCount: number
): number {
  const SOLO_WEIGHT = 4;
  const PRIMARY_WEIGHT = 3;
  const SECONDARY_WEIGHT = 2;
  const ASSISTED_WEIGHT = 1;

  return (
    soloCount * SOLO_WEIGHT +
    primaryCount * PRIMARY_WEIGHT +
    secondaryCount * SECONDARY_WEIGHT +
    assistedCount * ASSISTED_WEIGHT
  );
}
