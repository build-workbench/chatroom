import { useCallback, useRef } from 'react'

interface MessageInputProps {
  draft: string
  typingNames: string[]
  onDraftChange: (value: string) => void
  onSend: () => void
  onTyping: () => void
}

const QUICK_EMOJIS = ['👍', '❤️', '🔥', '🎉', '😂', '🚀', '✨', '👋', '💡']

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
    if (!draft.trim()) return
    onSend()
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (el) {
        el.style.height = 'auto'
      }
    })
  }, [draft, onSend])

  const handleAddEmoji = useCallback(
    (emoji: string) => {
      onDraftChange(draft + emoji)
      onTyping()
      setTimeout(() => {
        textareaRef.current?.focus()
        autoResize()
      }, 0)
    },
    [draft, onDraftChange, onTyping, autoResize],
  )

  const handleClear = useCallback(() => {
    onDraftChange('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }, [onDraftChange])

  return (
    <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(15,23,42,0.02)] select-none">
      {/* 顶部输入中感知栏与快捷 Emoji 反应栏 */}
      <div className="px-4 sm:px-6 pt-2.5 pb-1 flex items-center justify-between gap-2">
        {/* 输入中提示 */}
        <div className="h-5 flex items-center">
          <div
            className={`text-xs text-slate-500 flex items-center gap-1.5 transition-opacity duration-300 ${
              typingNames.length ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full typing-dot" />
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full typing-dot" />
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full typing-dot" />
            </span>
            <span className="text-[11px] font-medium text-slate-600">{formatTyping(typingNames)}</span>
          </div>
        </div>

        {/* 快捷表情选择栏 */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAddEmoji(emoji)}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 active:scale-90 text-sm transition-transform cursor-pointer"
              title={`插入 ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 主输入输入框卡片 */}
      <div className="px-4 sm:px-6 pb-3 pt-1">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-slate-50/90 hover:bg-white focus-within:bg-white border border-slate-200/90 focus-within:border-primary-400 focus-within:ring-3 focus-within:ring-primary-500/10 rounded-2xl p-2 transition-all shadow-xs">
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
              className="flex-1 bg-transparent px-3 py-1.5 text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none resize-none leading-relaxed select-text"
              placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
              style={{ maxHeight: 120 }}
            />

            {draft ? (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer self-center"
                title="清空内容"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:hover:from-blue-600 disabled:hover:to-indigo-600 text-white p-2.5 rounded-xl transition-all btn-shine shadow-xs hover:shadow-md hover:shadow-blue-500/20 active:scale-95 flex items-center justify-center cursor-pointer"
              aria-label="发送消息"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-2">
            <span>按 <kbd className="px-1 py-0.2 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">Enter</kbd> 发送 · <kbd className="px-1 py-0.2 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">Shift + Enter</kbd> 换行</span>
            {draft.length > 0 && <span>{draft.length} 字符</span>}
          </div>
        </div>
      </div>
    </footer>
  )
}

