import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryOne, runQuery, initDatabase } from '../db/database';
import {
  RecordAnswerRequest,
  AnswerRecord,
  LearningProfile
} from '../types';
import {
  recordAnswer,
  createKnowledgeMastery,
  getMasteryStatus
} from '../services/bayesian';
import { getWeakPoints, getStrongPoints } from '../services/recommender';

const router = Router();

let dbInitialized = false;
async function ensureDbInit() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

/**
 * POST /api/answer/record - Record an answer result
 */
router.post('/record', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const {
      player_id,
      session_id,
      co_op_session_id,
      contribution_type,
      assisted_by,
      question_id,
      knowledge_point_id,
      subject,
      difficulty,
      grade_level,
      question_content,
      player_answer,
      is_correct,
      time_spent_seconds,
      hint_used,
      attempt_number
    } = req.body as RecordAnswerRequest;

    if (!player_id || !question_id || !knowledge_point_id) {
      res.status(400).json({ error: 'player_id, question_id, and knowledge_point_id are required' });
      return;
    }

    const recordId = uuidv4();
    const answeredAt = new Date().toISOString();

    // Insert answer record
    runQuery(
      `INSERT INTO answer_records (
        record_id, player_id, session_id, co_op_session_id,
        contribution_type, assisted_by, question_id, knowledge_point_id,
        subject, difficulty, grade_level, question_content_json,
        player_answer, is_correct, time_spent_seconds, hint_used,
        attempt_number, answered_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recordId,
        player_id,
        session_id || null,
        co_op_session_id || null,
        contribution_type || 'solo',
        assisted_by || null,
        question_id,
        knowledge_point_id,
        subject,
        difficulty,
        grade_level,
        JSON.stringify(question_content),
        player_answer,
        is_correct ? 1 : 0,
        time_spent_seconds || null,
        hint_used ? 1 : 0,
        attempt_number || 1,
        answeredAt
      ]
    );

    // Update learning profile
    const profile = queryOne('SELECT * FROM learning_profiles WHERE player_id = ?', [player_id]) as LearningProfile | undefined;

    if (!profile) {
      res.status(404).json({ error: 'Player learning profile not found' });
      return;
    }

    // Parse current knowledge mastery
    const knowledgeMastery = JSON.parse(profile.knowledge_mastery_json);

    // Get or create mastery for this knowledge point
    if (!knowledgeMastery[knowledge_point_id]) {
      knowledgeMastery[knowledge_point_id] = createKnowledgeMastery();
    }

    // Update mastery with new answer
    knowledgeMastery[knowledge_point_id] = recordAnswer(
      knowledgeMastery[knowledge_point_id],
      is_correct
    );

    // Parse and update session stats
    const sessionStats = JSON.parse(profile.session_stats_json);
    sessionStats.totalQuestions += 1;
    if (is_correct) {
      sessionStats.totalCorrect += 1;
    }
    sessionStats.averageAccuracy = sessionStats.totalCorrect / sessionStats.totalQuestions;
    sessionStats.lastSessionAt = answeredAt;

    // Update weak and strong points
    const weakPoints = getWeakPoints(knowledgeMastery, 0.3);
    const strongPoints = getStrongPoints(knowledgeMastery, 0.8);

    // Update profile in database
    runQuery(
      `UPDATE learning_profiles
       SET knowledge_mastery_json = ?,
           session_stats_json = ?,
           weak_points_json = ?,
           strong_points_json = ?,
           updated_at = ?
       WHERE player_id = ?`,
      [
        JSON.stringify(knowledgeMastery),
        JSON.stringify(sessionStats),
        JSON.stringify(weakPoints),
        JSON.stringify(strongPoints),
        answeredAt,
        player_id
      ]
    );

    const mastery = knowledgeMastery[knowledge_point_id];

    res.status(201).json({
      success: true,
      recordId,
      knowledgePointId: knowledge_point_id,
      masteryProbability: mastery.masteryProbability,
      masteryStatus: getMasteryStatus(mastery.masteryProbability),
      attempts: mastery.attempts,
      correctCount: mastery.correctCount
    });
  } catch (error) {
    console.error('Error recording answer:', error);
    res.status(500).json({ error: 'Failed to record answer' });
  }
});

export default router;
