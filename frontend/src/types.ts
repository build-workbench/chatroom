export type ToastType = 'info' | 'success' | 'error'

export type ConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'

export interface User {
  id: number
  username: string
}

export interface Room {
  id: number
  name: string
  online: number
}

export interface SidebarProps {
  user: User
  rooms: Room[]
  currentRoomId: number | null
  roomQuery: string
  newRoomName: string
  onRoomQueryChange: (q: string) => void
  onNewRoomNameChange: (name: string) => void
  onCreateRoom: () => void
  onJoinRoom: (id: number, name: string, online: number) => void
  onLogout: () => void
}

export interface AuthLoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface AuthRegisterResponse {
  id: number
  username: string
}

export interface CreateRoomResponse {
  id: number
  name: string
  room?: {
    id: number
    name: string
  }
}

export interface MessageDTO {
  type: 'message'
  id: number
  room_id: number
  user_id: number
  username: string
  content: string
  created_at: string
}

export interface WsJoinLeave {
  type: 'join' | 'leave'
  room_id: number
  user_id: number
  username: string
  online: number
}

export interface WsTyping {
  type: 'typing'
  room_id: number
  user_id: number
  username: string
  is_typing: boolean
}

export interface WsPong {
  type: 'pong'
}

export interface WsError {
  type: 'error'
  content: string
}

export interface WSTicketResponse {
  ticket: string
  expires_in: number
}

export type WsEvent = MessageDTO | WsJoinLeave | WsTyping | WsPong | WsError
