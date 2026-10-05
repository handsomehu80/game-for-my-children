import { Router, Request, Response } from 'express';
import { queryOne, initDatabase } from '../db/database';
import {
  LearningProfile,
  KnowledgeMasteryResponse
} from '../types';
import {
  calculateDecayAdjustedMastery,
  getMasteryStatus
} from '../services/bayesian';

const router = Router();

let dbInitialized = false;
async function ensureDbInit() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

/**
 * GET /api/knowledge/:id/mastery - Get knowledge point mastery for a player
 * Query params: player_id (required)
 */
router.get('/:id/mastery', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { id } = req.params;
    const { player_id } = req.query;

    if (!player_id || typeof player_id !== 'string') {
      res.status(400).json({ error: 'player_id query parameter is required' });
      return;
    }

    // Get learning profile
    const profile = queryOne('SELECT * FROM learning_profiles WHERE player_id = ?', [player_id]) as LearningProfile | undefined;

    if (!profile) {
      res.status(404).json({ error: 'Player learning profile not found' });
      return;
    }

    const knowledgeMastery = JSON.parse(profile.knowledge_mastery_json);
    const mastery = knowledgeMastery[id];

    if (!mastery) {
      // Return default/unattempted mastery
      const response: KnowledgeMasteryResponse = {
        knowledgePointId: id,
        masteryProbability: 0.5, // Default for new knowledge points
        attempts: 0,
        correctCount: 0,
        status: 'learning',
        lastAttemptAt: null,
        evidenceHistory: []
      };
      res.json(response);
      return;
    }

    // Calculate decay-adjusted mastery
    const decayAdjustedMastery = calculateDecayAdjustedMastery(
      mastery.masteryProbability,
      mastery.lastAttemptAt
    );

    const response: KnowledgeMasteryResponse = {
      knowledgePointId: id,
      masteryProbability: mastery.masteryProbability,
      attempts: mastery.attempts,
      correctCount: mastery.correctCount,
      status: getMasteryStatus(mastery.masteryProbability),
      lastAttemptAt: mastery.lastAttemptAt,
      evidenceHistory: mastery.evidenceHistory,
      decayAdjustedMastery
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting knowledge mastery:', error);
    res.status(500).json({ error: 'Failed to get knowledge mastery' });
  }
});

export default router;
