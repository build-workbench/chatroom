import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Api } from '../api'
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

export function useAuth(onLogout?: () => void): AuthState {
  const toast = useToast()
  const snapshot = useMemo(() => loadAuth(), [])

  const [user, setUser] = useState<User | null>(snapshot.user)
  const [accessToken, setAccessToken] = useState<string>(snapshot.accessToken)
  const [refreshToken, setRefreshToken] = useState<string>(snapshot.refreshToken)

  const accessRef = useRef(accessToken)
  const refreshRef = useRef(refreshToken)
  const userRef = useRef<User | null>(user)

  useEffect(() => { accessRef.current = accessToken }, [accessToken])
  useEffect(() => { refreshRef.current = refreshToken }, [refreshToken])
  useEffect(() => { userRef.current = user }, [user])

  const logout = useCallback(() => {
    onLogout?.()
    clearAuth()
    setUser(null)
    setAccessToken('')
    setRefreshToken('')
  }, [onLogout])

  const api = useMemo(() => {
    return new Api({
      getAccessToken: () => accessRef.current,
      getRefreshToken: () => refreshRef.current,
      callbacks: {
        onTokens: (at, rt) => {
          setAccessToken(at)
          setRefreshToken(rt)
        },
        onUnauthorized: () => {
          logout()
        },
      },
    })
  }, [logout])

  const handleLogin = useCallback(async (username: string, password: string) => {
    try {
      const data = await api.login(username, password)
      saveTokens(data.access_token, data.refresh_token)
      saveUser(data.user)
      setAccessToken(data.access_token)
      setRefreshToken(data.refresh_token)
      setUser(data.user)
      toast.success(`欢迎回来，${data.user.username}！`)
    } catch {
      toast.error('登录失败，请检查用户名和密码')
    }
  }, [api, toast])

  const handleRegister = useCallback(async (username: string, password: string) => {
    try {
      await api.register(username, password)
    } catch {
      toast.error('注册失败: 用户名可能已存在')
    }
  }, [api, toast])

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
