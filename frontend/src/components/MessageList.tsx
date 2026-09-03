import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { MessageDTO, User, WsEvent } from '../types'
import { AVATAR_COLORS } from '../constants'

function renderMessageContent(content: string, isMe: boolean) {
  const parts: Array<{ type: 'text' | 'mention' | 'url'; value: string }> = []
  const re = /(@[\w\u4e00-\u9fa5]+)|(https?:\/\/[^\s<]+)/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(content)) !== null) {
    if (m.index > last) {
      parts.push({ type: 'text', value: content.slice(last, m.index) })
    }
    const val = m[0]
    if (val.startsWith('@')) parts.push({ type: 'mention', value: val })
    else parts.push({ type: 'url', value: val })
    last = m.index + val.length
  }
  if (last < content.length) parts.push({ type: 'text', value: content.slice(last) })

  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'mention') {
          return (
            <span
              key={i}
              className={
                isMe
                  ? 'inline-block px-1.5 py-0.5 rounded-md bg-white/20 text-white font-semibold border border-white/30 mx-0.5'
                  : 'mention mx-0.5'
              }
            >
              {p.value}
            </span>
          )
        }
        if (p.type === 'url') {
          return (
            <a
              key={i}
              href={p.value}
              target="_blank"
              rel="noopener noreferrer"
              className={
                isMe
                  ? 'text-blue-100 hover:text-white underline underline-offset-2 font-medium break-all'
                  : 'text-primary-600 hover:text-primary-700 underline underline-offset-2 font-medium break-all'
              }
            >
              {p.value}
            </a>
          )
        }
        return <span key={i}>{p.value}</span>
      })}
    </>
  )
}

function formatDateDivider(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const today = new Date()
    if (d.toDateString() === today.toDateString()) {
      return '今天'
    }
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) {
      return '昨天'
    }
    return `${d.getMonth() + 1}月${d.getDate()}日`
  } catch {
    return '历史记录'
  }
}

// 类型守卫：判断 WsEvent 是否为 MessageDTO
function isMessageDTO(evt: WsEvent): evt is MessageDTO {
  return evt.type === 'message' && 'id' in evt && 'content' in evt && 'created_at' in evt
}

interface MessageListProps {
  items: WsEvent[]
  user: User
  currentRoomId: number | null
  onLoadMore: () => void
  onDraftFill?: (text: string) => void
}

export function MessageList({
  items,
  user,
  currentRoomId,
  onLoadMore,
  onDraftFill,
}: MessageListProps) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const prevScrollHeightRef = useRef<number>(0)
  const prevItemCountRef = useRef<number>(0)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [nearBottom, setNearBottom] = useState(true)

  // 记录渲染前的 scrollHeight，用于判断是否为加载旧消息
  useLayoutEffect(() => {
    if (boxRef.current) {
      prevScrollHeightRef.current = boxRef.current.scrollHeight
    }
  }, [items.length])

  const hasRenderableItems = useMemo(
    () => items.some((m) => m.type === 'message' || m.type === 'join' || m.type === 'leave'),
    [items],
  )

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const prevCount = prevItemCountRef.current
    prevItemCountRef.current = items.length

    if (prevCount === 0) {
      box.scrollTop = box.scrollHeight
      return
    }

    const addedItems = items.length > prevCount && prevScrollHeightRef.current > 0
    const wasNearBottom = prevScrollHeightRef.current - box.scrollTop - box.clientHeight < 80

    if (addedItems && !wasNearBottom) {
      const delta = box.scrollHeight - prevScrollHeightRef.current
      box.scrollTop += delta
    } else {
      box.scrollTop = box.scrollHeight
    }
  }, [items, currentRoomId])

  function handleCopy(id: number, content: string) {
    void navigator.clipboard?.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000)
  }

  return (
    <div
      ref={boxRef}
      className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2 bg-gradient-to-b from-slate-50/50 via-[#f8fafc] to-white relative"
      onScroll={() => {
        const box = boxRef.current
        if (!box) return
        if (box.scrollTop <= 20) onLoadMore()
        const isNear = box.scrollHeight - box.scrollTop - box.clientHeight < 80
        setNearBottom(isNear)
      }}
    >
      {!hasRenderableItems ? (
        <div className="h-full min-h-[260px] flex items-center justify-center p-4">
          <div className="max-w-md text-center px-6 py-8 rounded-3xl border border-dashed border-slate-200/90 bg-white/80 shadow-xs">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-primary-600 shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">当前频道暂无消息</p>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              发送第一条消息开启对话，体验毫秒级广播与全双工推送。
            </p>
            {onDraftFill ? (
              <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                <button
                  type="button"
                  onClick={() => onDraftFill('👋 大家好，我在测试实时聊天室！')}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-primary-600 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  👋 打个招呼
                </button>
                <button
                  type="button"
                  onClick={() => onDraftFill('🚀 实时推送速度非常快！')}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-primary-600 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  🚀 体验推送
                </button>
                <button
                  type="button"
                  onClick={() => onDraftFill('💡 这是一个基于 Go + React 的教学项目。')}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-primary-600 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  💡 介绍项目
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {items.map((m, index) => {
        // 日期分隔栏计算
        let showDateDivider = false
        let dateDividerText = ''
        if (isMessageDTO(m)) {
          const currentDate = new Date(m.created_at).toDateString()
          const prevMsg = index > 0 && isMessageDTO(items[index - 1]) ? (items[index - 1] as MessageDTO) : null
          if (!prevMsg || new Date(prevMsg.created_at).toDateString() !== currentDate) {
            showDateDivider = true
            dateDividerText = formatDateDivider(m.created_at)
          }
        }

        if (m.type === 'join' || m.type === 'leave') {
          return (
            <div key={`${m.type}-${m.user_id}-${index}`} className="flex justify-center my-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-white/90 px-3 py-1 rounded-full border border-slate-200/80 shadow-xs">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${m.type === 'join' ? 'bg-emerald-500' : 'bg-slate-400'}`}
                />
                <span className={m.type === 'join' ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                  {m.username}
                </span>
                <span>{m.type === 'join' ? '加入了房间' : '离开了房间'}</span>
              </span>
            </div>
          )
        }

        if (!isMessageDTO(m)) return null
        const msg = m
        const isMe = msg.username === user.username
        const ts = new Date(msg.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        // 智能消息分组：与上一条若为同用户且时间相近（2分钟内），聚合渲染
        const prevItem = index > 0 ? items[index - 1] : null
        const isGrouped =
          prevItem &&
          isMessageDTO(prevItem) &&
          prevItem.username === msg.username &&
          Math.abs(new Date(msg.created_at).getTime() - new Date(prevItem.created_at).getTime()) < 120000 &&
          !showDateDivider

        return (
          <div key={msg.id} className="space-y-1">
            {showDateDivider ? (
              <div className="flex items-center justify-center my-3">
                <span className="text-[11px] font-medium px-3 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/70">
                  {dateDividerText}
                </span>
              </div>
            ) : null}

            <div
              className={`msg-wrapper group flex items-start gap-2.5 ${
                isMe ? 'flex-row-reverse' : ''
              } ${isGrouped ? 'mt-1' : 'mt-3'} msg-appear`}
            >
              {/* 对方头像（组首条消息展示） */}
              {!isMe && (
                <div className="w-8 flex-shrink-0 flex justify-center">
                  {!isGrouped ? (
                    <div
                      className={`w-8 h-8 rounded-xl bg-gradient-to-br ${
                        AVATAR_COLORS[msg.user_id % AVATAR_COLORS.length]
                      } flex items-center justify-center text-white text-xs font-bold shadow-xs select-none avatar-hover`}
                    >
                      {msg.username.substring(0, 2).toUpperCase()}
                    </div>
                  ) : null}
                </div>
              )}

              {/* 自己的头像（组首条消息展示） */}
              {isMe && (
                <div className="w-8 flex-shrink-0 flex justify-center">
                  {!isGrouped ? (
                    <div
                      className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs select-none avatar-hover"
                    >
                      {msg.username.substring(0, 2).toUpperCase()}
                    </div>
                  ) : null}
                </div>
              )}

              {/* 消息主体 */}
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[76%] sm:max-w-[70%]`}>
                {!isGrouped ? (
                  <div className={`flex items-center gap-2 mb-1 text-xs ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="font-semibold text-slate-700 text-xs tracking-tight">
                      {msg.username}
                    </span>
                    <span className="text-[11px] text-slate-400">{ts}</span>
                  </div>
                ) : null}

                <div className="relative group/bubble flex items-center">
                  <div
                    className={`${
                      isMe
                        ? `msg-own rounded-2xl rounded-tr-xs${!isGrouped ? ' msg-tail-own' : ''}`
                        : `msg-other rounded-2xl rounded-tl-xs${!isGrouped ? ' msg-tail-other' : ''}`
                    } px-4 py-2.5 max-w-full break-words text-[13.5px] leading-[1.6] select-text`}
                  >
                    {renderMessageContent(msg.content, isMe)}
                  </div>

                  {/* 悬停快捷复制操作 */}
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className={`opacity-0 group-hover/bubble:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-400 hover:text-slate-700 shadow-xs border border-slate-200/80 cursor-pointer absolute ${
                      isMe ? '-left-8' : '-right-8'
                    }`}
                    title={copiedId === msg.id ? '已复制' : '复制内容'}
                    aria-label="复制消息"
                  >
                    {copiedId === msg.id ? (
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {!nearBottom && (
        <button
          type="button"
          onClick={() => {
            boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' })
          }}
          className="scroll-to-bottom sticky bottom-4 left-full -translate-x-14 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary-600 hover:border-primary-300 cursor-pointer"
          aria-label="滚动到最新消息"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  )
}

