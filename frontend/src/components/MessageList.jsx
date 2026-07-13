import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble.jsx"
import EmptyState from "./EmptyState.jsx"

export default function MessageList({ messages, currentUser }) {
  const endRef = useRef(null)
  const containerRef = useRef(null)

  // Auto-scroll to the latest message whenever the list changes.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="message-list" ref={containerRef}>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="message-list" ref={containerRef} role="log" aria-label="Message history">
      {messages.map((message) => (
        <MessageBubble
          key={message.id ?? message.clientId}
          message={message}
          isOwn={message.username === currentUser}
        />
      ))}
      <div ref={endRef} />
    </div>
  )
}
