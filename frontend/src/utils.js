// Deterministic avatar background color derived from a username.
const AVATAR_COLORS = [
  "#2563eb",
  "#0ea5e9",
  "#6366f1",
  "#0891b2",
  "#0d9488",
  "#4f46e5",
  "#2563eb",
  "#3b82f6",
]

export function colorForName(name = "") {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function initialOf(name = "") {
  return name.trim().charAt(0).toUpperCase() || "?"
}

// Format an ISO timestamp into a friendly time / date label.
export function formatTime(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""

  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  if (sameDay) return time

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday ${time}`

  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} ${time}`
}
