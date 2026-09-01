import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import type { MessageDTO, User, WsEvent } from '../types'

import { AVATAR_COLORS } from '../constants'

function escapeText(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderMessageContent(content: string) {
  const safe = escapeText(content)
  const parts: Array<{ type: 'text' | 'mention' | 'url'; value: string }> = []

  const re = /(@\w+)|(https?:\/\/[^\s<]+)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(safe)) !== null) {
    if (m.index > last) {
      parts.push({ type: 'text', value: safe.slice(last, m.index) })
    }
    const val = m[0]
    if (val.startsWith('@')) parts.push({ type: 'mention', value: val })
    else parts.push({ type: 'url', value: val })
    last = m.index + val.length
  }
  if (last < safe.length) parts.push({ type: 'text', value: safe.slice(last) })

  return (
    <>
      {parts.map((p, i) => {
        if (p.type === 'mention') {
          return (
            <span key={i} className="mention">
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
              rel="noopener"
              className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
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

// 类型守卫：判断 WsEvent 是否为 MessageDTO
function isMessageDTO(evt: WsEvent): evt is MessageDTO {
  return evt.type === 'message' && 'id' in evt && 'content' in evt && 'created_at' in evt
}

interface MessageListProps {
  items: WsEvent[]
  user: User
  currentRoomId: number | null
  onLoadMore: () => void
}

export function MessageList({ items, user, currentRoomId, onLoadMore }: MessageListProps) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const prevScrollHeightRef = useRef<number>(0)
  const prevItemCountRef = useRef<number>(0)

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

  return (
    <div
      ref={boxRef}
      className="flex-1 overflow-y-auto p-6 space-y-3 bg-gradient-to-b from-[#f8fafc] via-[#f8fafc] to-white"
      onScroll={() => {
        const box = boxRef.current
        if (!box) return
        if (box.scrollTop <= 20) onLoadMore()
      }}
    >
      {!hasRenderableItems ? (
        <div className="h-full min-h-[220px] flex items-center justify-center">
          <div className="max-w-sm text-center px-6 py-8 rounded-2xl border border-dashed border-slate-200 bg-white shadow-sm">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700">这个房间还没有消息</p>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">可以先发一条消息，验证实时推送、历史记录和输入状态是否正常。</p>
          </div>
        </div>
      ) : null}
      {items.map((m, index) => {
        if (m.type === 'join' || m.type === 'leave') {
          return (
            <div key={`${m.type}-${m.user_id}-${index}`} className="flex justify-center my-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <span className={m.type === 'join' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>{m.username}</span>
                {m.type === 'join' ? '加入了房间' : '离开了房间'}
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
        const wrapperCls = `msg-wrapper group flex gap-3 ${isMe ? 'flex-row-reverse' : ''} msg-appear`
        return (
          <div key={msg.id} className={wrapperCls}>
            {!isMe ? (
              <div
                className={`w-8 h-8 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[msg.user_id % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1 shadow-md`}
              >
                {msg.username.substring(0, 2).toUpperCase()}
              </div>
            ) : null}
            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[72%]`}>
              <div className={`flex items-center gap-2 mb-1.5 text-xs ${isMe ? 'flex-row-reverse' : ''}`}>
                <span className={`font-semibold ${isMe ? 'text-slate-700' : 'text-slate-700'}`}>{msg.username}</span>
                <span className="text-slate-400">{ts}</span>
              </div>
              <div className={`${isMe ? 'msg-own' : 'msg-other'} px-4 py-2.5 max-w-full break-words text-[13.5px] leading-[1.6]`}>
                {renderMessageContent(msg.content)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
