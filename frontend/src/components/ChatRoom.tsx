import type { ConnectionStatus, User, WsEvent } from '../types'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'

interface ChatRoomProps {
  user: User
  currentRoomId: number | null
  currentRoomName: string
  onlineCount: number
  connStatus: ConnectionStatus
  items: WsEvent[]
  draft: string
  typingNames: string[]
  onDraftChange: (value: string) => void
  onSend: () => void
  onTyping: () => void
  onLoadMore: () => void
}

export function ChatRoom({
  user,
  currentRoomId,
  currentRoomName,
  onlineCount,
  connStatus,
  items,
  draft,
  typingNames,
  onDraftChange,
  onSend,
  onTyping,
  onLoadMore,
}: ChatRoomProps) {
  if (!currentRoomId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white via-[#f8fafc] to-indigo-50/30">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto mb-6 rounded-[22px] bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/20 ring-1 ring-primary-500/10">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-[22px] font-bold tracking-tight text-slate-900 mb-2">选择一个房间开始聊天</h2>
          <p className="text-sm text-slate-500 mb-5 leading-relaxed">创建新房间，或从左侧列表进入一个已有房间，体验实时消息、在线人数与历史记录。</p>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs text-slate-500">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            教学演示 · 本地可运行 · 适合通读源码
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc]">
      {/* 聊天头部 */}
      <div className="h-[64px] border-b border-slate-200 flex items-center px-6 bg-white/80 backdrop-blur-xl justify-between shadow-[0_1px_0_rgba(15,23,42,0.04)] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-violet-500/20 ring-1 ring-violet-500/20">
            <span>{currentRoomName ? currentRoomName.charAt(0).toUpperCase() : '#'}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">{currentRoomName || 'Room'}</h2>
              {connStatus !== 'connected' && connStatus !== 'idle' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-600 border border-amber-200 connection-pulse">
                  {connStatus === 'reconnecting' ? '重连中' : connStatus === 'connecting' ? '连接中' : '已断开'}
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 已连接
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow shadow-emerald-500/20" />
                {onlineCount} 人在线
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="text-slate-400">WebSocket 实时</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-400">
          <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* 消息列表 */}
      <MessageList
        items={items}
        user={user}
        currentRoomId={currentRoomId}
        onLoadMore={onLoadMore}
      />

      {/* 输入区 */}
      <MessageInput
        draft={draft}
        typingNames={typingNames}
        onDraftChange={onDraftChange}
        onSend={onSend}
        onTyping={onTyping}
      />
    </div>
  )
}
