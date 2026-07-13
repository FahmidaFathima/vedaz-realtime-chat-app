import Avatar from "./Avatar.jsx"
import { ChatLogoIcon } from "./Icons.jsx"

const STATUS_LABELS = {
  connected: "Online",
  connecting: "Connecting...",
  disconnected: "Offline",
}

const STATUS_CLASS = {
  connected: "online",
  connecting: "connecting",
  disconnected: "offline",
}

export default function Header({ username, status, onlineCount, onLogout }) {
  return (
    <header className="chat-header">
      <span className="header-logo">
        <ChatLogoIcon size={22} />
      </span>

      <div className="header-titles">
        <span className="app-name">ConnectChat</span>
        <span className="app-sub">
          {status === "connected" && onlineCount > 0
            ? `${onlineCount} ${onlineCount === 1 ? "user" : "users"} online`
            : "Real-time messaging"}
        </span>
      </div>

      <div className="header-right">
        <span
          className={`status-pill ${STATUS_CLASS[status]}`}
          role="status"
          aria-live="polite"
        >
          <span className="status-dot" />
          {STATUS_LABELS[status]}
        </span>

        <div className="header-user">
          <Avatar name={username} size="sm" />
          <span className="username">{username}</span>
        </div>

        <button className="btn-ghost" onClick={onLogout} type="button">
          Leave
        </button>
      </div>
    </header>
  )
}
