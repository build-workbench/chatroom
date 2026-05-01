import { clearAuth, saveTokens } from './storage'
import type { AuthLoginResponse, AuthRegisterResponse, CreateRoomResponse, MessageDTO, Room, WSTicketResponse } from './types'

export interface ApiAuthCallbacks {
  onTokens?: (accessToken: string, refreshToken: string) => void
  onUnauthorized?: () => void
}

export interface RequestError extends Error {
  status?: number
  responseMessage?: string
  code?: string
}

async function safeJson<T>(res: Response): Promise<T> {
  const txt = await res.text()
  if (!txt) return {} as T
  return JSON.parse(txt) as T
}

function createRequestError(
  message: string,
  extras: Partial<Pick<RequestError, 'status' | 'responseMessage' | 'code'>> = {},
): RequestError {
  const err = new Error(message) as RequestError
  err.status = extras.status
  err.responseMessage = extras.responseMessage
  err.code = extras.code
  return err
}

export function getRequestErrorStatus(error: unknown): number | undefined {
  return typeof error === 'object' && error !== null && 'status' in error
    ? (error as RequestError).status
    : undefined
}

export function getRequestErrorMessage(error: unknown): string | undefined {
  return typeof error === 'object' && error !== null && 'responseMessage' in error
    ? (error as RequestError).responseMessage
    : undefined
}

export function isNetworkRequestError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error
    ? (error as RequestError).code === 'NETWORK_ERROR'
    : false
}

export class Api {
  private callbacks: ApiAuthCallbacks
  private getAccessToken: () => string
  private getRefreshToken: () => string
  private refreshPromise: Promise<boolean> | null = null

  constructor(opts: {
    getAccessToken: () => string
    getRefreshToken: () => string
    callbacks?: ApiAuthCallbacks
  }) {
    this.getAccessToken = opts.getAccessToken
    this.getRefreshToken = opts.getRefreshToken
    this.callbacks = opts.callbacks ?? {}
  }

  private async refresh(): Promise<boolean> {
    // 如果已有刷新进行中，复用该 Promise
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return false

    this.refreshPromise = (async () => {
      try {
        const res = await fetch('/api/v1/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })

        if (!res.ok) return false

        const data = await safeJson<{ access_token: string; refresh_token: string }>(res)
        if (!data.access_token || !data.refresh_token) return false

        saveTokens(data.access_token, data.refresh_token)
        this.callbacks.onTokens?.(data.access_token, data.refresh_token)
        return true
      } catch {
        return false
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  private async request<T>(
    path: string,
    method: string,
    body: unknown | null,
    authRequired: boolean,
  ): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (authRequired) {
      const at = this.getAccessToken()
      if (at) headers.Authorization = `Bearer ${at}`
    }

    let res: Response
    try {
      res = await fetch(path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      })
    } catch (error) {
      throw createRequestError(error instanceof Error ? error.message : 'network error', {
        code: 'NETWORK_ERROR',
      })
    }

    if (authRequired && res.status === 401) {
      const ok = await this.refresh()
      if (!ok) {
        clearAuth()
        this.callbacks.onUnauthorized?.()
        throw createRequestError('unauthorized', {
          status: 401,
          responseMessage: 'invalid refresh token',
        })
      }
      const at = this.getAccessToken()
      if (at) headers.Authorization = `Bearer ${at}`
      try {
        res = await fetch(path, {
          method,
          headers,
          body: body ? JSON.stringify(body) : null,
        })
      } catch (error) {
        throw createRequestError(error instanceof Error ? error.message : 'network error', {
          code: 'NETWORK_ERROR',
        })
      }
    }

    if (!res.ok) {
      let responseMessage: string | undefined
      try {
        const data = await safeJson<{ error?: string; message?: string }>(res)
        responseMessage = data.error || data.message
      } catch {
        responseMessage = undefined
      }
      throw createRequestError(responseMessage || `request failed: ${res.status}`, {
        status: res.status,
        responseMessage,
      })
    }

    return safeJson<T>(res)
  }

  register(username: string, password: string): Promise<AuthRegisterResponse> {
    return this.request<AuthRegisterResponse>('/api/v1/auth/register', 'POST', { username, password }, false)
  }

  login(username: string, password: string): Promise<AuthLoginResponse> {
    return this.request<AuthLoginResponse>('/api/v1/auth/login', 'POST', { username, password }, false)
  }

  listRooms(): Promise<{ rooms: Room[] }> {
    return this.request<{ rooms: Room[] }>('/api/v1/rooms', 'GET', null, true)
  }

  createRoom(name: string): Promise<CreateRoomResponse> {
    return this.request<CreateRoomResponse>('/api/v1/rooms', 'POST', { name }, true)
  }

  listMessages(roomId: number, limit = 50, beforeId?: number): Promise<{ messages: MessageDTO[] }> {
    const qs = new URLSearchParams({ limit: String(limit) })
    if (beforeId && beforeId > 0) qs.set('before_id', String(beforeId))
    return this.request<{ messages: MessageDTO[] }>(`/api/v1/rooms/${roomId}/messages?${qs.toString()}`, 'GET', null, true)
  }

  createWSTicket(roomId: number): Promise<WSTicketResponse> {
    return this.request<WSTicketResponse>('/api/v1/ws/tickets', 'POST', { room_id: roomId }, true)
  }
}
