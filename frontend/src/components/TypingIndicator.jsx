export default function TypingIndicator({ users }) {
  if (!users || users.length === 0) {
    // Keep the height reserved so the layout does not jump.
    return <div className="typing-indicator" aria-hidden="true" />
  }

  let label
  if (users.length === 1) {
    label = `${users[0]} is typing`
  } else if (users.length === 2) {
    label = `${users[0]} and ${users[1]} are typing`
  } else {
    label = "Several people are typing"
  }

  return (
    <div className="typing-indicator" aria-live="polite">
      <span className="typing-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{label}...</span>
    </div>
  )
}
