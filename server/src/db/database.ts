import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../../data/learning_tracking.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: SqlJsDatabase | null = null;
let dbInitialized = false;

export async function initDatabase(): Promise<SqlJsDatabase> {
  if (db && dbInitialized) {
    return db;
  }

  const SQL = await initSqlJs();

  // Load existing database or create new one
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    -- 玩家表
    CREATE TABLE IF NOT EXISTS players (
      player_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar_id TEXT,
      grade_level INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      parent_user_id TEXT NOT NULL
    );
  `);

  db.run(`
    -- 学习画像表
    CREATE TABLE IF NOT EXISTS learning_profiles (
      profile_id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL UNIQUE,
      knowledge_mastery_json TEXT NOT NULL DEFAULT '{}',
      session_stats_json TEXT NOT NULL DEFAULT '{"totalSessions":0,"totalQuestions":0,"totalCorrect":0,"averageAccuracy":0,"studyTimeMinutes":0,"lastSessionAt":null}',
      weak_points_json TEXT NOT NULL DEFAULT '[]',
      strong_points_json TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    -- 答题记录表
    CREATE TABLE IF NOT EXISTS answer_records (
      record_id TEXT PRIMARY KEY,
      player_id TEXT NOT NULL,
      session_id TEXT,
      co_op_session_id TEXT,
      contribution_type TEXT DEFAULT 'solo',
      assisted_by TEXT,
      question_id TEXT NOT NULL,
      knowledge_point_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      difficulty INTEGER NOT NULL,
      grade_level INTEGER NOT NULL,
      question_content_json TEXT NOT NULL,
      player_answer TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      time_spent_seconds INTEGER,
      hint_used INTEGER DEFAULT 0,
      attempt_number INTEGER DEFAULT 1,
      answered_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_answer_player ON answer_records(player_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_answer_kp ON answer_records(knowledge_point_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_answer_session ON answer_records(session_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_answer_coop ON answer_records(co_op_session_id);`);

  db.run(`
    -- 合作会话表
    CREATE TABLE IF NOT EXISTS co_op_sessions (
      co_op_session_id TEXT PRIMARY KEY,
      session_name TEXT,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      player_1_id TEXT NOT NULL,
      player_2_id TEXT NOT NULL
    );
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_coop_player1 ON co_op_sessions(player_1_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_coop_player2 ON co_op_sessions(player_2_id);`);

  db.run(`
    -- 题目表（题库）
    CREATE TABLE IF NOT EXISTS questions (
      question_id TEXT PRIMARY KEY,
      knowledge_point_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      difficulty INTEGER NOT NULL,
      grade_level INTEGER NOT NULL,
      content_json TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      hint_json TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_question_kp ON questions(knowledge_point_id);`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_question_difficulty ON questions(difficulty);`);

  saveDatabase();
  dbInitialized = true;
  console.log('Database initialized successfully');
  return db;
}

export function saveDatabase(): void {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

export function getDb(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// Synchronous wrapper for backward compatibility with existing code
export function initializeDatabase(): void {
  // This will be called from index.ts as async
  if (!dbInitialized) {
    initDatabase().catch(console.error);
  }
}

// Helper function to run a query and get all results
export function queryAll(sql: string, params: any[] = []): any[] {
  const database = getDb();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const results: any[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper function to run a query and get first result
export function queryOne(sql: string, params: any[] = []): any | undefined {
  const results = queryAll(sql, params);
  return results[0];
}

// Helper function to run an insert/update/delete
export function runQuery(sql: string, params: any[] = []): void {
  const database = getDb();
  database.run(sql, params);
  saveDatabase();
}

export default {
  initDatabase,
  getDb,
  saveDatabase,
  queryAll,
  queryOne,
  runQuery
};
