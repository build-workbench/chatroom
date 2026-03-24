import { useCallback, useRef, useState } from 'react'

import { getRequestErrorMessage, getRequestErrorStatus, isNetworkRequestError, type Api } from '../api'
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

function isServerErrorStatus(status: number | undefined): boolean {
  return typeof status === 'number' && status >= 500
}

function getRoomListErrorMessage(error: unknown): string {
  if (isNetworkRequestError(error)) return '加载房间列表失败，请检查网络连接'
  const status = getRequestErrorStatus(error)
  const responseMessage = getRequestErrorMessage(error)

  if (status === 401) return '登录状态已失效，请重新登录'
  if (status === 429) return '请求过于频繁，请稍后再试'
  if (isServerErrorStatus(status) || responseMessage === 'failed to list rooms') return '加载房间列表失败，服务暂时不可用'
  return '加载房间列表失败，请稍后重试'
}

function getCreateRoomErrorMessage(error: unknown): string {
  if (isNetworkRequestError(error)) return '创建房间失败，请检查网络连接'
  const status = getRequestErrorStatus(error)
  const responseMessage = getRequestErrorMessage(error)

  if (status === 401) return '登录状态已失效，请重新登录'
  if (status === 409 || responseMessage === 'room name taken') return '房间名已存在，请换一个试试'
  if (status === 400 || responseMessage === 'invalid payload') return '房间名不合法，请重新输入'
  if (status === 429) return '创建房间过于频繁，请稍后再试'
  if (isServerErrorStatus(status) || responseMessage === 'failed to create room') return '创建房间失败，服务暂时不可用'
  return '创建房间失败，请稍后重试'
}

function getHistoryErrorMessage(error: unknown): string {
  if (isNetworkRequestError(error)) return '加载历史消息失败，请检查网络连接'
  const status = getRequestErrorStatus(error)
  const responseMessage = getRequestErrorMessage(error)

  if (status === 401) return '登录状态已失效，请重新登录'
  if (status === 400 || responseMessage === 'invalid room id') return '房间不存在或消息参数无效'
  if (status === 404 || responseMessage === 'room not found') return '房间不存在，可能已被删除'
  if (isServerErrorStatus(status) || responseMessage === 'failed to list messages') return '加载历史消息失败，服务暂时不可用'
  return '加载历史消息失败，请稍后重试'
}

function getLoadMoreHistoryErrorMessage(error: unknown): string {
  if (isNetworkRequestError(error)) return '加载更早消息失败，请检查网络连接'
  const status = getRequestErrorStatus(error)
  const responseMessage = getRequestErrorMessage(error)

  if (status === 401) return '登录状态已失效，请重新登录'
  if (status === 404 || responseMessage === 'room not found') return '房间不存在，无法继续加载历史消息'
  if (isServerErrorStatus(status) || responseMessage === 'failed to list messages') return '加载更早消息失败，服务暂时不可用'
  return '加载更早消息失败，请稍后重试'
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
  const currentRoomNameRef = useRef(currentRoomName)
  currentRoomIdRef.current = currentRoomId
  currentRoomNameRef.current = currentRoomName

  const clearCurrentRoom = useCallback((clearPersistedRoom: boolean) => {
    currentRoomIdRef.current = null
    currentRoomNameRef.current = ''
    setCurrentRoomId(null)
    setCurrentRoomName('')
    setOnlineCount(0)
    setItems([])
    setDraft('')
    setEarliestMsgId(null)
    if (clearPersistedRoom) setLastRoomId(null)
  }, [])

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

  const openRoom = useCallback(async (id: number, name: string, online: number, force = false) => {
    if (!force && currentRoomIdRef.current === id && currentRoomNameRef.current === name) return

    setCurrentRoomId(id)
    currentRoomIdRef.current = id
    setLastRoomId(id)
    setCurrentRoomName(name)
    currentRoomNameRef.current = name
    setOnlineCount(typeof online === 'number' ? online : 0)
    setItems([])
    setDraft('')
    setEarliestMsgId(null)
    setLoadingHistory(true)

    try {
      const data = await api.listMessages(id, 50)
      const msgs = data.messages || []
      setEarliestMsgId(msgs.length > 0 ? msgs[0].id : null)
      setItems(msgs)
    } catch (error) {
      toast.error(getHistoryErrorMessage(error))
    } finally {
      setLoadingHistory(false)
    }

    const token = accessRef.current
    if (token) {
      void socketRef.current?.connect(id, token)
    }
  }, [api, accessRef, socketRef, toast])

  const reloadRooms = useCallback(async () => {
    try {
      const data = await api.listRooms()
      const nextRooms = data.rooms || []
      setRooms(nextRooms)

      const activeRoomId = currentRoomIdRef.current
      if (!activeRoomId) return

      const activeRoom = nextRooms.find((room) => room.id === activeRoomId)
      if (!activeRoom) {
        socketRef.current?.close()
        clearCurrentRoom(true)
        toast.info('上次进入的房间已不可用，请重新选择房间')
        return
      }

      if (!currentRoomNameRef.current) {
        await openRoom(activeRoom.id, activeRoom.name, activeRoom.online, true)
        return
      }

      setCurrentRoomName(activeRoom.name)
      currentRoomNameRef.current = activeRoom.name
      setOnlineCount(activeRoom.online || 0)
    } catch (error) {
      toast.error(getRoomListErrorMessage(error))
    }
  }, [api, clearCurrentRoom, openRoom, socketRef, toast])

  const joinRoom = useCallback(async (id: number, name: string, online: number) => {
    await openRoom(id, name, online)
  }, [openRoom])

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
      await openRoom(rid, rname, 0, true)
    } catch (error) {
      toast.error(getCreateRoomErrorMessage(error))
    }
  }, [api, newRoomName, openRoom, reloadRooms, toast])

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
    } catch (error) {
      toast.error(getLoadMoreHistoryErrorMessage(error))
    } finally {
      setLoadingHistory(false)
    }
  }, [api, earliestMsgId, loadingHistory, toast])

  const sendMessage = useCallback(() => {
    const content = draft.trim()
    if (!content) return
    if (content.length > 2000) {
      toast.error('消息不能超过2000个字符')
      return
    }
    const ok = socketRef.current?.sendMessage(content) ?? false
    if (!ok) toast.info('连接暂不可用，消息已加入发送队列')
    setDraft('')
  }, [draft, socketRef, toast])

  const resetChat = useCallback(() => {
    setRooms([])
    clearCurrentRoom(false)
    setRoomQuery('')
    setNewRoomName('')
  }, [clearCurrentRoom])

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
