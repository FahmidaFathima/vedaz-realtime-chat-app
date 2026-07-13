import { useEffect, useRef, useState } from "react"
import { SendIcon } from "./Icons.jsx"

export default function MessageInput({ onSend, onTypingStart, onTypingStop, disabled }) {
  const [value, setValue] = useState("")
  const textareaRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const isTypingRef = useRef(false)

  const trimmed = value.trim()
  const canSend = trimmed.length > 0 && !disabled

  // Auto-resize the textarea up to its max-height.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [value])

  function stopTyping() {
    if (isTypingRef.current) {
      isTypingRef.current = false
      onTypingStop?.()
    }
    clearTimeout(typingTimeoutRef.current)
  }

  function handleChange(e) {
    setValue(e.target.value)

    if (e.target.value.trim()) {
      if (!isTypingRef.current) {
        isTypingRef.current = true
        onTypingStart?.()
      }
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(stopTyping, 1500)
    } else {
      stopTyping()
    }
  }

  function submit() {
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue("")
    stopTyping()
    // Return focus for quick successive messages.
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  function handleKeyDown(e) {
    // Enter sends, Shift+Enter inserts a newline.
    // Ignore Enter while an IME composition is active (CJK input).
    if (e.key === "Enter" && !e.shiftKey) {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      submit()
    }
  }

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), [])

  return (
    <form
      className="message-form"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <textarea
        ref={textareaRef}
        className="message-textarea"
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={stopTyping}
        placeholder={disabled ? "Reconnecting..." : "Type a message..."}
        aria-label="Message"
        disabled={disabled}
      />
      <button
        type="submit"
        className="send-btn"
        disabled={!canSend}
        aria-label="Send message"
        title="Send message"
      >
        <SendIcon size={20} />
      </button>
    </form>
  )
}
