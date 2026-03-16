import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'nexus.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeDb(db);
  }
  return db;
}

function initializeDb(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      mode TEXT DEFAULT 'search',
      results_count INTEGER,
      ai_summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      title TEXT,
      snippet TEXT,
      source TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS search_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_history_query ON search_history(query);
    CREATE INDEX IF NOT EXISTS idx_history_created ON search_history(created_at DESC);
  `);
}

export function addSearchHistory(
  query: string,
  mode: string,
  resultsCount: number,
  aiSummary?: string
) {
  const database = getDb();
  const stmt = database.prepare(
    'INSERT INTO search_history (query, mode, results_count, ai_summary) VALUES (?, ?, ?, ?)'
  );
  return stmt.run(query, mode, resultsCount, aiSummary || null);
}

export function getSearchHistory(limit: number = 50) {
  const database = getDb();
  const stmt = database.prepare(
    'SELECT * FROM search_history ORDER BY created_at DESC LIMIT ?'
  );
  return stmt.all(limit);
}

export function searchHistoryByQuery(query: string, limit: number = 10) {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT DISTINCT query FROM search_history WHERE query LIKE ? ORDER BY created_at DESC LIMIT ?"
  );
  return stmt.all(`%${query}%`, limit) as { query: string }[];
}

export function addBookmark(
  url: string,
  title: string,
  snippet?: string,
  source?: string
) {
  const database = getDb();
  const stmt = database.prepare(
    'INSERT INTO bookmarks (url, title, snippet, source) VALUES (?, ?, ?, ?)'
  );
  return stmt.run(url, title, snippet || null, source || null);
}

export function getBookmarks(limit: number = 50) {
  const database = getDb();
  const stmt = database.prepare(
    'SELECT * FROM bookmarks ORDER BY created_at DESC LIMIT ?'
  );
  return stmt.all(limit);
}

export function deleteBookmark(id: number) {
  const database = getDb();
  const stmt = database.prepare('DELETE FROM bookmarks WHERE id = ?');
  return stmt.run(id);
}

export default getDb;
