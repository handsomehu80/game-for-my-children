// Types for Learning Tracking System

export interface Player {
  player_id: string;
  name: string;
  avatar_id: string | null;
  grade_level: number;
  created_at: string;
  parent_user_id: string;
}

export interface KnowledgeMastery {
  attempts: number;
  correctCount: number;
  lastAttemptAt: string | null;
  evidenceHistory: EvidenceItem[];
  bayesianParams: BayesianParams;
  masteryProbability: number;
}

export interface BayesianParams {
  alpha: number;
  beta: number;
}

export interface EvidenceItem {
  timestamp: string;
  result: 'correct' | 'incorrect';
}

export interface SessionStats {
  totalSessions: number;
  totalQuestions: number;
  totalCorrect: number;
  averageAccuracy: number;
  studyTimeMinutes: number;
  lastSessionAt: string | null;
}

export interface LearningProfile {
  profile_id: string;
  player_id: string;
  knowledge_mastery_json: string; // JSON string of Record<string, KnowledgeMastery>
  session_stats_json: string; // JSON string of SessionStats
  weak_points_json: string; // JSON string of string[]
  strong_points_json: string; // JSON string of string[]
  updated_at: string;
}

export interface AnswerRecord {
  record_id: string;
  player_id: string;
  session_id: string | null;
  co_op_session_id: string | null;
  contribution_type: 'solo' | 'primary' | 'secondary' | 'assisted';
  assisted_by: string | null;
  question_id: string;
  knowledge_point_id: string;
  subject: string;
  difficulty: number;
  grade_level: number;
  question_content_json: string;
  player_answer: string;
  is_correct: number; // SQLite boolean
  time_spent_seconds: number | null;
  hint_used: number; // SQLite boolean
  attempt_number: number;
  answered_at: string;
}

export interface CoOpSession {
  co_op_session_id: string;
  session_name: string | null;
  started_at: string;
  ended_at: string | null;
  player_1_id: string;
  player_2_id: string;
}

export interface Question {
  question_id: string;
  knowledge_point_id: string;
  subject: string;
  difficulty: number;
  grade_level: number;
  content_json: string;
  correct_answer: string;
  hint_json: string | null;
  created_at: string;
}

// API Request/Response types

export interface CreatePlayerRequest {
  name: string;
  avatar_id?: string;
  grade_level?: number;
  parent_user_id: string;
}

export interface RecordAnswerRequest {
  player_id: string;
  session_id?: string;
  co_op_session_id?: string;
  contribution_type?: 'solo' | 'primary' | 'secondary' | 'assisted';
  assisted_by?: string;
  question_id: string;
  knowledge_point_id: string;
  subject: string;
  difficulty: number;
  grade_level: number;
  question_content: QuestionContent;
  player_answer: string;
  is_correct: boolean;
  time_spent_seconds?: number;
  hint_used?: boolean;
  attempt_number?: number;
}

export interface QuestionContent {
  stem: string;
  options: { text: string; isCorrect?: boolean }[];
  correctAnswer?: string;
}

export interface CreateCoopSessionRequest {
  session_name?: string;
  player_1_id: string;
  player_2_id: string;
}

export interface UpdateCoopSessionRequest {
  ended_at?: string;
  session_name?: string;
}

export interface PlayerProfileResponse {
  playerId: string;
  name: string;
  avatarId: string | null;
  gradeLevel: number;
  createdAt: string;
  knowledgeMastery: Record<string, KnowledgeMastery>;
  sessionStats: SessionStats;
  weakPoints: string[];
  strongPoints: string[];
  recommendedNext: string[];
}

export interface KnowledgeMasteryResponse {
  knowledgePointId: string;
  masteryProbability: number;
  attempts: number;
  correctCount: number;
  status: 'unmastered' | 'learning' | 'basically_mastered' | 'mastered';
  lastAttemptAt: string | null;
  evidenceHistory: EvidenceItem[];
  decayAdjustedMastery?: number;
}

export interface ParentSummaryResponse {
  playerId: string;
  name: string;
  gradeLevel: number;
  todayStats: {
    questionsAnswered: number;
    correctRate: number;
    studyMinutes: number;
    knowledgePointsCovered: number;
  };
  weakPoints: WeakPointDetail[];
  subjectSummary: SubjectSummary[];
}

export interface WeakPointDetail {
  knowledgePointId: string;
  knowledgePointName: string;
  masteryProbability: number;
  trend: 'improving' | 'stable' | 'declining';
  lastPracticedAt: string | null;
}

export interface SubjectSummary {
  subject: string;
  mastery: number;
  todayCorrect: number;
  todayTotal: number;
}

export interface WeakPointsResponse {
  playerId: string;
  weakPoints: WeakPointDetailFull[];
  totalWeakPoints: number;
  generatedAt: string;
}

export interface WeakPointDetailFull {
  knowledgePointId: string;
  knowledgePointName: string;
  subject: string;
  masteryProbability: number;
  attempts: number;
  correctCount: number;
  recentHistory: { date: string; result: 'correct' | 'incorrect' }[];
  recommendedPracticeCount: number;
  parentGuidance: string;
}

export interface ProgressResponse {
  playerId: string;
  period: 'week' | 'month' | 'semester';
  trendData: TrendDataPoint[];
  improvementRate: string;
  masteredKnowledgePointsThisPeriod: number;
  newlyWeakPointsThisPeriod: number;
}

export interface TrendDataPoint {
  date: string;
  avgMastery: number;
  questionsAnswered: number;
}

export interface CoopSessionResponse {
  coOpSessionId: string;
  sessionName: string | null;
  startedAt: string;
  endedAt: string | null;
  players: CoopPlayerStats[];
}

export interface CoopPlayerStats {
  playerId: string;
  contributionScore: number;
  questionsAnswered: number;
  correctRate: number;
}

// Recommendation types
export interface RecommendationScore {
  knowledgePointId: string;
  score: number;
  masteryGap: number;
  ucbBonus: number;
  noveltyBonus: number;
}

export interface MistakesResponse {
  playerId: string;
  mistakes: MistakeItem[];
  totalMistakes: number;
  weekNewMistakes: number;
  generatedAt: string;
}

export interface MistakeItem {
  questionId: string;
  knowledgePointId: string;
  knowledgePointName: string;
  subject: string;
  questionContent: string;
  correctAnswer: string;
  playerAnswer: string;
  isCorrect: boolean;
  difficulty: number;
  gradeLevel: number;
  answeredAt: string;
  timesReviewed: number;
}

export interface RecommendationsResponse {
  playerId: string;
  recommendations: RecommendationItem[];
  totalWeakPoints: number;
  generatedAt: string;
}

export interface RecommendationItem {
  knowledgePointId: string;
  knowledgePointName: string;
  subject: string;
  priority: number;
  reason: string;
  recommendedPracticeCount: number;
  estimatedMasteryImprovement: number;
}
