import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryOne, queryAll, runQuery, initDatabase } from '../db/database';
import {
  CreatePlayerRequest,
  Player,
  LearningProfile,
  PlayerProfileResponse
} from '../types';
import { createKnowledgeMastery } from '../services/bayesian';

const router = Router();

// Ensure database is initialized
let dbInitialized = false;
async function ensureDbInit() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

/**
 * POST /api/player/create - Create a new player
 */
router.post('/create', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { name, avatar_id, grade_level, parent_user_id } = req.body as CreatePlayerRequest;

    if (!name || !parent_user_id) {
      res.status(400).json({ error: 'name and parent_user_id are required' });
      return;
    }

    const playerId = uuidv4();
    const profileId = uuidv4();
    const createdAt = new Date().toISOString();

    // Create player
    runQuery(
      `INSERT INTO players (player_id, name, avatar_id, grade_level, created_at, parent_user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [playerId, name, avatar_id || null, grade_level || 1, createdAt, parent_user_id]
    );

    // Create initial learning profile
    const initialMastery = createKnowledgeMastery();
    const initialStats = {
      totalSessions: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      averageAccuracy: 0,
      studyTimeMinutes: 0,
      lastSessionAt: null
    };

    runQuery(
      `INSERT INTO learning_profiles (
        profile_id, player_id, knowledge_mastery_json,
        session_stats_json, weak_points_json, strong_points_json, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        profileId,
        playerId,
        JSON.stringify({}),
        JSON.stringify(initialStats),
        JSON.stringify([]),
        JSON.stringify([]),
        createdAt
      ]
    );

    const player: Player = {
      player_id: playerId,
      name,
      avatar_id: avatar_id || null,
      grade_level: grade_level || 1,
      created_at: createdAt,
      parent_user_id
    };

    res.status(201).json({
      success: true,
      player
    });
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

/**
 * GET /api/player/:id/profile - Get player's learning profile
 */
router.get('/:id/profile', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { id } = req.params;

    // Get player
    const player = queryOne('SELECT * FROM players WHERE player_id = ?', [id]) as Player | undefined;

    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    // Get learning profile
    const profile = queryOne('SELECT * FROM learning_profiles WHERE player_id = ?', [id]) as LearningProfile | undefined;

    if (!profile) {
      res.status(404).json({ error: 'Learning profile not found' });
      return;
    }

    // Parse JSON fields
    const knowledgeMastery = JSON.parse(profile.knowledge_mastery_json);
    const sessionStats = JSON.parse(profile.session_stats_json);
    const weakPoints = JSON.parse(profile.weak_points_json);
    const strongPoints = JSON.parse(profile.strong_points_json);

    // Calculate recommended next (simplified: return weak points with lowest mastery)
    const recommendedNext = Object.entries(knowledgeMastery)
      .sort((a: any, b: any) => a[1].masteryProbability - b[1].masteryProbability)
      .slice(0, 5)
      .map(([kpId]) => kpId);

    const response: PlayerProfileResponse = {
      playerId: player.player_id,
      name: player.name,
      avatarId: player.avatar_id,
      gradeLevel: player.grade_level,
      createdAt: player.created_at,
      knowledgeMastery,
      sessionStats,
      weakPoints,
      strongPoints,
      recommendedNext
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting player profile:', error);
    res.status(500).json({ error: 'Failed to get player profile' });
  }
});

export default router;
