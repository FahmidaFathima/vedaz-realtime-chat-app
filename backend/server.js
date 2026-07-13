import "dotenv/config"
import http from "node:http"
import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import { getAllMessages, createMessage } from "./db.js"

const PORT = Number(process.env.PORT) || 3001
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*"

const app = express()
const server = http.createServer(app)

// Allow the configured client origin(s). "*" allows any origin (dev only).
const allowedOrigins =
  CLIENT_ORIGIN === "*" ? "*" : CLIENT_ORIGIN.split(",").map((o) => o.trim())

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
})

/* ----------------------------- Validation ----------------------------- */

function validateMessage(body) {
  const errors = []
  const username = typeof body?.username === "string" ? body.username.trim() : ""
  const content = typeof body?.content === "string" ? body.content.trim() : ""

  if (!username) errors.push("Username is required.")
  if (username.length > 40) errors.push("Username must be 40 characters or fewer.")
  if (!content) errors.push("Message content is required.")
  if (content.length > 2000) errors.push("Message must be 2000 characters or fewer.")

  return { errors, username, content }
}

/* ------------------------------- Routes -------------------------------- */

// Health check for the connection status indicator.
app.get("/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() })
})

// GET /messages -> all messages sorted by timestamp.
app.get("/messages", (_req, res) => {
  try {
    const messages = getAllMessages()
    res.json(messages)
  } catch (err) {
    console.error("[v0] Failed to read messages:", err.message)
    res.status(500).json({ error: "Failed to load messages." })
  }
})

// POST /messages -> save a message, broadcast it, and return the saved row.
app.post("/messages", (req, res) => {
  const { errors, username, content } = validateMessage(req.body)
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") })
  }

  try {
    const message = createMessage({ username, content })
    // Echo back the sender's clientId so clients can dedupe their own
    // optimistic message against the real-time broadcast (any arrival order).
    const clientId = typeof req.body?.clientId === "string" ? req.body.clientId : undefined
    const payload = clientId ? { ...message, clientId } : message
    // Broadcast to every connected Socket.io client in real time.
    io.emit("message:new", payload)
    res.status(201).json(payload)
  } catch (err) {
    console.error("[v0] Failed to save message:", err.message)
    res.status(500).json({ error: "Failed to save message." })
  }
})

/* --------------------------- Socket.io logic --------------------------- */

// Track connected users by socket id so we can report the online count.
const onlineUsers = new Map()

function broadcastPresence() {
  const usernames = [...new Set([...onlineUsers.values()])]
  io.emit("presence:update", { count: usernames.length, users: usernames })
}

io.on("connection", (socket) => {
  console.log("[v0] Client connected:", socket.id)

  // Client announces who it is right after connecting.
  socket.on("user:join", (username) => {
    const name = typeof username === "string" ? username.trim() : ""
    if (name) {
      onlineUsers.set(socket.id, name)
      socket.data.username = name
      socket.broadcast.emit("user:joined", name)
      broadcastPresence()
    }
  })

  // Send a message over the socket (alternative to the REST endpoint).
  socket.on("message:send", (payload, ack) => {
    const { errors, username, content } = validateMessage(payload)
    if (errors.length > 0) {
      if (typeof ack === "function") ack({ ok: false, error: errors.join(" ") })
      return
    }
    try {
      const message = createMessage({ username, content })
      const clientId = typeof payload?.clientId === "string" ? payload.clientId : undefined
      const out = clientId ? { ...message, clientId } : message
      io.emit("message:new", out)
      if (typeof ack === "function") ack({ ok: true, message: out })
    } catch (err) {
      console.error("[v0] Failed to save message via socket:", err.message)
      if (typeof ack === "function") ack({ ok: false, error: "Failed to save message." })
    }
  })

  // Typing indicator relay.
  socket.on("typing:start", (username) => {
    socket.broadcast.emit("typing:start", username)
  })
  socket.on("typing:stop", (username) => {
    socket.broadcast.emit("typing:stop", username)
  })

  socket.on("disconnect", () => {
    const name = onlineUsers.get(socket.id)
    onlineUsers.delete(socket.id)
    if (name) {
      socket.broadcast.emit("user:left", name)
      socket.broadcast.emit("typing:stop", name)
    }
    broadcastPresence()
    console.log("[v0] Client disconnected:", socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`[v0] ConnectChat backend running on http://localhost:${PORT}`)
})
