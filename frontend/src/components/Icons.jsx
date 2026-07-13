// Lightweight inline SVG icons (stroke-based, currentColor).

export function ChatLogoIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.2A.6.6 0 0 1 4.8 19v-2.1A2.5 2.5 0 0 1 4 14.5z"
        fill="currentColor"
      />
    </svg>
  )
}

export function SendIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.4 20.4 21 12 3.4 3.6 3 10l12 2-12 2z"
        fill="currentColor"
      />
    </svg>
  )
}

export function CheckIcon({ size = 14, double = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12.5 9 17.5 20 6.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {double && (
        <path
          d="M9 12.5 11 14.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

export function EmptyChatIcon({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.2A.6.6 0 0 1 4.8 19v-2.1A2.5 2.5 0 0 1 4 14.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 9.5h7M8.5 12.5h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
