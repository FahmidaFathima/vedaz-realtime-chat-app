import { EmptyChatIcon } from "./Icons.jsx"

export default function EmptyState() {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <EmptyChatIcon size={34} />
      </span>
      <h3>No messages yet.</h3>
      <p>Start the conversation by sending your first message.</p>
    </div>
  )
}
