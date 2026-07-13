import Header from "./Header.jsx"
import MessageList from "./MessageList.jsx"
import MessageInput from "./MessageInput.jsx"
import TypingIndicator from "./TypingIndicator.jsx"
import Spinner from "./Spinner.jsx"
import { useChat } from "../hooks/useChat.js"

export default function ChatRoom({ username, onLogout }) {
  const {
    messages,
    loading,
    status,
    onlineCount,
    typingUsers,
    sendMessage,
    emitTypingStart,
    emitTypingStop,
  } = useChat(username)

  return (
    <div className="app">
      <div className="chat-shell">
        <Header
          username={username}
          status={status}
          onlineCount={onlineCount}
          onLogout={onLogout}
        />

        {loading ? (
          <Spinner />
        ) : (
          <MessageList messages={messages} currentUser={username} />
        )}

        <TypingIndicator users={typingUsers} />

        <MessageInput
          onSend={sendMessage}
          onTypingStart={emitTypingStart}
          onTypingStop={emitTypingStop}
          disabled={status === "disconnected"}
        />
      </div>
    </div>
  )
}
