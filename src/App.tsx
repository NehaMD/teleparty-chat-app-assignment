import { useEffect, useRef, useState } from "react"
import { useTeleparty } from "./hooks/useTeleparty"

export default function App() {
  const [roomInput, setRoomInput] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [userIcon, setUserIcon] = useState<string | undefined>(undefined)

  const {
    connected,
    messages,
    roomId,
    nickname,
    setNickname,
    joined,
    typingUsers,
    createRoom,
    joinRoom,
    sendMessage,
    setTyping
  } = useTeleparty()

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages])

  // helper to detect own messages (based on nickname)
  const isOwnMessage = (msg: any) => {
    if (!nickname) return false
    return !msg.isSystemMessage && (msg.userNickname === nickname)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f6fb",
        fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
        color: "#0f1720",
        padding: 20
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Teleparty Chat</h1>
          <div style={{ fontSize: 14, color: connected ? "#065f46" : "#7f1d1d" }}>
            {connected ? "Connected" : "Disconnected"}
          </div>
        </header>

        {/* Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 12,
            padding: 18,
            boxShadow: "0 6px 20px rgba(12, 20, 32, 0.08)",
            border: "1px solid rgba(15,23,36,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}
        >
          {/* Controls */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <input
              placeholder="Nickname"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
                flex: "0 0 220px",
                color: "#0f1720",
                background: "#fff"
              }}
            />

            {/* icon upload */}
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "#374151"
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => setUserIcon(reader.result as string)
                  reader.readAsDataURL(file)
                }}
              />
              {userIcon && (
                <img
                  src={userIcon}
                  alt="icon"
                  style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "1px solid #e6eef8" }}
                />
              )}
            </label>

            <div style={{ flex: 1 }} />

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => createRoom(nickname, userIcon)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13
                }}
              >
                Create Room
              </button>
            </div>
          </div>

          {/* Join controls */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Room ID to join"
              value={roomInput}
              onChange={e => setRoomInput(e.target.value)}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
                flex: 1,
                color: "#d1d5db"
              }}
            />
            <button
              onClick={() => joinRoom(roomInput, nickname, userIcon)}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "#10b981",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13
              }}
            >
              Join Room
            </button>
            {roomId && (
              <div style={{ alignSelf: "center", color: "#374151", fontSize: 13 }}>
                Room: <strong style={{ color: "#0f1720" }}>{roomId}</strong>
              </div>
            )}
          </div>

          {/* Messages area */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: 10,
              padding: 12,
              minHeight: 320,
              maxHeight: 420,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#6b7280", paddingTop: 24 }}>No messages yet...</div>
            ) : (
              messages.map((msg, i) => {
                const own = isOwnMessage(msg)
                if (msg.isSystemMessage) {
                  return (
                    <div key={`${msg.timestamp}-${i}`} style={{ textAlign: "center", color: "#6b7280", fontSize: 13 }}>
                      {msg.body}
                    </div>
                  )
                }

                return (
                  <div
                    key={`${msg.timestamp}-${i}`}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      justifyContent: own ? "flex-end" : "flex-start"
                    }}
                  >
                    {/* avatar for other users */}
                    {!own && (
                      <div style={{ width: 36, height: 36, flexShrink: 0 }}>
                        {msg.userIcon ? (
                          <img src={msg.userIcon} alt="icon" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e6eef8" }} />
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        maxWidth: "70%",
                        background: own ? "#e0f2fe" : "#ffffff",
                        color: "#0f1720",
                        padding: "10px 12px",
                        borderRadius: 10,
                        boxShadow: "0 1px 2px rgba(2,6,23,0.04)",
                        border: "1px solid rgba(15,23,36,0.04)",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ fontSize: 13, marginBottom: 6 }}>
                        <strong style={{ color: "#0f1720" }}>{msg.userNickname || "Anonymous"}</strong>
                        <span style={{ marginLeft: 6, color: "#475569" }}>{msg.body}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* avatar for own (right side) */}
                    {own && (
                      <div style={{ width: 36, height: 36, flexShrink: 0 }}>
                        {msg.userIcon ? (
                          <img src={msg.userIcon} alt="icon" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e6eef8" }} />
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Typing indicator */}
          <div style={{ minHeight: 20 }}>
            {typingUsers.length > 0 && (
              <div style={{ color: "#475569", fontStyle: "italic", fontSize: 13 }}>
                Someone is typing...
              </div>
            )}
          </div>

          {/* Input row */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Type a message..."
              value={messageInput}
              onChange={e => {
                setMessageInput(e.target.value)
                setTyping(e.target.value.trim() !== "")
              }}
              onKeyDown={e => {
                if (e.key === "Enter" && messageInput.trim() !== "") {
                  sendMessage(messageInput)
                  setMessageInput("")
                  setTyping(false)
                }
              }}
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
                flex: 1,
                color: "#d1d5db"
              }}
            />
            <button
              onClick={() => {
                if (messageInput.trim()) {
                  sendMessage(messageInput)
                  setMessageInput("")
                  setTyping(false)
                }
              }}
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 700
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
