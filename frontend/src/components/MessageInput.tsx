import { useCallback, useRef } from 'react'

interface MessageInputProps {
  draft: string
  typingNames: string[]
  onDraftChange: (value: string) => void
  onSend: () => void
  onTyping: () => void
}

function formatTyping(names: string[]): string {
  if (names.length === 0) return ''
  if (names.length === 1) return `${names[0]} 正在输入...`
  if (names.length === 2) return `${names[0]} 和 ${names[1]} 正在输入...`
  return `${names[0]} 和其他 ${names.length - 1} 人正在输入...`
}

export function MessageInput({
  draft,
  typingNames,
  onDraftChange,
  onSend,
  onTyping,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [])

  const handleSend = useCallback(() => {
    onSend()
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (el) {
        el.style.height = 'auto'
      }
    })
  }, [onSend])

  return (
    <>
      <div className="px-6 h-6 flex items-center bg-white/60 backdrop-blur">
        <div className={`text-xs text-slate-500 flex items-center gap-1.5 transition-opacity duration-300 ${typingNames.length ? 'opacity-100' : 'opacity-0'}`}>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full typing-dot" />
          </span>
          <span>{formatTyping(typingNames)}</span>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-1px_12px_rgba(15,23,42,0.04)]">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => {
                onDraftChange(e.target.value)
                onTyping()
                autoResize()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              rows={1}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary-400 input-glow transition-all resize-none shadow-sm"
              placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
              style={{ maxHeight: 120 }}
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            className="bg-gradient-to-br from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white p-3.5 rounded-2xl font-medium transition-all btn-shine shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/25 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
            aria-label="发送消息"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        <p className="text-[11px] text-center text-slate-400 mt-2">按 Enter 快速发送 · Shift+Enter 换行</p>
      </div>
    </>
  )
}
