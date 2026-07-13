import { useState } from "react"
import { ChatLogoIcon } from "./Icons.jsx"

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = username.trim()

    if (!trimmed) {
      setError("Please enter a username to continue.")
      return
    }
    if (trimmed.length < 2) {
      setError("Username must be at least 2 characters.")
      return
    }
    if (trimmed.length > 40) {
      setError("Username must be 40 characters or fewer.")
      return
    }

    setError("")
    onLogin(trimmed)
  }

  return (
    <div className="app">
      <main className="login-card">
        <span className="login-logo">
          <ChatLogoIcon size={30} />
        </span>
        <h1>ConnectChat</h1>
        <p className="subtitle">Enter a username to join the conversation.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="text-input"
              type="text"
              value={username}
              autoFocus
              autoComplete="off"
              placeholder="e.g. Jordan"
              maxLength={40}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "username-error" : undefined}
              onChange={(e) => {
                setUsername(e.target.value)
                if (error) setError("")
              }}
            />
            {error && (
              <p className="field-error" id="username-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={!username.trim()}
          >
            Join Chat
          </button>
        </form>
      </main>
    </div>
  )
}
