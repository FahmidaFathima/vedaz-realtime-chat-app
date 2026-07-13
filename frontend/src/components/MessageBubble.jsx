import Avatar from "./Avatar.jsx"
import { CheckIcon } from "./Icons.jsx"
import { formatTime } from "../utils.js"

export default function MessageBubble({ message, isOwn }) {
  const { username, content, timestamp, pending } = message

  return (
    <div className={`message-row ${isOwn ? "own" : ""}`}>
      <Avatar name={username} size="sm" />

      <div className="bubble-wrap">
        {!isOwn && <span className="bubble-sender">{username}</span>}

        <div className="bubble">{content}</div>

        <div className="bubble-meta">
          <span>{formatTime(timestamp)}</span>
          {isOwn && (
            <span
              className="tick"
              title={pending ? "Sending" : "Delivered"}
              aria-label={pending ? "Sending" : "Delivered"}
            >
              <CheckIcon size={13} double={!pending} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
