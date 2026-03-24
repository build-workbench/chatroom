import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Api } from './api'

describe('Api', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    globalThis.fetch = originalFetch
  })

  it('creates ws ticket with bearer auth', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ticket: 'ws-ticket', expires_in: 60 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    globalThis.fetch = fetchMock as typeof fetch

    const api = new Api({
      getAccessToken: () => 'access-1',
      getRefreshToken: () => 'refresh-1',
    })

    const result = await api.createWSTicket(42)

    expect(result.ticket).toBe('ws-ticket')
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/ws/tickets',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer access-1' }),
        body: JSON.stringify({ room_id: 42 }),
      }),
    )
  })

  it('refreshes token and retries authorized request', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'expired' }), { status: 401, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'access-2', refresh_token: 'refresh-2' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ rooms: [{ id: 1, name: 'general', online: 2 }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
    globalThis.fetch = fetchMock as typeof fetch

    const onTokens = vi.fn()
    let accessToken = 'access-1'
    let refreshToken = 'refresh-1'
    const api = new Api({
      getAccessToken: () => accessToken,
      getRefreshToken: () => refreshToken,
      callbacks: {
        onTokens: (at, rt) => {
          accessToken = at
          refreshToken = rt
          onTokens(at, rt)
        },
      },
    })

    const result = await api.listRooms()

    expect(result.rooms).toHaveLength(1)
    expect(onTokens).toHaveBeenCalledWith('access-2', 'refresh-2')
    expect(localStorage.getItem('chat_access')).toBe('access-2')
    expect(localStorage.getItem('chat_refresh')).toBe('refresh-2')
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      '/api/v1/rooms',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer access-2' }),
      }),
    )
  })

  it('clears auth and calls unauthorized callback when refresh fails', async () => {
    localStorage.setItem('chat_access', 'old-access')
    localStorage.setItem('chat_refresh', 'old-refresh')
    localStorage.setItem('chat_user', JSON.stringify({ id: 1, username: 'alice' }))

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'expired' }), { status: 401, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: 'invalid refresh token' }), { status: 401, headers: { 'Content-Type': 'application/json' } }))
    globalThis.fetch = fetchMock as typeof fetch

    const onUnauthorized = vi.fn()
    const api = new Api({
      getAccessToken: () => 'old-access',
      getRefreshToken: () => 'old-refresh',
      callbacks: { onUnauthorized },
    })

    await expect(api.listRooms()).rejects.toMatchObject({ status: 401, responseMessage: 'invalid refresh token' })
    expect(onUnauthorized).toHaveBeenCalled()
    expect(localStorage.getItem('chat_access')).toBeNull()
    expect(localStorage.getItem('chat_refresh')).toBeNull()
    expect(localStorage.getItem('chat_user')).toBeNull()
  })
})
