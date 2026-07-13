import { useCallback, useEffect, useState } from "react"
import Login from "./components/Login.jsx"
import ChatRoom from "./components/ChatRoom.jsx"

const STORAGE_KEY = "connectchat:username"

export default function App() {
  const [username, setUsername] = useState(null)
  const [ready, setReady] = useState(false)

  // Restore a saved session from localStorage on first load.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setUsername(saved)
    } catch {
      // Ignore storage access errors (e.g. private mode).
    }
    setReady(true)
  }, [])

  const handleLogin = useCallback((name) => {
    try {
      localStorage.setItem(STORAGE_KEY, name)
    } catch {
      // Ignore storage write errors.
    }
    setUsername(name)
  }, [])

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage removal errors.
    }
    setUsername(null)
  }, [])

  if (!ready) return null

  return username ? (
    <ChatRoom username={username} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  )
}
