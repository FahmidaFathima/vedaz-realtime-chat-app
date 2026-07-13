import path from "node:path"
import { fileURLToPath } from "node:url"
import Database from "better-sqlite3"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATABASE_FILE = process.env.DATABASE_FILE || "connectchat.db"
const dbPath = path.isAbsolute(DATABASE_FILE)
  ? DATABASE_FILE
  : path.join(__dirname, DATABASE_FILE)

// Open (and create if needed) the SQLite database file.
const db = new Database(dbPath)

// Recommended pragmas for a small, write-friendly app.
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

// Create the messages table if it does not already exist.
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT NOT NULL,
    content   TEXT NOT NULL,
    timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )
`)

// Prepared statements (compiled once, reused for every call).
const insertStmt = db.prepare(
  "INSERT INTO messages (username, content, timestamp) VALUES (@username, @content, @timestamp)"
)
const getAllStmt = db.prepare("SELECT * FROM messages ORDER BY timestamp ASC, id ASC")
const getByIdStmt = db.prepare("SELECT * FROM messages WHERE id = ?")

/**
 * Return every chat message sorted by timestamp (oldest first).
 */
export function getAllMessages() {
  return getAllStmt.all()
}

/**
 * Persist a new message and return the saved row (including generated id).
 */
export function createMessage({ username, content }) {
  const timestamp = new Date().toISOString()
  const info = insertStmt.run({ username, content, timestamp })
  return getByIdStmt.get(info.lastInsertRowid)
}

export default db
