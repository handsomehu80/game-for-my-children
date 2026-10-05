// src/pages/ParentDashboard.tsx
// Parent Dashboard - Learning progress overview for parents

import { useState } from 'react'

const API_BASE = 'http://localhost:3001/api'

// Types matching backend API responses
interface TodayStats {
  questionsAnswered: number
  correctRate: number
  studyMinutes: number
  knowledgePointsCovered: number
}

interface WeakPointDetail {
  knowledgePointId: string
  knowledgePointName: string
  masteryProbability: number
  trend: 'improving' | 'stable' | 'declining'
  lastPracticedAt: string | null
}

interface SubjectSummary {
  subject: string
  mastery: number
  todayCorrect: number
  todayTotal: number
}

interface ParentSummary {
  playerId: string
  name: string
  gradeLevel: number
  todayStats: TodayStats
  weakPoints: WeakPointDetail[]
  subjectSummary: SubjectSummary[]
}

interface WeakPointDetailFull {
  knowledgePointId: string
  knowledgePointName: string
  subject: string
  masteryProbability: number
  attempts: number
  correctCount: number
  recentHistory: { date: string; result: 'correct' | 'incorrect' }[]
  recommendedPracticeCount: number
  parentGuidance: string
}

interface WeakPointsResponse {
  playerId: string
  weakPoints: WeakPointDetailFull[]
  totalWeakPoints: number
  generatedAt: string
}

interface ProgressResponse {
  playerId: string
  period: 'week' | 'month' | 'semester'
  trendData: { date: string; avgMastery: number; questionsAnswered: number }[]
  improvementRate: string
  masteredKnowledgePointsThisPeriod: number
  newlyWeakPointsThisPeriod: number
}

interface MistakeItem {
  questionId: string
  knowledgePointId: string
  knowledgePointName: string
  subject: string
  questionContent: string
  correctAnswer: string
  playerAnswer: string
  isCorrect: boolean
  difficulty: number
  gradeLevel: number
  answeredAt: string
  timesReviewed: number
}

interface MistakesResponse {
  playerId: string
  mistakes: MistakeItem[]
  totalMistakes: number
  weekNewMistakes: number
  generatedAt: string
}

interface RecommendationItem {
  knowledgePointId: string
  knowledgePointName: string
  subject: string
  priority: number
  reason: string
  recommendedPracticeCount: number
  estimatedMasteryImprovement: number
}

interface RecommendationsResponse {
  playerId: string
  recommendations: RecommendationItem[]
  totalWeakPoints: number
  generatedAt: string
}

// Game time control interface
interface GameTimeControl {
  todayMinutes: number
  dailyLimitMinutes: number
}

export function ParentDashboard() {
  const [playerId, setPlayerId] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [summary, setSummary] = useState<ParentSummary | null>(null)
  const [weakPoints, setWeakPoints] = useState<WeakPointsResponse | null>(null)
  const [progress, setProgress] = useState<ProgressResponse | null>(null)
  const [mistakes, setMistakes] = useState<MistakesResponse | null>(null)
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null)
  const [gameTime, setGameTime] = useState<GameTimeControl>({ todayMinutes: 0, dailyLimitMinutes: 60 })

  // Fetch all dashboard data
  const fetchDashboardData = async (pId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const [summaryRes, weakRes, progressRes, mistakesRes, recsRes] = await Promise.all([
        fetch(`${API_BASE}/parent/${pId}/summary`),
        fetch(`${API_BASE}/parent/${pId}/weak-points`),
        fetch(`${API_BASE}/parent/${pId}/progress?period=week`),
        fetch(`${API_BASE}/parent/${pId}/mistakes?limit=10`),
        fetch(`${API_BASE}/parent/${pId}/recommendations`)
      ])

      if (!summaryRes.ok || !weakRes.ok || !progressRes.ok || !mistakesRes.ok || !recsRes.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const [summaryData, weakData, progressData, mistakesData, recsData] = await Promise.all([
        summaryRes.json(),
        weakRes.json(),
        progressRes.json(),
        mistakesRes.json(),
        recsRes.json()
      ])

      setSummary(summaryData)
      setWeakPoints(weakData)
      setProgress(progressData)
      setMistakes(mistakesData)
      setRecommendations(recsData)
      
      // Load game time from localStorage
      const savedLimit = localStorage.getItem(`gameTimeLimit_${pId}`)
      const todayMinutes = parseInt(localStorage.getItem(`gameTimeToday_${pId}`) || '0', 10)
      setGameTime({
        todayMinutes,
        dailyLimitMinutes: savedLimit ? parseInt(savedLimit, 10) : 60
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Handle player ID submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerId.trim()) {
      fetchDashboardData(playerId.trim())
    }
  }

  // Update game time limit
  const updateGameTimeLimit = (newLimit: number) => {
    setGameTime(prev => ({ ...prev, dailyLimitMinutes: newLimit }))
    localStorage.setItem(`gameTimeLimit_${playerId}`, String(newLimit))
  }

  // Get trend indicator
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈'
      case 'declining': return '📉'
      default: return '➡️'
    }
  }

  // Categorize weak points by mastery level
  const categorizeWeakPoints = () => {
    if (!weakPoints) return { weak: [], learning: [], toConsolidate: [] }
      
    const weak: WeakPointDetailFull[] = []
    const learning: WeakPointDetailFull[] = []
    const toConsolidate: WeakPointDetailFull[] = []
      
    weakPoints.weakPoints.forEach(wp => {
      if (wp.masteryProbability < 0.3) {
        weak.push(wp)
      } else if (wp.masteryProbability < 0.6) {
        learning.push(wp)
      } else {
        toConsolidate.push(wp)
      }
    })
      
    return { weak, learning, toConsolidate }
  }
    
  // Determine trend from recent history
  const getTrendFromHistory = (history: { date: string; result: 'correct' | 'incorrect' }[]): string => {
    if (history.length < 4) return 'stable'
    const recent = history.slice(0, Math.ceil(history.length / 2))
    const older = history.slice(Math.ceil(history.length / 2))
    const recentCorrectRate = recent.filter(r => r.result === 'correct').length / recent.length
    const olderCorrectRate = older.filter(r => r.result === 'correct').length / older.length
      
    if (recentCorrectRate > olderCorrectRate + 0.1) return 'improving'
    if (recentCorrectRate < olderCorrectRate - 0.1) return 'declining'
    return 'stable'
  }

  const categorizedPoints = categorizeWeakPoints()

  return (
    <div className="parent-dashboard">
      <style>{`
        .parent-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 20px;
          color: white;
        }
        
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .dashboard-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .dashboard-header h1 {
          font-size: 2.5rem;
          background: linear-gradient(45deg, #00d9ff, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }
        
        .player-input-form {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
        }
        
        .player-input-form input {
          padding: 12px 20px;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 300px;
        }
        
        .player-input-form input:focus {
          outline: none;
          border-color: #00d9ff;
        }
        
        .player-input-form button {
          padding: 12px 30px;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          background: linear-gradient(45deg, #00d9ff, #00ff88);
          color: #1a1a2e;
          font-weight: bold;
          cursor: pointer;
        }
        
        .player-input-form button:hover {
          transform: scale(1.05);
        }
        
        .loading, .error, .no-data {
          text-align: center;
          padding: 60px 20px;
          font-size: 1.2rem;
        }
        
        .error {
          color: #ff4444;
        }
        
        .section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .section-title {
          font-size: 1.4rem;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .stat-card {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        
        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #00d9ff;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 8px;
        }
        
        .knowledge-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        
        @media (max-width: 900px) {
          .knowledge-columns {
            grid-template-columns: 1fr;
          }
        }
        
        .knowledge-column {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
        }
        
        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .column-title {
          font-size: 1.1rem;
          font-weight: bold;
        }
        
        .column-count {
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
        }
        
        .knowledge-item {
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 8px;
        }
        
        .knowledge-item-name {
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        
        .knowledge-item-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .progress-bar-container {
          margin-bottom: 30px;
        }
        
        .progress-bar-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }
        
        .progress-bar {
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }
        
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #00d9ff, #00ff88);
          transition: width 0.5s ease;
        }
        
        .improvement-rate {
          text-align: center;
          padding: 16px;
          background: rgba(0, 255, 136, 0.1);
          border-radius: 12px;
          margin-top: 16px;
        }
        
        .improvement-value {
          font-size: 2rem;
          font-weight: bold;
          color: #00ff88;
        }
        
        .mistakes-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .mistake-item {
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin-bottom: 12px;
          border-left: 4px solid #ff4444;
        }
        
        .mistake-question {
          font-size: 1rem;
          margin-bottom: 8px;
        }
        
        .mistake-answers {
          display: flex;
          gap: 20px;
          font-size: 0.9rem;
        }
        
        .mistake-correct {
          color: #00ff88;
        }
        
        .mistake-wrong {
          color: #ff4444;
        }
        
        .mistake-meta {
          display: flex;
          gap: 16px;
          margin-top: 8px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
        }
        
        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .recommendation-item {
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .recommendation-priority {
          width: 32px;
          height: 32px;
          background: linear-gradient(45deg, #00d9ff, #00ff88);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #1a1a2e;
        }
        
        .recommendation-content {
          flex: 1;
          margin-left: 16px;
        }
        
        .recommendation-name {
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .recommendation-reason {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .recommendation-stats {
          text-align: right;
        }
        
        .recommendation-practice {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .game-time-section {
          display: flex;
          gap: 30px;
          align-items: center;
        }
        
        .game-time-display {
          flex: 1;
        }
        
        .game-time-value {
          font-size: 3rem;
          font-weight: bold;
          color: #00d9ff;
        }
        
        .game-time-unit {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .time-limit-control {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .time-limit-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .time-limit-input {
          width: 80px;
          padding: 8px 12px;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          text-align: center;
        }
        
        .time-limit-input:focus {
          outline: none;
          border-color: #00d9ff;
        }
        
        .time-limit-btn {
          padding: 8px 16px;
          font-size: 0.9rem;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .time-limit-btn:hover {
          background: rgba(0, 217, 255, 0.3);
        }
        
        .time-remaining {
          margin-top: 16px;
        }
        
        .subject-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }
        
        .subject-chip {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-size: 0.9rem;
        }
        
        .subject-chip span {
          color: #00d9ff;
          font-weight: bold;
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>📊 家长Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>查看孩子学习进度与表现</p>
          
          <form className="player-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="输入玩家ID (player_id)"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
            />
            <button type="submit">查看详情</button>
          </form>
        </div>

        {loading && (
          <div className="loading">
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
            加载中...
          </div>
        )}

        {error && (
          <div className="error">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && !summary && (
          <div className="no-data">
            请输入玩家ID查看学习报告
          </div>
        )}

        {!loading && !error && summary && (
          <>
            {/* Player Info */}
            <div className="section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0 }}>{summary.name}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0' }}>
                    年级 {summary.gradeLevel}
                  </p>
                </div>
                <div className="subject-chips">
                  {summary.subjectSummary.map(s => (
                    <div key={s.subject} className="subject-chip">
                      {s.subject}: <span>{Math.round(s.mastery * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Week Summary */}
            <div className="section">
              <h2 className="section-title">📅 本周学习概览</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{summary.todayStats.questionsAnswered}</div>
                  <div className="stat-label">答题数</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{Math.round(summary.todayStats.correctRate * 100)}%</div>
                  <div className="stat-label">正确率</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{summary.todayStats.studyMinutes}</div>
                  <div className="stat-label">学习时长(分钟)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{summary.todayStats.knowledgePointsCovered}</div>
                  <div className="stat-label">知识点覆盖</div>
                </div>
              </div>
            </div>

            {/* Progress Trend */}
            {progress && (
              <div className="section">
                <h2 className="section-title">📈 学习进步趋势</h2>
                <div className="progress-bar-container">
                  <div className="progress-bar-label">
                    <span>本周掌握度变化</span>
                    <span>{progress.masteredKnowledgePointsThisPeriod} 个知识点已掌握</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${Math.min(100, Math.max(0, parseFloat(progress.improvementRate) + 50))}%` }}
                    />
                  </div>
                </div>
                <div className="improvement-rate">
                  <div>较上周提升</div>
                  <div className="improvement-value">{progress.improvementRate}</div>
                </div>
              </div>
            )}

            {/* Knowledge Mastery Analysis */}
            <div className="section">
              <h2 className="section-title">🧠 知识点掌握分析</h2>
              <div className="knowledge-columns">
                {/* Weak Points */}
                <div className="knowledge-column">
                  <div className="column-header">
                    <span className="column-title" style={{ color: '#ff4444' }}>🔴 薄弱</span>
                    <span className="column-count">{categorizedPoints.weak.length}</span>
                  </div>
                  {categorizedPoints.weak.slice(0, 5).map(wp => (
                    <div key={wp.knowledgePointId} className="knowledge-item">
                      <div className="knowledge-item-name">{wp.knowledgePointName}</div>
                      <div className="knowledge-item-meta">
                        <span>掌握度 {Math.round(wp.masteryProbability * 100)}%</span>
                        <span>{getTrendIcon(getTrendFromHistory(wp.recentHistory))}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Learning Points */}
                <div className="knowledge-column">
                  <div className="column-header">
                    <span className="column-title" style={{ color: '#ffd700' }}>🟡 待巩固</span>
                    <span className="column-count">{categorizedPoints.learning.length}</span>
                  </div>
                  {categorizedPoints.learning.slice(0, 5).map(wp => (
                    <div key={wp.knowledgePointId} className="knowledge-item">
                      <div className="knowledge-item-name">{wp.knowledgePointName}</div>
                      <div className="knowledge-item-meta">
                        <span>掌握度 {Math.round(wp.masteryProbability * 100)}%</span>
                        <span>{getTrendIcon(getTrendFromHistory(wp.recentHistory))}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mastered Points */}
                <div className="knowledge-column">
                  <div className="column-header">
                    <span className="column-title" style={{ color: '#00ff88' }}>🟢 熟练</span>
                    <span className="column-count">{categorizedPoints.toConsolidate.length}</span>
                  </div>
                  {categorizedPoints.toConsolidate.slice(0, 5).map(wp => (
                    <div key={wp.knowledgePointId} className="knowledge-item">
                      <div className="knowledge-item-name">{wp.knowledgePointName}</div>
                      <div className="knowledge-item-meta">
                        <span>掌握度 {Math.round(wp.masteryProbability * 100)}%</span>
                        <span>{getTrendIcon(getTrendFromHistory(wp.recentHistory))}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mistakes Book */}
            {mistakes && mistakes.mistakes.length > 0 && (
              <div className="section">
                <h2 className="section-title">
                  📝 错题本 
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginLeft: '10px' }}>
                    本周新错题: {mistakes.weekNewMistakes} 道
                  </span>
                </h2>
                <div className="mistakes-list">
                  {mistakes.mistakes.slice(0, 5).map(mistake => (
                    <div key={mistake.questionId} className="mistake-item">
                      <div className="mistake-question">{mistake.questionContent}</div>
                      <div className="mistake-answers">
                        <span className="mistake-correct">✓ 正确答案: {mistake.correctAnswer}</span>
                        <span className="mistake-wrong">✗ 孩子回答: {mistake.playerAnswer}</span>
                      </div>
                      <div className="mistake-meta">
                        <span>{mistake.subject}</span>
                        <span>难度 {mistake.difficulty}</span>
                        <span>{new Date(mistake.answeredAt).toLocaleDateString()}</span>
                        <span>{mistake.knowledgePointName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations && recommendations.recommendations.length > 0 && (
              <div className="section">
                <h2 className="section-title">💡 提升建议</h2>
                <div className="recommendations-list">
                  {recommendations.recommendations.map(rec => (
                    <div key={rec.knowledgePointId} className="recommendation-item">
                      <div className="recommendation-priority">{rec.priority}</div>
                      <div className="recommendation-content">
                        <div className="recommendation-name">{rec.knowledgePointName}</div>
                        <div className="recommendation-reason">{rec.reason}</div>
                      </div>
                      <div className="recommendation-stats">
                        <div style={{ color: '#00d9ff', fontWeight: 'bold' }}>
                          预计提升 {rec.estimatedMasteryImprovement}%
                        </div>
                        <div className="recommendation-practice">
                          建议练习 {rec.recommendedPracticeCount} 道题
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Game Time Control */}
            <div className="section">
              <h2 className="section-title">🎮 游戏时间控制</h2>
              <div className="game-time-section">
                <div className="game-time-display">
                  <div className="game-time-value">{gameTime.todayMinutes}</div>
                  <div className="game-time-unit">今日已用分钟</div>
                  <div className="time-remaining">
                    <div className="progress-bar" style={{ marginTop: '12px' }}>
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${Math.min(100, (gameTime.todayMinutes / gameTime.dailyLimitMinutes) * 100)}%`,
                          background: gameTime.todayMinutes >= gameTime.dailyLimitMinutes 
                            ? 'linear-gradient(90deg, #ff4444, #ff6666)' 
                            : 'linear-gradient(90deg, #00d9ff, #00ff88)'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '0.85rem', marginTop: '8px', color: 'rgba(255,255,255,0.6)' }}>
                      剩余 {Math.max(0, gameTime.dailyLimitMinutes - gameTime.todayMinutes)} 分钟
                    </div>
                  </div>
                </div>
                <div className="time-limit-control">
                  <span className="time-limit-label">每日上限:</span>
                  <input
                    type="number"
                    className="time-limit-input"
                    value={gameTime.dailyLimitMinutes}
                    onChange={(e) => updateGameTimeLimit(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    max="480"
                  />
                  <span className="time-limit-label">分钟</span>
                  <button 
                    className="time-limit-btn"
                    onClick={() => updateGameTimeLimit(60)}
                  >
                    1小时
                  </button>
                  <button 
                    className="time-limit-btn"
                    onClick={() => updateGameTimeLimit(120)}
                  >
                    2小时
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ParentDashboard
