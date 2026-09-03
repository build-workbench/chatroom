import { useEffect, useRef, useState } from 'react'
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
  onToggleSidebar?: () => void
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
  onToggleSidebar,
}: ChatRoomProps) {
  const [showHelp, setShowHelp] = useState(false)
  const helpRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showHelp) return
    function handleClick(e: MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setShowHelp(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showHelp])

  if (!currentRoomId) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 relative overflow-hidden select-none">
        <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
        <div className="text-center max-w-lg w-full relative z-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-blue-600 via-primary-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/10 animate-scale-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2.5">
            选择或新建一个频道开始畅聊
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-md mx-auto">
            点击左侧房间列表进入对话，体验毫秒级广播、在线人数感知、输入中提示与历史消息漫游。
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto mb-6 text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                全双工 WebSocket
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                基于 Gorilla WebSocket 实现低延迟即时双向推送
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                智能状态感知
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                在线列表、打字状态侦测与掉线平滑重连
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {onToggleSidebar ? (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="md:hidden inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-xs font-semibold shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                打开频道列表
              </button>
            ) : null}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 shadow-xs text-xs font-medium text-slate-600">
              <span className="w-2 h-2 bg-emerald-500 rounded-full status-online" />
              Go 1.24 + React 19 · 代码即教学文档
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative overflow-hidden">
      {/* 聊天头部 */}
      <header className="h-[64px] border-b border-slate-200/80 flex items-center px-4 sm:px-6 bg-white/85 backdrop-blur-xl justify-between shadow-xs sticky top-0 z-20 select-none">
        <div className="flex items-center gap-3 min-w-0">
          {onToggleSidebar ? (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer"
              title="打开频道列表"
              aria-label="打开频道列表"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : null}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-blue-500/20 ring-2 ring-blue-500/10 flex-shrink-0">
            <span>{currentRoomName ? currentRoomName.charAt(0).toUpperCase() : '#'}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold text-sm">#</span>
                <h2 className="text-[15px] font-bold text-slate-900 tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                  {currentRoomName || 'Room'}
                </h2>
              </div>
              {connStatus === 'connected' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  已连接
                </span>
              ) : connStatus !== 'idle' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 connection-pulse">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  {connStatus === 'reconnecting' ? '正在重连' : connStatus === 'connecting' ? '正在连接' : '已断开'}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                {onlineCount} 人在线
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] text-slate-400">实时广播</span>
            </div>
          </div>
        </div>

        {/* 顶部右侧快捷说明与操作 */}
        <div className="flex items-center gap-2">
          <div className="relative" ref={helpRef}>
            <button
              type="button"
              onClick={() => setShowHelp((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="操作帮助与快捷键"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>帮助提示</span>
            </button>

            {showHelp ? (
              <div className="absolute right-0 mt-2 w-72 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 animate-scale-in text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">使用提示 & 快捷键</span>
                  <button
                    type="button"
                    onClick={() => setShowHelp(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>发送消息</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>输入换行</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">Shift + Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>提及某人</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">@用户名</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>历史记录加载</span>
                    <span className="text-slate-400 text-[11px]">滚动到顶部自动加载</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* 消息列表区 */}
      <MessageList
        items={items}
        user={user}
        currentRoomId={currentRoomId}
        onLoadMore={onLoadMore}
        onDraftFill={(text) => onDraftChange(text)}
      />

      {/* 输入区域 */}
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

