import { useCallback, useEffect, useRef } from 'react'

import type { WsEvent } from './types'

import { ChatRoom } from './components/ChatRoom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Sidebar } from './components/Sidebar'
import { useAuth } from './hooks/useAuth'
import { useChat } from './hooks/useChat'
import { useChatSocket } from './hooks/useChatSocket'
import { loadAuth } from './storage'
import { AuthScreen } from './screens/AuthScreen'
import { useToast } from './toast-context'

export default function App() {
	const toast = useToast()

	// 用 ref 打破 hooks 之间的循环依赖。
	// useChatSocket 需要 auth 的 token 和 chat 的事件回调；
	// useChat 需要 socket 的引用；auth 的 logout 需要 socket/chat 的清理。
	// 直接传函数会在每次渲染时创建新闭包，导致 hooks 的 useEffect 反复触发。
	// 用 ref 存函数引用，在 useEffect 中同步，既避免循环依赖又保持引用稳定。
	const chatResetRef = useRef<() => void>(() => {})
	const socketCloseRef = useRef<() => void>(() => {})

	const auth = useAuth(useCallback(() => {
		socketCloseRef.current()
		chatResetRef.current()
	}, []))

	const { socketRef, connStatus, typingNames } = useChatSocket({
		api: auth.api,
		getAccessToken: () => auth.accessRef.current,
		userRef: auth.userRef,
		onJoinLeave: (evt) => chatAddItemRef.current(evt),
		onMessage: (evt) => chatAddMessageRef.current(evt),
	})

	const chatAddItemRef = useRef<(evt: WsEvent) => void>(() => {})
	const chatAddMessageRef = useRef<(evt: WsEvent) => void>(() => {})

	const chat = useChat({
		api: auth.api,
		accessRef: auth.accessRef,
		socketRef,
		initialRoomId: loadAuth().lastRoomId,
	})

	// 连接 ref 以打破循环依赖 - 必须在 useEffect 中更新 ref
	useEffect(() => {
		chatResetRef.current = chat.resetChat
		socketCloseRef.current = () => socketRef.current?.close()
		chatAddItemRef.current = chat.addItem
		chatAddMessageRef.current = chat.addMessage
	})

	// 登录后加载房间列表。用一个只读 ref 保存 reloadRooms，避免把整个
	// chat 对象放进依赖数组——useChat 每次渲染都会返回新对象，会导致
	// 该 effect 反复触发 reloadRooms，进而把房间列表接口的限速打满。
	const reloadRoomsRef = useRef<() => Promise<void>>(async () => {})
	useEffect(() => {
		reloadRoomsRef.current = chat.reloadRooms
	})
	useEffect(() => {
		if (!auth.user || !auth.accessToken) return
		reloadRoomsRef.current().catch((error) => {
			console.error('Failed to load rooms:', error)
		})
	}, [auth.user, auth.accessToken])

	if (!auth.user) {
		return <AuthScreen onLogin={auth.handleLogin} onRegister={auth.handleRegister} />
	}

	return (
		<ErrorBoundary>
			<div className="h-full flex">
				<Sidebar
					user={auth.user}
					rooms={chat.rooms}
					currentRoomId={chat.currentRoomId}
					roomQuery={chat.roomQuery}
					newRoomName={chat.newRoomName}
					onRoomQueryChange={chat.setRoomQuery}
					onNewRoomNameChange={chat.setNewRoomName}
					onCreateRoom={() => void chat.createRoom()}
					onJoinRoom={(id, name, online) => void chat.joinRoom(id, name, online)}
					onLogout={() => {
						auth.logout()
						toast.info('已退出登录')
					}}
				/>

				<div className="flex-1 flex flex-col bg-[#f8fafc]">
					<ChatRoom
						user={auth.user}
						currentRoomId={chat.currentRoomId}
						currentRoomName={chat.currentRoomName}
						onlineCount={chat.onlineCount}
						connStatus={connStatus}
						items={chat.items}
						draft={chat.draft}
						typingNames={typingNames}
						onDraftChange={chat.setDraft}
						onSend={chat.sendMessage}
						onTyping={() => socketRef.current?.sendTyping(true)}
						onLoadMore={() => void chat.loadMoreHistory()}
					/>
				</div>
			</div>
		</ErrorBoundary>
	)
}
