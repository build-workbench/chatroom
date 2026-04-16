import type { Api } from './api'
import type { ConnectionStatus, WsEvent } from './types'

type Outbound =
  | { type: 'ping' }
  | { type: 'typing'; is_typing: boolean }
  | { type: 'message'; content: string }

export class ChatSocket {
  private api: Api
  private getAccessToken: () => string
  private onEvent: (evt: WsEvent) => void
  private onStatus: (status: ConnectionStatus, attempt?: number) => void

  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnect = 10
  private shouldReconnect = false
  private currentRoomId: number | null = null
  private heartbeatInterval: number | null = null
  private heartbeatTimeout: number | null = null
  private reconnectTimer: number | null = null
  private messageQueue: Outbound[] = []
  private lastPong = Date.now()
  private sawOpen = false

  constructor(opts: {
    api: Api
    getAccessToken: () => string
    onEvent: (evt: WsEvent) => void
    onStatus: (status: ConnectionStatus, attempt?: number) => void
  }) {
    this.api = opts.api
    this.getAccessToken = opts.getAccessToken
    this.onEvent = opts.onEvent
    this.onStatus = opts.onStatus
  }

  async connect(roomId: number, accessToken: string): Promise<void> {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      const current = this.ws
      current.onopen = null
      current.onclose = null
      current.onerror = null
      current.onmessage = null
      current.close()
      this.ws = null
    }

    this.currentRoomId = roomId
    this.shouldReconnect = true
    this.sawOpen = false
    this.onStatus('connecting')

    if (!accessToken) {
      this.emitSocketError('登录状态已失效，无法建立实时连接')
      this.onStatus('disconnected')
      return
    }

    let ticket: string
    try {
      const result = await this.api.createWSTicket(roomId)
      ticket = result.ticket
    } catch {
      this.emitSocketError('无法获取实时连接凭证，请重新进入房间或重新登录')
      this.onStatus('disconnected')
      this.scheduleReconnect()
      return
    }

    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${proto}//${location.host}/ws?room_id=${roomId}`

    let socket: WebSocket
    try {
      socket = new WebSocket(url, ['chatroom.v1', `ticket.${ticket}`])
      this.ws = socket
    } catch {
      this.emitSocketError('无法建立实时连接，请检查服务是否可用')
      this.scheduleReconnect()
      return
    }

    socket.onopen = () => {
      if (this.ws !== socket) return
      this.reconnectAttempts = 0
      this.lastPong = Date.now()
      this.sawOpen = true
      this.onStatus('connected')
      this.startHeartbeat()
      this.flushQueue()
    }

    socket.onclose = (event) => {
      if (this.ws !== socket) return
      this.stopHeartbeat()
      this.ws = null
      this.onStatus('disconnected')

      if (!this.shouldReconnect) return

      if (!this.sawOpen && event.code === 1006) {
        this.emitSocketError('实时连接被拒绝，请重新进入房间或重新登录')
      } else if (event.code === 1008) {
        this.emitSocketError('实时连接已失效，请重新登录')
      }
      this.scheduleReconnect()
    }

    socket.onerror = () => {
      if (this.ws !== socket) return
      this.onStatus('disconnected')
    }

    socket.onmessage = (ev) => {
      if (this.ws !== socket) return
      try {
        const msg = JSON.parse(ev.data) as unknown
        if (typeof msg === 'object' && msg !== null && 'type' in msg) {
          const t = (msg as { type?: unknown }).type
          if (t === 'pong') {
            this.lastPong = Date.now()
            if (this.heartbeatTimeout) {
              window.clearTimeout(this.heartbeatTimeout)
              this.heartbeatTimeout = null
            }
          }
        }
        this.onEvent(msg as WsEvent)
      } catch {
        this.emitSocketError('收到无法识别的实时消息，请稍后重试')
      }
    }
  }

  close(clearQueue = true): void {
    this.shouldReconnect = false
    this.stopHeartbeat()

    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (clearQueue) this.messageQueue = []
  }

  private emitSocketError(content: string): void {
    this.onEvent({ type: 'error', content })
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()

    this.heartbeatInterval = window.setInterval(() => {
      const ws = this.ws
      if (ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' }, true)
        // 捕获当前的 ws 引用，防止回调执行时 ws 已被清理
        this.heartbeatTimeout = window.setTimeout(() => {
          // 检查 ws 是否仍然是同一个实例且未关闭
          if (this.ws === ws && Date.now() - this.lastPong > 35000) {
            this.emitSocketError('实时连接超时，正在尝试重新连接')
            ws.close()
          }
        }, 5000)
      }
    }, 30000)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      window.clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
    if (this.heartbeatTimeout) {
      window.clearTimeout(this.heartbeatTimeout)
      this.heartbeatTimeout = null
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnect) {
      this.onStatus('disconnected')
      this.emitSocketError('实时连接恢复失败，请刷新页面或重新进入房间')
      return
    }

    const delay = Math.min(15000, 1000 * Math.pow(1.5, this.reconnectAttempts))
    this.reconnectAttempts++

    this.onStatus('reconnecting', this.reconnectAttempts)

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null
      if (!this.shouldReconnect || !this.currentRoomId) return
      const token = this.getAccessToken()
      if (!token) {
        this.onStatus('disconnected')
        this.emitSocketError('登录状态已失效，无法恢复实时连接')
        return
      }
      void this.connect(this.currentRoomId, token)
    }, delay)
  }

  reconnect(roomId: number): void {
    if (!this.shouldReconnect) return
    const token = this.getAccessToken()
    if (!token) return
    void this.connect(roomId, token)
  }

  private flushQueue(): void {
    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift()
      if (!msg) break
      this.send(msg, true)
    }
  }

  private send(payload: Outbound, skipQueue: boolean): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (!skipQueue && payload.type === 'message') {
        this.messageQueue.push(payload)
      }
      return false
    }

    this.ws.send(JSON.stringify(payload))
    return true
  }

  sendMessage(content: string): boolean {
    return this.send({ type: 'message', content }, false)
  }

  sendTyping(isTyping: boolean): void {
    this.send({ type: 'typing', is_typing: isTyping }, true)
  }
}
