import { useEffect, useRef, useState } from 'react'

import { ChatSocket } from '../socket'
import { useToast } from '../toast-context'
import type { ConnectionStatus, User, WsEvent } from '../types'

export interface ChatSocketState {
  connStatus: ConnectionStatus
  typingNames: string[]
  socketRef: React.RefObject<ChatSocket | null>
  handleWsEvent: (evt: WsEvent) => void
}

interface UseChatSocketOptions {
  getAccessToken: () => string
  userRef: React.RefObject<User | null>
  onJoinLeave: (evt: WsEvent) => void
  onMessage: (evt: WsEvent) => void
}

export function useChatSocket({
  getAccessToken,
  userRef,
  onJoinLeave,
  onMessage,
}: UseChatSocketOptions): ChatSocketState {
  const toast = useToast()
  const [connStatus, setConnStatus] = useState<ConnectionStatus>('idle')
  const [typingNames, setTypingNames] = useState<string[]>([])
  const typingTimersRef = useRef<Map<string, number>>(new Map())
  const socketRef = useRef<ChatSocket | null>(null)

  const onJoinLeaveRef = useRef(onJoinLeave)
  const onMessageRef = useRef(onMessage)
  const lastSocketErrorRef = useRef<string>('')
  useEffect(() => { onJoinLeaveRef.current = onJoinLeave }, [onJoinLeave])
  useEffect(() => { onMessageRef.current = onMessage }, [onMessage])

  const handleWsEvent = (evt: WsEvent) => {
    if (!evt || typeof evt !== 'object') return
    switch (evt.type) {
      case 'pong':
        return
      case 'error': {
        const message = (evt as { content?: string }).content || '发生错误'
        if (lastSocketErrorRef.current !== message) {
          toast.error(message)
          lastSocketErrorRef.current = message
          window.setTimeout(() => {
            if (lastSocketErrorRef.current === message) {
              lastSocketErrorRef.current = ''
            }
          }, 3000)
        }
        return
      }
      case 'typing': {
        const u = (evt as { username?: string }).username
        if (!u || u === userRef.current?.username) return
        const timers = typingTimersRef.current
        const old = timers.get(u)
        if (old) window.clearTimeout(old)
        if ((evt as { is_typing?: boolean }).is_typing) {
          const id = window.setTimeout(() => {
            timers.delete(u)
            setTypingNames(Array.from(timers.keys()))
          }, 3000)
          timers.set(u, id)
        } else {
          timers.delete(u)
        }
        setTypingNames(Array.from(timers.keys()))
        return
      }
      case 'join':
      case 'leave':
        onJoinLeaveRef.current(evt)
        return
      case 'message':
        onMessageRef.current(evt)
        return
      default:
        return
    }
  }

  useEffect(() => {
    const typingTimers = typingTimersRef.current
    const sock = new ChatSocket({
      getAccessToken,
      onStatus: (s) => { setConnStatus(s) },
      onEvent: handleWsEvent,
    })
    socketRef.current = sock
    return () => {
      sock.close()
      for (const id of typingTimers.values()) {
        window.clearTimeout(id)
      }
      typingTimers.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast])

  return { connStatus, typingNames, socketRef, handleWsEvent }
}
