export interface SendMessageData {
  body: string
}

export interface SetTypingMessageData {
  roomId: string
  userNickname: string
  typing: boolean
}
