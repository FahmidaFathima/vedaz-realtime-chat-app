import { io } from "socket.io-client"

// Connect to the same origin by default; the Vite dev server proxies the
// WebSocket upgrade to the backend. In production set VITE_SOCKET_URL.
const URL = import.meta.env.VITE_SOCKET_URL || undefined

// autoConnect is enabled and Socket.io handles automatic reconnection
// with exponential backoff out of the box.
const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  transports: ["websocket", "polling"],
})

export default socket
