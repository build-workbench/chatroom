import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Api } from '../api'
import { mapApiError } from '../error-utils'
import { useToast } from '../toast-context'
import { clearAuth, loadAuth, saveTokens, saveUser } from '../storage'
import type { User } from '../types'

export interface AuthState {
  user: User | null
  accessToken: string
  refreshToken: string
  api: Api
  accessRef: React.RefObject<string>
  refreshRef: React.RefObject<string>
  userRef: React.RefObject<User | null>
  handleLogin: (username: string, password: string) => Promise<void>
  handleRegister: (username: string, password: string) => Promise<void>
  logout: () => void
}

class AuthRuntime {
  private accessTokenValue: string
  private refreshTokenValue: string
  private unauthorizedHandler: (() => void) | null = null

  constructor(accessToken: string, refreshToken: string) {
    this.accessTokenValue = accessToken
    this.refreshTokenValue = refreshToken
  }

  getAccessToken = (): string => this.accessTokenValue

  getRefreshToken = (): string => this.refreshTokenValue

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessTokenValue = accessToken
    this.refreshTokenValue = refreshToken
  }

  clear(): void {
    this.setTokens('', '')
  }

  setUnauthorizedHandler(handler: () => void): void {
    this.unauthorizedHandler = handler
  }

  handleUnauthorized(): void {
    this.unauthorizedHandler?.()
  }
}

export function useAuth(onLogout?: () => void): AuthState {
  const toast = useToast()
  const snapshot = useMemo(() => loadAuth(), [])

  const [user, setUser] = useState<User | null>(snapshot.user)
  const [accessToken, setAccessToken] = useState<string>(snapshot.accessToken)
  const [refreshToken, setRefreshToken] = useState<string>(snapshot.refreshToken)
  const [authRuntime] = useState(() => new AuthRuntime(snapshot.accessToken, snapshot.refreshToken))
  const [api] = useState(() => {
    return new Api({
      getAccessToken: authRuntime.getAccessToken,
      getRefreshToken: authRuntime.getRefreshToken,
      callbacks: {
        onTokens: (at, rt) => {
          authRuntime.setTokens(at, rt)
          setAccessToken(at)
          setRefreshToken(rt)
        },
        onUnauthorized: () => {
          authRuntime.handleUnauthorized()
        },
      },
    })
  })

  const accessRef = useRef(accessToken)
  const refreshRef = useRef(refreshToken)
  const userRef = useRef<User | null>(user)

  useEffect(() => {
    accessRef.current = accessToken
  }, [accessToken])
  useEffect(() => {
    refreshRef.current = refreshToken
  }, [refreshToken])
  useEffect(() => {
    userRef.current = user
  }, [user])

  const logout = useCallback(() => {
    onLogout?.()
    clearAuth()
    authRuntime.clear()
    accessRef.current = ''
    refreshRef.current = ''
    userRef.current = null
    setUser(null)
    setAccessToken('')
    setRefreshToken('')
  }, [authRuntime, onLogout])

  useEffect(() => {
    authRuntime.setUnauthorizedHandler(logout)
  }, [authRuntime, logout])

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      try {
        const data = await api.login(username, password)
        saveTokens(data.access_token, data.refresh_token)
        saveUser(data.user)
        authRuntime.setTokens(data.access_token, data.refresh_token)
        accessRef.current = data.access_token
        refreshRef.current = data.refresh_token
        userRef.current = data.user
        setAccessToken(data.access_token)
        setRefreshToken(data.refresh_token)
        setUser(data.user)
        toast.success(`欢迎回来，${data.user.username}！`)
      } catch (error) {
        toast.error(mapApiError(error, 'login'))
      }
    },
    [api, authRuntime, toast],
  )

  const handleRegister = useCallback(
    async (username: string, password: string) => {
      try {
        await api.register(username, password)
      } catch (error) {
        toast.error(mapApiError(error, 'register'))
        throw error
      }
    },
    [api, toast],
  )

  return {
    user,
    accessToken,
    refreshToken,
    api,
    accessRef,
    refreshRef,
    userRef,
    handleLogin,
    handleRegister,
    logout,
  }
}
