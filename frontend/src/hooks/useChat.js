import { useCallback, useEffect, useRef, useState } from "react"
import socket from "../socket.js"
import { fetchMessages, sendMessage as apiSendMessage } from "../api.js"
import { useToast } from "../components/Toast.jsx"

/**
 * Central chat state: loads history, keeps the socket connection in sync,
 * tracks connection status, presence, and typing indicators.
 */
export function useChat(username) {
  const toast = useToast()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(socket.connected ? "connected" : "connecting")
  const [onlineCount, setOnlineCount] = useState(0)
  const [typingUsers, setTypingUsers] = useState([])

  const typingTimersRef = useRef(new Map())
  const loadErrorShownRef = useRef(false)

  const upsertMessage = useCallback((incoming) => {
    setMessages((prev) => {
      // Reconcile against our own optimistic bubble via the round-tripped clientId.
      if (incoming.clientId) {
        const idx = prev.findIndex((m) => m.clientId === incoming.clientId)
        if (idx !== -1) {
          const next = [...prev]
          next[idx] = { ...incoming, pending: false }
          return next
        }
      }
      // Skip duplicates by persisted id (e.g. socket echo after REST already applied).
      if (incoming.id && prev.some((m) => m.id === incoming.id)) return prev
      return [...prev, incoming]
    })
  }, [])

  // Load message history over REST.
  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchMessages()
      setMessages(data)
      loadErrorShownRef.current = false
    } catch (err) {
      console.log("[v0] Failed to load messages:", err.message)
      if (!loadErrorShownRef.current) {
        toast.error("Could not load chat history. Retrying when reconnected.")
        loadErrorShownRef.current = true
      }
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // Wire up socket lifecycle + event listeners.
  useEffect(() => {
    if (!username) return

    function handleConnect() {
      setStatus("connected")
      socket.emit("user:join", username)
      // Re-sync history in case we missed messages while disconnected.
      loadHistory()
    }

    function handleReconnectAttempt() {
      setStatus("connecting")
    }

    function handleDisconnect(reason) {
      setStatus("disconnected")
      setTypingUsers([])
      console.log("[v0] Socket disconnected:", reason)
    }

    function handleConnectError(err) {
      setStatus("disconnected")
      console.log("[v0] Socket connect error:", err.message)
    }

    function handleReconnect() {
      toast.success("Reconnected to chat.")
    }

    function handleNewMessage(message) {
      upsertMessage(message)
    }

    function handlePresence({ count }) {
      setOnlineCount(count)
    }

    function handleUserJoined(name) {
      if (name && name !== username) toast.info(`${name} joined the chat.`)
    }

    function handleUserLeft(name) {
      if (name && name !== username) toast.info(`${name} left the chat.`)
    }

    function addTyping(name) {
      if (!name || name === username) return
      setTypingUsers((prev) => (prev.includes(name) ? prev : [...prev, name]))
      // Safety timeout in case a stop event is missed.
      clearTimeout(typingTimersRef.current.get(name))
      typingTimersRef.current.set(
        name,
        setTimeout(() => removeTyping(name), 4000)
      )
    }

    function removeTyping(name) {
      setTypingUsers((prev) => prev.filter((u) => u !== name))
      clearTimeout(typingTimersRef.current.get(name))
      typingTimersRef.current.delete(name)
    }

    socket.on("connect", handleConnect)
    socket.io.on("reconnect_attempt", handleReconnectAttempt)
    socket.io.on("reconnect", handleReconnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("connect_error", handleConnectError)
    socket.on("message:new", handleNewMessage)
    socket.on("presence:update", handlePresence)
    socket.on("user:joined", handleUserJoined)
    socket.on("user:left", handleUserLeft)
    socket.on("typing:start", addTyping)
    socket.on("typing:stop", removeTyping)

    // If already connected (e.g. StrictMode remount), announce immediately.
    if (socket.connected) handleConnect()

    return () => {
      socket.off("connect", handleConnect)
      socket.io.off("reconnect_attempt", handleReconnectAttempt)
      socket.io.off("reconnect", handleReconnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("connect_error", handleConnectError)
      socket.off("message:new", handleNewMessage)
      socket.off("presence:update", handlePresence)
      socket.off("user:joined", handleUserJoined)
      socket.off("user:left", handleUserLeft)
      socket.off("typing:start", addTyping)
      socket.off("typing:stop", removeTyping)
      const timers = typingTimersRef.current
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
    }
  }, [username, loadHistory, toast, upsertMessage])

  // Send a message with optimistic UI, falling back through REST.
  const sendMessage = useCallback(
    async (content) => {
      const clientId = `c-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const optimistic = {
        clientId,
        username,
        content,
        timestamp: new Date().toISOString(),
        pending: true,
      }
      upsertMessage(optimistic)

      try {
        // Persist through REST; the backend broadcasts to everyone and echoes clientId.
        const saved = await apiSendMessage({ username, content, clientId })
        upsertMessage(saved)
      } catch (err) {
        console.log("[v0] Failed to send message:", err.message)
        toast.error("Message failed to send. Please try again.")
        // Remove the optimistic bubble on failure.
        setMessages((prev) => prev.filter((m) => m.clientId !== clientId))
      }
    },
    [username, toast, upsertMessage]
  )

  const emitTypingStart = useCallback(() => {
    socket.emit("typing:start", username)
  }, [username])

  const emitTypingStop = useCallback(() => {
    socket.emit("typing:stop", username)
  }, [username])

  return {
    messages,
    loading,
    status,
    onlineCount,
    typingUsers,
    sendMessage,
    emitTypingStart,
    emitTypingStop,
  }
}
