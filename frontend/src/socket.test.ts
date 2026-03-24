import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ChatSocket } from './socket'
import type { Api } from './api'
import type { WsEvent } from './types'

class MockWebSocket {
  static instances: MockWebSocket[] = []
  static OPEN = 1
  static CLOSED = 3

  url: string
  protocols?: string | string[]
  readyState = 0
  onopen: (() => void) | null = null
  onclose: ((event: { code: number; reason: string }) => void) | null = null
  onerror: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  sent: string[] = []

  constructor(url: string, protocols?: string | string[]) {
    this.url = url
    this.protocols = protocols
    MockWebSocket.instances.push(this)
  }

  send(data: string) {
    this.sent.push(data)
  }

  close() {
    this.readyState = MockWebSocket.CLOSED
    this.onclose?.({ code: 1000, reason: 'closed' })
  }

  open() {
    this.readyState = MockWebSocket.OPEN
    this.onopen?.()
  }

  message(data: unknown) {
    this.onmessage?.({ data: JSON.stringify(data) })
  }
}

describe('ChatSocket', () => {
  const OriginalWebSocket = globalThis.WebSocket

  beforeEach(() => {
    MockWebSocket.instances = []
    vi.restoreAllMocks()
    vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    globalThis.WebSocket = OriginalWebSocket
  })

  it('uses ws ticket and subprotocol instead of query token', async () => {
    const api = {
      createWSTicket: vi.fn().mockResolvedValue({ ticket: 'ticket-123', expires_in: 60 }),
    } as unknown as Api
    const onEvent = vi.fn<(evt: WsEvent) => void>()
    const onStatus = vi.fn()
    const socket = new ChatSocket({
      api,
      getAccessToken: () => 'access-token',
      onEvent,
      onStatus,
    })

    await socket.connect(7, 'access-token')

    expect(api.createWSTicket).toHaveBeenCalledWith(7)
    expect(MockWebSocket.instances).toHaveLength(1)
    expect(MockWebSocket.instances[0].url).toContain('/ws?room_id=7')
    expect(MockWebSocket.instances[0].url).not.toContain('token=')
    expect(MockWebSocket.instances[0].protocols).toEqual(['chatroom.v1', 'ticket.ticket-123'])
  })

  it('queues offline messages and flushes them after connect opens', async () => {
    const api = {
      createWSTicket: vi.fn().mockResolvedValue({ ticket: 'ticket-queue', expires_in: 60 }),
    } as unknown as Api
    const socket = new ChatSocket({
      api,
      getAccessToken: () => 'access-token',
      onEvent: vi.fn(),
      onStatus: vi.fn(),
    })

    expect(socket.sendMessage('hello')).toBe(false)
    await socket.connect(5, 'access-token')
    const ws = MockWebSocket.instances[0]
    ws.open()

    expect(ws.sent).toContain(JSON.stringify({ type: 'message', content: 'hello' }))
  })

  it('emits socket error when ticket fetch fails', async () => {
    const api = {
      createWSTicket: vi.fn().mockRejectedValue(new Error('boom')),
    } as unknown as Api
    const onEvent = vi.fn<(evt: WsEvent) => void>()
    const socket = new ChatSocket({
      api,
      getAccessToken: () => 'access-token',
      onEvent,
      onStatus: vi.fn(),
    })

    await socket.connect(9, 'access-token')

    expect(onEvent).toHaveBeenCalledWith({ type: 'error', content: '无法获取实时连接凭证，请重新进入房间或重新登录' })
    expect(MockWebSocket.instances).toHaveLength(0)
  })
})
