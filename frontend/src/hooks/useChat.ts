import { useCallback, useRef, useState } from 'react'

import type { Api } from '../api'
import { useToast } from '../toast-context'
import { setLastRoomId } from '../storage'
import type { ChatSocket } from '../socket'
import type { Room, WsEvent } from '../types'

export interface ChatState {
  rooms: Room[]
  roomQuery: string
  newRoomName: string
  currentRoomId: number | null
  currentRoomName: string
  onlineCount: number
  items: WsEvent[]
  draft: string
  earliestMsgId: number | null
  loadingHistory: boolean
  setRoomQuery: (q: string) => void
  setNewRoomName: (name: string) => void
  setDraft: (d: string) => void
  setOnlineCount: (n: number) => void
  addItem: (evt: WsEvent) => void
  addMessage: (evt: WsEvent) => void
  reloadRooms: () => Promise<void>
  createRoom: () => Promise<void>
  joinRoom: (id: number, name: string, online: number) => Promise<void>
  loadMoreHistory: () => Promise<void>
  sendMessage: () => void
  resetChat: () => void
}

interface UseChatOptions {
  api: Api
  accessRef: React.RefObject<string>
  socketRef: React.RefObject<ChatSocket | null>
  initialRoomId: number | null
}

export function useChat({ api, accessRef, socketRef, initialRoomId }: UseChatOptions): ChatState {
  const toast = useToast()

  const [rooms, setRooms] = useState<Room[]>([])
  const [roomQuery, setRoomQuery] = useState('')
  const [newRoomName, setNewRoomName] = useState('')

  const [currentRoomId, setCurrentRoomId] = useState<number | null>(initialRoomId)
  const [currentRoomName, setCurrentRoomName] = useState<string>('')
  const [onlineCount, setOnlineCount] = useState<number>(0)

  const [items, setItems] = useState<WsEvent[]>([])
  const [draft, setDraft] = useState('')
  const [earliestMsgId, setEarliestMsgId] = useState<number | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)

  const currentRoomIdRef = useRef(currentRoomId)
  currentRoomIdRef.current = currentRoomId

  const addItem = useCallback((evt: WsEvent) => {
    setItems((prev) => [...prev, evt])
    if ('online' in evt && typeof evt.online === 'number') {
      setOnlineCount(evt.online)
    }
  }, [])

  const addMessage = useCallback((evt: WsEvent) => {
    setItems((prev) => {
      if ('id' in evt && evt.id && prev.some((m) => m.type === 'message' && 'id' in m && m.id === evt.id)) return prev
      return [...prev, evt]
    })
  }, [])

  const reloadRooms = useCallback(async () => {
    try {
      const data = await api.listRooms()
      setRooms(data.rooms || [])
    } catch {
      // 静默失败
    }
  }, [api])

  const joinRoom = useCallback(async (id: number, name: string, online: number) => {
    if (currentRoomIdRef.current === id) return
    setCurrentRoomId(id)
    currentRoomIdRef.current = id
    setLastRoomId(id)
    setCurrentRoomName(name)
    setOnlineCount(typeof online === 'number' ? online : 0)
    setItems([])
    setEarliestMsgId(null)
    setLoadingHistory(true)

    try {
      const data = await api.listMessages(id, 50)
      const msgs = data.messages || []
      if (msgs.length > 0) setEarliestMsgId(msgs[0].id)
      setItems(msgs)
    } catch {
      toast.error('加载历史消息失败')
    } finally {
      setLoadingHistory(false)
    }

    const token = accessRef.current
    if (token) {
      socketRef.current?.connect(id, token)
    }
  }, [api, accessRef, socketRef, toast])

  const createRoom = useCallback(async () => {
    const name = newRoomName.trim()
    if (!name) {
      toast.info('请输入房间名')
      return
    }
    if (name.length > 50) {
      toast.error('房间名不能超过50个字符')
      return
    }
    try {
      const data = await api.createRoom(name)
      setNewRoomName('')
      toast.success('房间创建成功')
      await reloadRooms()
      const rid = data.room?.id ?? data.id
      const rname = data.room?.name ?? data.name
      await joinRoom(rid, rname, 0)
    } catch {
      toast.error('创建失败')
    }
  }, [api, newRoomName, reloadRooms, joinRoom, toast])

  const loadMoreHistory = useCallback(async () => {
    if (!currentRoomIdRef.current || !earliestMsgId || loadingHistory) return
    setLoadingHistory(true)
    try {
      const data = await api.listMessages(currentRoomIdRef.current, 50, earliestMsgId)
      const msgs = data.messages || []
      if (msgs.length > 0) {
        setEarliestMsgId(msgs[0].id)
        setItems((prev) => [...msgs, ...prev])
      }
    } finally {
      setLoadingHistory(false)
    }
  }, [api, earliestMsgId, loadingHistory])

  const sendMessage = useCallback(() => {
    const content = draft.trim()
    if (!content) return
    if (content.length > 2000) {
      toast.error('消息不能超过2000个字符')
      return
    }
    const ok = socketRef.current?.sendMessage(content) ?? false
    if (!ok) toast.info('消息已加入发送队列')
    setDraft('')
  }, [draft, socketRef, toast])

  const resetChat = useCallback(() => {
    setRooms([])
    setCurrentRoomId(null)
    setCurrentRoomName('')
    setOnlineCount(0)
    setItems([])
    setDraft('')
    setEarliestMsgId(null)
    setRoomQuery('')
    setNewRoomName('')
  }, [])

  return {
    rooms,
    roomQuery,
    newRoomName,
    currentRoomId,
    currentRoomName,
    onlineCount,
    items,
    draft,
    earliestMsgId,
    loadingHistory,
    setRoomQuery,
    setNewRoomName,
    setDraft,
    setOnlineCount,
    addItem,
    addMessage,
    reloadRooms,
    createRoom,
    joinRoom,
    loadMoreHistory,
    sendMessage,
    resetChat,
  }
}
