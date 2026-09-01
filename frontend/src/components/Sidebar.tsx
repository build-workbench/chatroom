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
  const query = roomQuery.trim().toLowerCase()
  const filteredRooms = rooms.filter((r) => {
    if (!query) return true
    return r.name.toLowerCase().includes(query)
  })
  const hasQuery = query.length > 0

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(15,23,42,0.04)]">
      {/* 用户信息 */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-primary-500/20 avatar-ring">
                <span>{user.username.substring(0, 2).toUpperCase()}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full status-online shadow-sm" />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">{user.username}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />在线 · 教学演示
              </p>
            </div>
          </div>
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="退出"
            onClick={onLogout}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* 搜索框 */}
      <div className="p-4">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-primary-500 transition-colors">
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-400 input-glow transition-all"
            placeholder="搜索房间..."
          />
        </div>
      </div>

      {/* 创建房间 */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200/70">
          <input
            value={newRoomName}
            onChange={(e) => onNewRoomNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onCreateRoom()
            }}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all shadow-sm"
            placeholder="新房间名称"
          />
          <button
            type="button"
            onClick={onCreateRoom}
            className="bg-gradient-to-br from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-px active:translate-y-0 btn-shine"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            创建
          </button>
        </div>
      </div>

      {/* 房间列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="px-2 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-3 bg-gradient-to-b from-primary-500 to-violet-500 rounded-full" />
            房间列表
            <span className="ml-auto bg-slate-100 text-slate-500 text-[11px] px-2 py-0.5 rounded-full font-medium">
              {filteredRooms.length}
            </span>
          </h3>
          <div className="space-y-1">
            {filteredRooms.map((r) => {
              const active = currentRoomId === r.id
              const color = AVATAR_COLORS[r.id % AVATAR_COLORS.length]
              return (
                <button
                  key={r.id}
                  type="button"
                  className={`room-item group w-full flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all text-left border ${
                    active
                      ? 'active bg-white border-primary-100 shadow-sm'
                      : 'hover:bg-slate-50 border-transparent hover:border-slate-200 hover:shadow-sm bg-transparent'
                  }`}
                  onClick={() => onJoinRoom(r.id, r.name, r.online)}
                  aria-pressed={active}
                  aria-label={`加入房间 ${r.name}，${r.online || 0} 人在线`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}
                  >
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold text-sm truncate ${
                          active ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'
                        }`}
                      >
                        {r.name}
                      </span>
                      {active ? (
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow shadow-primary-500/30" />
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          (r.online || 0) > 0 ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                      <span className="text-xs text-slate-500">{r.online || 0} 在线 · 实时</span>
                    </div>
                  </div>
                </button>
              )
            })}
            {rooms.length === 0 ? (
              <div className="px-4 py-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-700">还没有可用房间</p>
                <p className="mt-1 text-xs text-slate-500">创建一个新房间，开始本次演示或测试。</p>
              </div>
            ) : null}
            {rooms.length > 0 && filteredRooms.length === 0 && hasQuery ? (
              <div className="px-4 py-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70">
                <p className="text-sm font-medium text-slate-700">没有找到匹配的房间</p>
                <p className="mt-1 text-xs text-slate-500">试试其他关键词，或清空搜索后查看全部房间。</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-slate-100">
        <p className="text-[11px] text-center text-slate-400">Go + React · WebSocket 实时</p>
      </div>
    </div>
  )
}
