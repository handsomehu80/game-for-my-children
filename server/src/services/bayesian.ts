import { v4 as uuidv4 } from 'uuid';

// Bayesian mastery calculation based on Beta-Binomial model

const DEFAULT_ALPHA_PRIOR = 1.0;
const DEFAULT_BETA_PRIOR = 1.0;
const LAMBDA_DECAY = 0.05; // Decay factor for time-based adjustment

export interface BayesianUpdateInput {
  alphaPrior: number;
  betaPrior: number;
  correctCount: number;
  incorrectCount: number;
}

export interface BayesianUpdateResult {
  alphaPosterior: number;
  betaPosterior: number;
  masteryProbability: number;
}

/**
 * Update Bayesian parameters with new evidence
 * Posterior = Prior + Evidence
 */
export function updateBayesianParams(input: BayesianUpdateInput): BayesianUpdateResult {
  const { alphaPrior, betaPrior, correctCount, incorrectCount } = input;

  const alphaPosterior = alphaPrior + correctCount;
  const betaPosterior = betaPrior + incorrectCount;
  const masteryProbability = alphaPosterior / (alphaPosterior + betaPosterior);

  return {
    alphaPosterior,
    betaPosterior,
    masteryProbability
  };
}

/**
 * Calculate mastery probability with time decay
 * Applies forgetting curve: mastery_effective = mastery * decay_factor + 0.5 * (1 - decay_factor)
 */
export function calculateDecayAdjustedMastery(
  masteryProbability: number,
  lastAttemptAt: string | null,
  lambda: number = LAMBDA_DECAY
): number {
  if (!lastAttemptAt) {
    return masteryProbability;
  }

  const now = new Date();
  const lastAttempt = new Date(lastAttemptAt);
  const daysSinceAttempt = (now.getTime() - lastAttempt.getTime()) / (1000 * 60 * 60 * 24);

  const decayFactor = Math.exp(-lambda * daysSinceAttempt);
  const adjustedMastery = masteryProbability * decayFactor + 0.5 * (1 - decayFactor);

  return Math.max(0, Math.min(1, adjustedMastery));
}

/**
 * Get mastery status based on probability thresholds
 */
export function getMasteryStatus(masteryProbability: number): 'unmastered' | 'learning' | 'basically_mastered' | 'mastered' {
  if (masteryProbability < 0.30) {
    return 'unmastered';
  } else if (masteryProbability < 0.60) {
    return 'learning';
  } else if (masteryProbability < 0.80) {
    return 'basically_mastered';
  } else {
    return 'mastered';
  }
}

/**
 * Calculate initial Bayesian params for a new knowledge point
 */
export function getInitialBayesianParams(): { alpha: number; beta: number } {
  return {
    alpha: DEFAULT_ALPHA_PRIOR,
    beta: DEFAULT_BETA_PRIOR
  };
}

/**
 * Create a new knowledge mastery record
 */
export function createKnowledgeMastery(): {
  attempts: number;
  correctCount: number;
  lastAttemptAt: string | null;
  evidenceHistory: { timestamp: string; result: 'correct' | 'incorrect' }[];
  bayesianParams: { alpha: number; beta: number };
  masteryProbability: number;
} {
  const params = getInitialBayesianParams();
  return {
    attempts: 0,
    correctCount: 0,
    lastAttemptAt: null,
    evidenceHistory: [],
    bayesianParams: params,
    masteryProbability: params.alpha / (params.alpha + params.beta) // 0.5 for uniform prior
  };
}

/**
 * Update knowledge mastery with a new answer
 */
export function recordAnswer(
  currentMastery: {
    attempts: number;
    correctCount: number;
    lastAttemptAt: string | null;
    evidenceHistory: { timestamp: string; result: 'correct' | 'incorrect' }[];
    bayesianParams: { alpha: number; beta: number };
    masteryProbability: number;
  },
  isCorrect: boolean
): {
  attempts: number;
  correctCount: number;
  lastAttemptAt: string;
  evidenceHistory: { timestamp: string; result: 'correct' | 'incorrect' }[];
  bayesianParams: { alpha: number; beta: number };
  masteryProbability: number;
} {
  const timestamp = new Date().toISOString();
  const newEvidence = { timestamp, result: isCorrect ? 'correct' as const : 'incorrect' as const };

  const newAttempts = currentMastery.attempts + 1;
  const newCorrectCount = currentMastery.correctCount + (isCorrect ? 1 : 0);

  // Bayesian update
  const result = updateBayesianParams({
    alphaPrior: currentMastery.bayesianParams.alpha,
    betaPrior: currentMastery.bayesianParams.beta,
    correctCount: isCorrect ? 1 : 0,
    incorrectCount: isCorrect ? 0 : 1
  });

  return {
    attempts: newAttempts,
    correctCount: newCorrectCount,
    lastAttemptAt: timestamp,
    evidenceHistory: [...currentMastery.evidenceHistory, newEvidence],
    bayesianParams: {
      alpha: result.alphaPosterior,
      beta: result.betaPosterior
    },
    masteryProbability: result.masteryProbability
  };
}

/**
 * Calculate upward propagation (parent node mastery from children)
 * Parent mastery = weighted average of child masteries
 */
export function calculateParentMastery(
  childMasteries: { knowledgePointId: string; masteryProbability: number; weight: number }[]
): number {
  const totalWeight = childMasteries.reduce((sum, child) => sum + child.weight, 0);
  if (totalWeight === 0) return 0.5;

  const weightedSum = childMasteries.reduce(
    (sum, child) => sum + child.masteryProbability * child.weight,
    0
  );

  return weightedSum / totalWeight;
}

/**
 * Get knowledge point name from ID (simplified - in production would use a knowledge graph)
 */
export function getKnowledgePointName(kpId: string): string {
  // Simplified mapping - in production this would come from a knowledge graph
  const parts = kpId.split('_');
  if (parts.length >= 2) {
    const subject = parts[0];
    const topic = parts.slice(1).join(' ');
    return `${subject.toUpperCase()} - ${topic}`;
  }
  return kpId;
}

/**
 * Generate parent guidance text for a weak point
 */
export function generateParentGuidance(kpId: string, masteryProbability: number): string {
  const kpName = getKnowledgePointName(kpId);

  if (masteryProbability < 0.15) {
    return `建议从基础概念重新讲解${kpName}，配合直观示例帮助理解。`;
  } else if (masteryProbability < 0.30) {
    return `建议先复习${kpName}的基础知识，再进行针对性练习。`;
  } else {
    return `建议通过多做练习题来巩固${kpName}，注意总结解题方法。`;
  }
}

export { LAMBDA_DECAY };
