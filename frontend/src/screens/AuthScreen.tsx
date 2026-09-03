import { useState } from 'react'

import { useToast } from '../toast-context'

export function AuthScreen(props: {
  onLogin: (username: string, password: string) => Promise<void>
  onRegister: (username: string, password: string) => Promise<void>
}) {
  const toast = useToast()
  const [tab, setTab] = useState<'login' | 'register'>('login')

  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)

  const [busy, setBusy] = useState(false)

  async function handleLogin(): Promise<void> {
    const u = loginUsername.trim()
    const p = loginPassword

    if (!u || !p) {
      toast.error('请输入用户名和密码')
      return
    }

    setBusy(true)
    try {
      await props.onLogin(u, p)
    } finally {
      setBusy(false)
    }
  }

  async function handleRegister(): Promise<void> {
    const u = regUsername.trim()
    const p = regPassword

    if (!u || !p) {
      toast.error('请输入用户名和密码')
      return
    }

    if (u.length < 2) {
      toast.error('用户名至少2个字符')
      return
    }

    if (u.length > 64) {
      toast.error('用户名不能超过64个字符')
      return
    }

    if (p.length < 8) {
      toast.error('密码至少8个字符')
      return
    }

    if (p.length > 128) {
      toast.error('密码不能超过128个字符')
      return
    }

    setBusy(true)
    try {
      await props.onRegister(u, p)
      toast.success('注册成功，请使用新账号登录')
      setRegUsername('')
      setRegPassword('')
      setTab('login')
      setLoginUsername(u)
      setLoginPassword('')
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }

  function fillDemoAccount(name = 'demo_user', pwd = 'password123') {
    setLoginUsername(name)
    setLoginPassword(pwd)
    toast.info(`已填入测试账号：${name}`)
  }

  return (
    <div className="min-h-full flex items-center justify-center p-4 sm:p-6 bg-[#f8fafc] relative overflow-hidden selection:bg-blue-100 selection:text-blue-700">
      {/* 柔和环境光与微质感点阵 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/50" />
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-gradient-to-br from-blue-200/50 to-indigo-200/40 rounded-full blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-32 -left-32 w-[540px] h-[540px] bg-gradient-to-tr from-violet-200/40 to-sky-200/50 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-primary-100/30 via-transparent to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />
      </div>

      <div className="relative w-full max-w-[440px] z-10">
        {/* 顶部品牌与定位 */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-xs font-medium text-slate-600 transition-all hover:border-slate-300">
            <span className="w-2 h-2 bg-emerald-500 rounded-full status-online" />
            <span>Go 1.24 + React 19 · WebSocket 实时聊天</span>
          </div>
        </div>

        {/* 核心登录卡片 */}
        <div className="relative bg-white/95 backdrop-blur-xl p-8 sm:p-9 rounded-[28px] shadow-[0_16px_40px_-10px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04)] border border-slate-200/80 animate-scale-in overflow-hidden">
          {/* 顶部细微渐变光带 */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-primary-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/10 mb-3.5 transition-transform hover:scale-105 duration-200">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Chat<span className="text-primary-600">Room</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 font-normal leading-relaxed">
              轻盈通透 · 实时推送 · 全栈教学项目
            </p>
          </div>

          {/* 登录 / 注册 分段切换控制器 */}
          <div className="flex mb-6 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60" role="tablist" aria-label="登录或注册">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'login'}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
              onClick={() => setTab('login')}
              disabled={busy}
            >
              <svg className="w-4 h-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              登录
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'register'}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
              onClick={() => setTab('register')}
              disabled={busy}
            >
              <svg className="w-4 h-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              注册
            </button>
          </div>

          {tab === 'login' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 tracking-tight">用户名</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <input
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void handleLogin()
                    }}
                    className="w-full bg-slate-50/90 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-500 input-glow transition-all shadow-xs"
                    placeholder="输入用户名"
                    disabled={busy}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 tracking-tight">密码</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  <input
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void handleLogin()
                    }}
                    type={showLoginPassword ? 'text' : 'password'}
                    className="w-full bg-slate-50/90 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-500 input-glow transition-all shadow-xs"
                    placeholder="输入密码"
                    disabled={busy}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={showLoginPassword ? '隐藏密码' : '显示密码'}
                    tabIndex={-1}
                  >
                    {showLoginPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* 快捷测试账号填充卡片 */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('demo_user', 'password123')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/70 text-blue-700 transition-all cursor-pointer group text-xs font-medium shadow-xs"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>快捷测试演示账号</span>
                    <span className="font-mono text-[11px] text-blue-600/80 bg-white/80 px-1.5 py-0.5 rounded border border-blue-200/60">demo_user</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    一键填入
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => void handleLogin()}
                disabled={busy}
                className="w-full bg-gradient-to-r from-blue-600 via-primary-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all btn-shine shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-px active:translate-y-0 active:scale-[0.99] disabled:opacity-60 disabled:hover:translate-y-0 mt-2 cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2">
                  {busy ? (
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                  )}
                  {busy ? '正在登录...' : '立即登录'}
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 tracking-tight">用户名</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <input
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void handleRegister()
                    }}
                    className="w-full bg-slate-50/90 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-500 input-glow transition-all shadow-xs"
                    placeholder="创建个性用户名 (2-64字符)"
                    disabled={busy}
                    autoComplete="username"
                  />
                </div>
                <p className="text-[11px] text-slate-400 pl-1">用户名用于聊天室内身份辨识与 @ 提及</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600 tracking-tight">密码</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  <input
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void handleRegister()
                    }}
                    type={showRegPassword ? 'text' : 'password'}
                    className="w-full bg-slate-50/90 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-500 input-glow transition-all shadow-xs"
                    placeholder="创建密码 (至少8位字符)"
                    disabled={busy}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={showRegPassword ? '隐藏密码' : '显示密码'}
                    tabIndex={-1}
                  >
                    {showRegPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 pl-1">支持英文字母、数字和常见符号</p>
              </div>

              <button
                type="button"
                onClick={() => void handleRegister()}
                disabled={busy}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all btn-shine shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-px active:translate-y-0 active:scale-[0.99] disabled:opacity-60 mt-2 cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2">
                  {busy ? (
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  )}
                  {busy ? '正在创建...' : '注册并体验'}
                </span>
              </button>
            </div>
          )}

          {/* 精致架构特性卡片展示 */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/90 flex items-start gap-2.5 transition-colors hover:bg-slate-50">
              <div className="w-6 h-6 rounded-lg bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">⚡</div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-800 text-[11.5px] leading-tight">全双工推送</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">Gorilla WebSocket</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/90 flex items-start gap-2.5 transition-colors hover:bg-slate-50">
              <div className="w-6 h-6 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">🔐</div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-800 text-[11.5px] leading-tight">双 Token 鉴权</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">JWT 静默续签</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/90 flex items-start gap-2.5 transition-colors hover:bg-slate-50">
              <div className="w-6 h-6 rounded-lg bg-emerald-100/80 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">👥</div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-800 text-[11.5px] leading-tight">多房间感知</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">在线隔离与打字侦测</div>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/90 flex items-start gap-2.5 transition-colors hover:bg-slate-50">
              <div className="w-6 h-6 rounded-lg bg-violet-100/80 text-violet-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">📜</div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-800 text-[11.5px] leading-tight">历史漫游</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">滚动加载与防刷限流</div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          ChatRoom · Clean Architecture & Real-Time Engineering
        </p>
      </div>
    </div>
  )
}

