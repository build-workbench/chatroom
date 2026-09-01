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

  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')

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

  return (
    <div className="min-h-full flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden">
      {/* 柔和装饰背景 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50/40" />
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-[560px] h-[560px] bg-gradient-to-tr from-violet-100 to-purple-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-to-br from-sky-50/80 to-blue-50/40 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative w-full max-w-md">
        {/* 顶部品牌 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-600 mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Go + React · WebSocket · 教学项目
          </div>
        </div>

        <div className="relative bg-white p-8 rounded-[24px] shadow-[0_8px_32px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.06)] border border-slate-200/70 animate-scale-in overflow-hidden">
          {/* 卡片顶部装饰线 */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-500 via-violet-500 to-fuchsia-500" />

          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 shadow-lg shadow-primary-500/20 ring-1 ring-primary-500/10 mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h1 className="text-[26px] font-bold tracking-tight text-slate-900">ChatRoom</h1>
            <p className="text-sm text-slate-500 mt-1">轻盈 · 清晰 · 实时 · 适合学习的全栈聊天室</p>
          </div>

          <div className="flex mb-6 p-1 bg-slate-100 rounded-2xl" role="tablist" aria-label="登录或注册">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'login'}
              className={
                tab === 'login'
                  ? 'flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all text-slate-500 hover:text-slate-700'
              }
              onClick={() => setTab('login')}
              disabled={busy}
            >
              登录
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'register'}
              className={
                tab === 'register'
                  ? 'flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all text-slate-500 hover:text-slate-700'
              }
              onClick={() => setTab('register')}
              disabled={busy}
            >
              注册
            </button>
          </div>

          {tab === 'login' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">用户名</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-400 input-glow transition-all shadow-sm"
                    placeholder="输入用户名"
                    disabled={busy}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">密码</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    type="password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-400 input-glow transition-all shadow-sm"
                    placeholder="输入密码"
                    disabled={busy}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleLogin()}
                disabled={busy}
                className="w-full bg-gradient-to-br from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold py-3 px-4 rounded-xl transition-all btn-shine shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/25 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 mt-2"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  登录
                </span>
              </button>
              <p className="text-xs text-center text-slate-400">示例账号可直接注册体验 · 支持 JWT 双 Token</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">用户名</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-400 input-glow transition-all shadow-sm"
                    placeholder="创建用户名"
                    disabled={busy}
                  />
                </div>
                <p className="text-xs text-slate-400">用户名长度 2-64 个字符</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">密码</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    type="password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-400 input-glow transition-all shadow-sm"
                    placeholder="创建密码"
                    disabled={busy}
                  />
                </div>
                <p className="text-xs text-slate-400">密码长度 8-128 个字符</p>
              </div>

              <button
                type="button"
                onClick={() => void handleRegister()}
                disabled={busy}
                className="w-full bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl transition-all btn-shine shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 mt-2"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  创建账号
                </span>
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">教学项目 · 全栈实时聊天 · 本地可运行 · 代码即文档</p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">浅色精美模式 · 轻盈通透 · 适合演示与阅读</p>
      </div>
    </div>
  )
}
