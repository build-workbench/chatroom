import { useState } from 'react'

import type { SidebarProps } from '../types'
import { AVATAR_COLORS } from '../constants'

export function Sidebar({
  user,
  rooms,
  currentRoomId,
  roomQuery,
  newRoomName,
  onRoomQueryChange,
  onNewRoomNameChange,
  onCreateRoom,
  onJoinRoom,
  onLogout,
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false)

  const query = roomQuery.trim().toLowerCase()
  const filteredRooms = rooms.filter((r) => {
    if (!query) return true
    return r.name.toLowerCase().includes(query)
  })
  const hasQuery = query.length > 0

  const userGradient = AVATAR_COLORS[user.id % AVATAR_COLORS.length]

  function handleCreate() {
    if (!newRoomName.trim()) return
    onCreateRoom()
    setIsCreating(false)
  }

  return (
    <aside className="w-80 bg-slate-50/90 backdrop-blur-xl border-r border-slate-200/80 flex flex-col h-full shadow-[2px_0_16px_rgba(15,23,42,0.03)] select-none">
      {/* 顶部当前用户信息卡片 */}
      <div className="p-4 border-b border-slate-200/70 bg-white/70 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${userGradient} flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/15 avatar-ring avatar-hover`}
              >
                <span>{user.username.substring(0, 2).toUpperCase()}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full status-online shadow-xs" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-slate-900 truncate tracking-tight">{user.username}</p>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-blue-50 text-blue-600 border border-blue-200/60 flex-shrink-0">
                  当前用户
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                在线 · 全双工连接
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
            title="退出登录"
            onClick={onLogout}
            aria-label="退出登录"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 搜索与快捷操作区 */}
      <div className="p-3.5 space-y-2.5">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            value={roomQuery}
            onChange={(e) => onRoomQueryChange(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-500/10 input-glow transition-all shadow-xs"
            placeholder="搜索房间或频道..."
          />
          {roomQuery ? (
            <button
              type="button"
              onClick={() => onRoomQueryChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              title="清除搜索"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>

        {/* 新建房间面板 */}
        {isCreating ? (
          <div className="p-3 bg-white rounded-2xl border border-primary-200/80 shadow-sm space-y-2.5 animate-scale-in">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 text-primary-700">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                创建新房间
              </span>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                title="取消"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-1.5">
              <input
                value={newRoomName}
                onChange={(e) => onNewRoomNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate()
                  if (e.key === 'Escape') setIsCreating(false)
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-500 input-glow"
                placeholder="输入房间名称..."
                autoFocus
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newRoomName.trim()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer btn-shine"
              >
                确认
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-primary-400 hover:bg-white text-xs font-medium text-slate-600 hover:text-primary-700 transition-all cursor-pointer group shadow-xs"
          >
            <svg
              className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>新建房间频道</span>
          </button>
        )}
      </div>

      {/* 房间列表 */}
      <div className="flex-1 overflow-y-auto px-3 py-1">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            频道列表
          </h3>
          <span className="bg-slate-200/70 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {filteredRooms.length}
          </span>
        </div>

        <div className="space-y-1">
          {filteredRooms.map((r) => {
            const active = currentRoomId === r.id
            const color = AVATAR_COLORS[r.id % AVATAR_COLORS.length]
            return (
              <button
                key={r.id}
                type="button"
                className={`room-item group w-full flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all text-left border relative ${
                  active
                    ? 'active bg-white border-blue-200/80 shadow-xs'
                    : 'hover:bg-white/80 border-transparent hover:border-slate-200/70 hover:shadow-xs'
                }`}
                onClick={() => onJoinRoom(r.id, r.name, r.online)}
                aria-pressed={active}
                aria-label={`加入房间 ${r.name}，${r.online || 0} 人在线`}
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0`}
                >
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-semibold text-xs truncate ${
                        active ? 'text-primary-700' : 'text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {r.name}
                    </span>
                    {active ? (
                      <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse shadow-xs shadow-primary-500/30" />
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        (r.online || 0) > 0 ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    <span className="text-[11px] text-slate-400">
                      {r.online || 0} 人在线
                    </span>
                  </div>
                </div>
              </button>
            )
          })}

          {rooms.length === 0 ? (
            <div className="px-4 py-8 text-center rounded-2xl border border-dashed border-slate-200 bg-white/60">
              <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-slate-700">暂无可用房间</p>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">点击上方“新建房间频道”开启对话</p>
            </div>
          ) : null}

          {rooms.length > 0 && filteredRooms.length === 0 && hasQuery ? (
            <div className="px-4 py-8 text-center rounded-2xl border border-dashed border-slate-200 bg-white/60">
              <p className="text-xs font-semibold text-slate-700">无匹配房间</p>
              <p className="mt-1 text-[11px] text-slate-400">试试其他关键词或清空搜索</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* 侧边栏底部状态栏 */}
      <div className="p-3 border-t border-slate-200/70 bg-white/60 backdrop-blur-md flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-medium text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-online" />
          WS 全双工服务
        </span>
        <span className="font-mono text-[10.5px]">Go 1.24 · React 19</span>
      </div>
    </aside>
  )
}

