import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryOne, queryAll, runQuery, initDatabase } from '../db/database';
import {
  CreateCoopSessionRequest,
  UpdateCoopSessionRequest,
  CoOpSession,
  CoopSessionResponse,
  CoopPlayerStats
} from '../types';
import { calculateContributionScore } from '../services/recommender';

const router = Router();

let dbInitialized = false;
async function ensureDbInit() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

/**
 * POST /api/coop/session - Create a new co-op session
 */
router.post('/session', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { session_name, player_1_id, player_2_id } = req.body as CreateCoopSessionRequest;

    if (!player_1_id || !player_2_id) {
      res.status(400).json({ error: 'player_1_id and player_2_id are required' });
      return;
    }

    if (player_1_id === player_2_id) {
      res.status(400).json({ error: 'Cannot create co-op session with the same player' });
      return;
    }

    const coOpSessionId = uuidv4();
    const startedAt = new Date().toISOString();

    runQuery(
      `INSERT INTO co_op_sessions (co_op_session_id, session_name, started_at, player_1_id, player_2_id)
       VALUES (?, ?, ?, ?, ?)`,
      [coOpSessionId, session_name || null, startedAt, player_1_id, player_2_id]
    );

    const response: CoopSessionResponse = {
      coOpSessionId,
      sessionName: session_name || null,
      startedAt,
      endedAt: null,
      players: [
        { playerId: player_1_id, contributionScore: 0, questionsAnswered: 0, correctRate: 0 },
        { playerId: player_2_id, contributionScore: 0, questionsAnswered: 0, correctRate: 0 }
      ]
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating co-op session:', error);
    res.status(500).json({ error: 'Failed to create co-op session' });
  }
});

/**
 * PUT /api/coop/session/:id - Update a co-op session (end it or update name)
 */
router.put('/session/:id', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { id } = req.params;
    const { ended_at, session_name } = req.body as UpdateCoopSessionRequest;

    // Get existing session
    const session = queryOne('SELECT * FROM co_op_sessions WHERE co_op_session_id = ?', [id]) as CoOpSession | undefined;

    if (!session) {
      res.status(404).json({ error: 'Co-op session not found' });
      return;
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];

    if (ended_at !== undefined) {
      updates.push('ended_at = ?');
      values.push(ended_at);
    }

    if (session_name !== undefined) {
      updates.push('session_name = ?');
      values.push(session_name);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No updates provided' });
      return;
    }

    values.push(id);

    runQuery(
      `UPDATE co_op_sessions SET ${updates.join(', ')} WHERE co_op_session_id = ?`,
      values
    );

    // Calculate player stats from answer records
    const player1Stats = getPlayerCoopStats(id, session.player_1_id);
    const player2Stats = getPlayerCoopStats(id, session.player_2_id);

    const response: CoopSessionResponse = {
      coOpSessionId: id,
      sessionName: session_name !== undefined ? session_name : session.session_name,
      startedAt: session.started_at,
      endedAt: ended_at !== undefined ? ended_at : session.ended_at,
      players: [player1Stats, player2Stats]
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating co-op session:', error);
    res.status(500).json({ error: 'Failed to update co-op session' });
  }
});

/**
 * GET /api/coop/session/:id - Get co-op session details
 */
router.get('/session/:id', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { id } = req.params;

    const session = queryOne('SELECT * FROM co_op_sessions WHERE co_op_session_id = ?', [id]) as CoOpSession | undefined;

    if (!session) {
      res.status(404).json({ error: 'Co-op session not found' });
      return;
    }

    // Calculate player stats
    const player1Stats = getPlayerCoopStats(id, session.player_1_id);
    const player2Stats = getPlayerCoopStats(id, session.player_2_id);

    const response: CoopSessionResponse = {
      coOpSessionId: id,
      sessionName: session.session_name,
      startedAt: session.started_at,
      endedAt: session.ended_at,
      players: [player1Stats, player2Stats]
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting co-op session:', error);
    res.status(500).json({ error: 'Failed to get co-op session' });
  }
});

/**
 * GET /api/coop/sessions/:playerId - Get all co-op sessions for a player
 */
router.get('/sessions/:playerId', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { playerId } = req.params;

    const sessions = queryAll(
      `SELECT * FROM co_op_sessions
       WHERE player_1_id = ? OR player_2_id = ?
       ORDER BY started_at DESC`,
      [playerId, playerId]
    ) as CoOpSession[];

    const responses: CoopSessionResponse[] = sessions.map(session => {
      const player1Stats = getPlayerCoopStats(session.co_op_session_id, session.player_1_id);
      const player2Stats = getPlayerCoopStats(session.co_op_session_id, session.player_2_id);

      return {
        coOpSessionId: session.co_op_session_id,
        sessionName: session.session_name,
        startedAt: session.started_at,
        endedAt: session.ended_at,
        players: [player1Stats, player2Stats]
      };
    });

    res.json(responses);
  } catch (error) {
    console.error('Error getting co-op sessions:', error);
    res.status(500).json({ error: 'Failed to get co-op sessions' });
  }
});

/**
 * Helper function to calculate player stats within a co-op session
 */
function getPlayerCoopStats(coopSessionId: string, playerId: string): CoopPlayerStats {
  // Get answer records for this player in this co-op session
  const stats = queryOne(
    `SELECT
      COUNT(*) as total,
      SUM(is_correct) as correct,
      SUM(CASE WHEN contribution_type = 'solo' THEN 1 ELSE 0 END) as solo_count,
      SUM(CASE WHEN contribution_type = 'primary' THEN 1 ELSE 0 END) as primary_count,
      SUM(CASE WHEN contribution_type = 'secondary' THEN 1 ELSE 0 END) as secondary_count,
      SUM(CASE WHEN contribution_type = 'assisted' THEN 1 ELSE 0 END) as assisted_count
    FROM answer_records
    WHERE co_op_session_id = ? AND player_id = ?`,
    [coopSessionId, playerId]
  ) as {
    total: number;
    correct: number;
    solo_count: number;
    primary_count: number;
    secondary_count: number;
    assisted_count: number;
  };

  const total = stats?.total || 0;
  const correct = stats?.correct || 0;
  const correctRate = total > 0 ? correct / total : 0;

  const contributionScore = calculateContributionScore(
    stats?.solo_count || 0,
    stats?.primary_count || 0,
    stats?.secondary_count || 0,
    stats?.assisted_count || 0
  );

  return {
    playerId,
    contributionScore,
    questionsAnswered: total,
    correctRate
  };
}

export default router;
