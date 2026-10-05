import { Router, Request, Response } from 'express';
import { queryOne, queryAll, initDatabase } from '../db/database';
import {
  Player,
  LearningProfile,
  AnswerRecord,
  ParentSummaryResponse,
  WeakPointsResponse,
  WeakPointDetail,
  WeakPointDetailFull,
  ProgressResponse,
  TrendDataPoint,
  MistakesResponse,
  MistakeItem,
  RecommendationsResponse,
  RecommendationItem
} from '../types';
import {
  calculateDecayAdjustedMastery,
  getMasteryStatus,
  getKnowledgePointName,
  generateParentGuidance
} from '../services/bayesian';
import { recommendKnowledgePoints, getWeakPoints } from '../services/recommender';

const router = Router();

let dbInitialized = false;
async function ensureDbInit() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

/**
 * GET /api/parent/:playerId/summary - Get parent dashboard summary
 */
router.get('/:playerId/summary', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { playerId } = req.params;

    // Get player
    const player = queryOne('SELECT * FROM players WHERE player_id = ?', [playerId]) as Player | undefined;

    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    // Get learning profile
    const profile = queryOne('SELECT * FROM learning_profiles WHERE player_id = ?', [playerId]) as LearningProfile | undefined;

    if (!profile) {
      res.status(404).json({ error: 'Learning profile not found' });
      return;
    }

    const knowledgeMastery = JSON.parse(profile.knowledge_mastery_json);
    const weakPoints = JSON.parse(profile.weak_points_json);

    // Get today's stats from answer records
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const todayStats = queryOne(
      `SELECT
        COUNT(*) as total,
        SUM(is_correct) as correct,
        SUM(time_spent_seconds) as study_time,
        COUNT(DISTINCT knowledge_point_id) as kp_covered
      FROM answer_records
      WHERE player_id = ? AND answered_at >= ?`,
      [playerId, todayStr]
    ) as {
      total: number;
      correct: number;
      study_time: number;
      kp_covered: number;
    };

    const questionsAnswered = todayStats?.total || 0;
    const correctRate = questionsAnswered > 0 ? (todayStats?.correct || 0) / questionsAnswered : 0;
    const studyMinutes = Math.round((todayStats?.study_time || 0) / 60);

    // Build weak points details
    const weakPointDetails: WeakPointDetail[] = weakPoints.slice(0, 5).map((kpId: string) => {
      const mastery = knowledgeMastery[kpId] as any;
      return {
        knowledgePointId: kpId,
        knowledgePointName: getKnowledgePointName(kpId),
        masteryProbability: mastery?.masteryProbability || 0.5,
        trend: 'stable' as const,
        lastPracticedAt: mastery?.lastAttemptAt || null
      };
    });

    // Build subject summary (simplified - based on unique subjects in answer records)
    const subjectStats = queryAll(
      `SELECT subject,
              COUNT(*) as total,
              SUM(is_correct) as correct
       FROM answer_records
       WHERE player_id = ? AND answered_at >= ?
       GROUP BY subject`,
      [playerId, todayStr]
    ) as {
      subject: string;
      total: number;
      correct: number;
    }[];

    const subjectSummary = subjectStats.map(s => ({
      subject: s.subject,
      mastery: knowledgeMastery[s.subject]?.masteryProbability || 0.5,
      todayCorrect: s.correct || 0,
      todayTotal: s.total
    }));

    const response: ParentSummaryResponse = {
      playerId,
      name: player.name,
      gradeLevel: player.grade_level,
      todayStats: {
        questionsAnswered,
        correctRate,
        studyMinutes,
        knowledgePointsCovered: todayStats?.kp_covered || 0
      },
      weakPoints: weakPointDetails,
      subjectSummary
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting parent summary:', error);
    res.status(500).json({ error: 'Failed to get parent summary' });
  }
});

/**
 * GET /api/parent/:playerId/weak-points - Get detailed weak points
 */
router.get('/:playerId/weak-points', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { playerId } = req.params;
    const minThreshold = parseFloat(req.query.minThreshold as string) || 0.3;
    const subject = req.query.subject as string | undefined;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get learning profile
    const profile = queryOne('SELECT * FROM learning_profiles WHERE player_id = ?', [playerId]) as LearningProfile | undefined;

    if (!profile) {
      res.status(404).json({ error: 'Player learning profile not found' });
      return;
    }

    const knowledgeMastery = JSON.parse(profile.knowledge_mastery_json);

    // Get weak points
    const weakPointsList = Object.entries(knowledgeMastery)
      .filter(([kpId, km]: [string, any]) => {
        if (km.masteryProbability >= minThreshold) return false;
        if (km.attempts === 0) return false;
        if (subject) {
          // Filter by subject in knowledge point ID
          if (!kpId.startsWith(subject)) return false;
        }
        return true;
      })
      .sort((a, b) => (a[1] as any).masteryProbability - (b[1] as any).masteryProbability)
      .slice(0, limit);

    // Get recent history for each weak point
    const weakPointDetailsFull: WeakPointDetailFull[] = weakPointsList.map(([kpId, km]) => {
      const mastery = km as any;
      // Get recent answer records for this knowledge point
      const recentRecords = queryAll(
        `SELECT DATE(answered_at) as date, is_correct
         FROM answer_records
         WHERE player_id = ? AND knowledge_point_id = ?
         ORDER BY answered_at DESC
         LIMIT 10`,
        [playerId, kpId]
      ) as {
        date: string;
        is_correct: number;
      }[];

      // Determine trend
      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (recentRecords.length >= 4) {
        const recent = recentRecords.slice(0, Math.ceil(recentRecords.length / 2));
        const older = recentRecords.slice(Math.ceil(recentRecords.length / 2));
        const recentCorrectRate = recent.filter(r => r.is_correct).length / recent.length;
        const olderCorrectRate = older.filter(r => r.is_correct).length / older.length;

        if (recentCorrectRate > olderCorrectRate + 0.1) {
          trend = 'improving';
        } else if (recentCorrectRate < olderCorrectRate - 0.1) {
          trend = 'declining';
        }
      }

      return {
        knowledgePointId: kpId,
        knowledgePointName: getKnowledgePointName(kpId),
        subject: kpId.split('_')[0],
        masteryProbability: mastery.masteryProbability,
        attempts: mastery.attempts,
        correctCount: mastery.correctCount,
        recentHistory: recentRecords.map(r => ({
          date: r.date,
          result: r.is_correct ? 'correct' as const : 'incorrect' as const
        })),
        recommendedPracticeCount: Math.ceil((0.6 - mastery.masteryProbability) * 20),
        parentGuidance: generateParentGuidance(kpId, mastery.masteryProbability)
      };
    });

    const response: WeakPointsResponse = {
      playerId,
      weakPoints: weakPointDetailsFull,
      totalWeakPoints: weakPointsList.length,
      generatedAt: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting weak points:', error);
    res.status(500).json({ error: 'Failed to get weak points' });
  }
});

/**
 * GET /api/parent/:playerId/progress - Get learning progress trend
 */
router.get('/:playerId/progress', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { playerId } = req.params;
    const period = (req.query.period as 'week' | 'month' | 'semester') || 'week';

    // Get learning profile
    const profile = queryOne('SELECT * FROM learning_profiles WHERE player_id = ?', [playerId]) as LearningProfile | undefined;

    if (!profile) {
      res.status(404).json({ error: 'Player learning profile not found' });
      return;
    }

    const knowledgeMastery = JSON.parse(profile.knowledge_mastery_json);

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'semester':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
    }

    // Get daily stats from answer records
    const dailyRecords = queryAll(
      `SELECT
        DATE(answered_at) as date,
        COUNT(*) as questions,
        SUM(is_correct) as correct
      FROM answer_records
      WHERE player_id = ? AND answered_at >= ?
      GROUP BY DATE(answered_at)
      ORDER BY date ASC`,
      [playerId, startDate.toISOString()]
    ) as {
      date: string;
      questions: number;
      correct: number;
    }[];

    // Get baseline mastery from start of period
    const baselineMasteries = Object.values(knowledgeMastery)
      .filter((km: any) => km.lastAttemptAt && new Date(km.lastAttemptAt) < startDate)
      .map((km: any) => km.masteryProbability);

    const baselineAvgMastery = baselineMasteries.length > 0
      ? baselineMasteries.reduce((a, b) => a + b, 0) / baselineMasteries.length
      : 0.5;

    // Calculate trend data
    const trendData: TrendDataPoint[] = dailyRecords.map(record => {
      // Get mastery at that date (simplified - using current and adjusting)
      const dayMastery = record.questions > 0
        ? record.correct / record.questions
        : 0;

      return {
        date: record.date,
        avgMastery: dayMastery,
        questionsAnswered: record.questions
      };
    });

    // Calculate improvement rate
    const currentAvgMastery = trendData.length > 0
      ? trendData.reduce((sum, d) => sum + d.avgMastery, 0) / trendData.length
      : baselineAvgMastery;

    const improvementRate = baselineAvgMastery > 0
      ? ((currentAvgMastery - baselineAvgMastery) / baselineAvgMastery * 100).toFixed(1)
      : '0';

    // Count mastered and newly weak knowledge points in period
    const masteredThisPeriod = Object.entries(knowledgeMastery)
      .filter(([kpId, km]) => {
        const mastery = km as any;
        if (mastery.masteryProbability < 0.8) return false;
        if (!mastery.lastAttemptAt) return false;
        const attemptDate = new Date(mastery.lastAttemptAt);
        return attemptDate >= startDate && attemptDate <= endDate;
      }).length;

    const newlyWeakThisPeriod = Object.entries(knowledgeMastery)
      .filter(([kpId, km]) => {
        const mastery = km as any;
        if (mastery.masteryProbability >= 0.3) return false;
        if (!mastery.evidenceHistory || mastery.evidenceHistory.length === 0) return false;
        const firstAttempt = new Date(mastery.evidenceHistory[0].timestamp);
        return firstAttempt >= startDate && firstAttempt <= endDate;
      }).length;

    const response: ProgressResponse = {
      playerId,
      period,
      trendData,
      improvementRate: `${parseFloat(improvementRate) > 0 ? '+' : ''}${improvementRate}%`,
      masteredKnowledgePointsThisPeriod: masteredThisPeriod,
      newlyWeakPointsThisPeriod: newlyWeakThisPeriod
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

/**
 * GET /api/parent/:playerId/mistakes - Get recent mistakes (wrong answers)
 */
router.get('/:playerId/mistakes', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { playerId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;

    // Get this week's start date
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    // Get recent mistakes (incorrect answers)
    const mistakes = queryAll(
      `SELECT 
        ar.question_id,
        ar.knowledge_point_id,
        ar.subject,
        ar.question_content_json,
        ar.player_answer,
        ar.is_correct,
        ar.difficulty,
        ar.grade_level,
        ar.answered_at
       FROM answer_records ar
       WHERE ar.player_id = ? AND ar.is_correct = 0
       ORDER BY ar.answered_at DESC
       LIMIT ?`,
      [playerId, limit]
    ) as {
      question_id: string;
      knowledge_point_id: string;
      subject: string;
      question_content_json: string;
      player_answer: string;
      is_correct: number;
      difficulty: number;
      grade_level: number;
      answered_at: string;
    }[];

    // Count this week's new mistakes
    const weekMistakesCount = queryOne(
      `SELECT COUNT(*) as count FROM answer_records 
       WHERE player_id = ? AND is_correct = 0 AND answered_at >= ?`,
      [playerId, weekStart.toISOString()]
    ) as { count: number };

    // Parse question content and build mistake items
    const mistakeItems: MistakeItem[] = mistakes.map(m => {
      let questionContent = '';
      let correctAnswer = '';
      
      try {
        const content = JSON.parse(m.question_content_json);
        questionContent = content.stem || '';
        if (content.options) {
          const correctOption = content.options.find((o: any) => o.isCorrect);
          if (correctOption) {
            correctAnswer = correctOption.text;
          }
        }
      } catch (e) {
        questionContent = m.question_content_json;
      }

      return {
        questionId: m.question_id,
        knowledgePointId: m.knowledge_point_id,
        knowledgePointName: getKnowledgePointName(m.knowledge_point_id),
        subject: m.subject,
        questionContent,
        correctAnswer,
        playerAnswer: m.player_answer,
        isCorrect: m.is_correct === 1,
        difficulty: m.difficulty,
        gradeLevel: m.grade_level,
        answeredAt: m.answered_at,
        timesReviewed: 0
      };
    });

    const response: MistakesResponse = {
      playerId,
      mistakes: mistakeItems,
      totalMistakes: mistakeItems.length,
      weekNewMistakes: weekMistakesCount?.count || 0,
      generatedAt: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting mistakes:', error);
    res.status(500).json({ error: 'Failed to get mistakes' });
  }
});

/**
 * GET /api/parent/:playerId/recommendations - Get learning recommendations
 */
router.get('/:playerId/recommendations', async (req: Request, res: Response) => {
  try {
    await ensureDbInit();
    const { playerId } = req.params;

    // Get player and learning profile
    const player = queryOne('SELECT * FROM players WHERE player_id = ?', [playerId]) as Player | undefined;
    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    const profile = queryOne('SELECT * FROM learning_profiles WHERE player_id = ?', [playerId]) as LearningProfile | undefined;
    if (!profile) {
      res.status(404).json({ error: 'Learning profile not found' });
      return;
    }

    const knowledgeMastery = JSON.parse(profile.knowledge_mastery_json);

    // Get weak points using recommender service
    const weakPoints = getWeakPoints(knowledgeMastery, 0.4);

    // Calculate total attempts
    const totalAttempts = Object.values(knowledgeMastery).reduce(
      (sum: number, km: any) => sum + (km.attempts || 0), 0
    );

    // Get recommended knowledge points
    const recommendedKpIds = recommendKnowledgePoints(
      { playerId, knowledgeMastery, totalAttempts },
      5
    );

    // Build recommendation items
    const recommendations: RecommendationItem[] = recommendedKpIds.map((kpId, index) => {
      const mastery = knowledgeMastery[kpId] as any;
      const currentMastery = mastery?.masteryProbability || 0.5;
      const targetMastery = 0.8;
      const estimatedImprovement = Math.max(0, (targetMastery - currentMastery) * 100);

      let reason = '';
      if (currentMastery < 0.3) {
        reason = '基础薄弱，需要重点加强';
      } else if (currentMastery < 0.5) {
        reason = '理解不深，需要强化练习';
      } else {
        reason = '需要进一步巩固提高';
      }

      return {
        knowledgePointId: kpId,
        knowledgePointName: getKnowledgePointName(kpId),
        subject: kpId.split('_')[0],
        priority: index + 1,
        reason,
        recommendedPracticeCount: Math.ceil((0.8 - currentMastery) * 20),
        estimatedMasteryImprovement: Math.round(estimatedImprovement)
      };
    });

    const response: RecommendationsResponse = {
      playerId,
      recommendations,
      totalWeakPoints: weakPoints.length,
      generatedAt: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

export default router;
