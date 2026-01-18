import { useEffect, useState, useRef } from "react"
import type { TelepartyClient, SessionChatMessage } from "teleparty-websocket-lib"
import { SocketMessageTypes } from "teleparty-websocket-lib"
import { initTelepartyClient } from "../api/telepartyClient"
import type { SetTypingMessageData } from "../types/chat"

export function useTeleparty() {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<SessionChatMessage[]>([])
  const [roomId, setRoomId] = useState<string | null>(null)
  const [nickname, setNickname] = useState("")
  const [joined, setJoined] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const clientRef = useRef<TelepartyClient | null>(null)

  useEffect(() => {
    clientRef.current = initTelepartyClient({
      onConnectionReady: () => setConnected(true),
      onClose: () => setConnected(false),
      onMessage: (socketMessage: any) => {
        console.log("[socket]", socketMessage)

        // Regular chat messages
        if (socketMessage.type === SocketMessageTypes.SEND_MESSAGE && socketMessage.data?.body) {
          setMessages(prev => [...prev, socketMessage.data])
        }

        // Typing presence broadcast
        else if (socketMessage.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
          const { usersTyping } = socketMessage.data
          if (Array.isArray(usersTyping)) {
            // Exclude self from the typing list
            setTypingUsers(usersTyping.filter((u: string) => u !== nickname))
          }
        }

        else {
          console.log("[useTeleparty] non-session message:", socketMessage)
        }
      }
    })

    return () => clientRef.current?.teardown()
  }, [nickname])


  async function createRoom(userNickname: string, userIcon?: string) {
    if (!clientRef.current || !userNickname.trim()) return
    try {
      const id = await clientRef.current.createChatRoom(userNickname, userIcon)
      console.log("Room created:", id)
      setRoomId(id)
      setJoined(true)
    } catch (err) {
      console.error("Failed to create room:", err)
    }
  }

  async function joinRoom(id: string, userNickname: string, userIcon?: string) {
    if (!clientRef.current || !userNickname.trim()) return
    try {
      const messageList = await clientRef.current.joinChatRoom(userNickname, id, userIcon)
      console.log("Joined room:", messageList.messages)
      setRoomId(id)
      // Prepend old messages
      setMessages(prev => [...messageList.messages, ...prev])
      setJoined(true)
    } catch (err) {
      console.error("Failed to join room:", err)
    }
  }

  function sendMessage(body: string) {
    if (!clientRef.current || !joined || !body.trim()) return
    clientRef.current.sendMessage(SocketMessageTypes.SEND_MESSAGE, { body })
  }

  function setTyping(isTyping: boolean) {
    if (!clientRef.current || !roomId || !joined) return
    const msg: { typing: boolean; roomId: string } = { typing: isTyping, roomId }
    clientRef.current.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, msg)
  }

  return {
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
  }
}
