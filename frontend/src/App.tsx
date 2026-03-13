import { useCallback, useEffect, useRef } from 'react'

import { ChatRoom } from './components/ChatRoom'
import { Sidebar } from './components/Sidebar'
import { useAuth } from './hooks/useAuth'
import { useChat } from './hooks/useChat'
import { useChatSocket } from './hooks/useChatSocket'
import { loadAuth } from './storage'
import { AuthScreen } from './screens/AuthScreen'
import { useToast } from './toast-context'

export default function App() {
	const toast = useToast()

	// 用 ref 打破 hooks 之间的循环依赖：socket 需要 auth/chat，auth 需要 socket/chat
	const chatResetRef = useRef<() => void>(() => {})
	const socketCloseRef = useRef<() => void>(() => {})

	const auth = useAuth(useCallback(() => {
		socketCloseRef.current()
		chatResetRef.current()
	}, []))

	const { socketRef, connStatus, typingNames } = useChatSocket({
		getAccessToken: () => auth.accessRef.current,
		userRef: auth.userRef,
		onJoinLeave: (evt) => chatAddItemRef.current(evt),
		onMessage: (evt) => chatAddMessageRef.current(evt),
	})

	const chatAddItemRef = useRef<(evt: import('./types').WsEvent) => void>(() => {})
	const chatAddMessageRef = useRef<(evt: import('./types').WsEvent) => void>(() => {})

	const chat = useChat({
		api: auth.api,
		accessRef: auth.accessRef,
		socketRef,
		initialRoomId: loadAuth().lastRoomId,
	})

	// 连接 ref 以打破循环依赖
	chatResetRef.current = chat.resetChat
	socketCloseRef.current = () => socketRef.current?.close()
	chatAddItemRef.current = chat.addItem
	chatAddMessageRef.current = chat.addMessage

	// 登录后加载房间列表
	useEffect(() => {
		if (!auth.user || !auth.accessToken) return
		void chat.reloadRooms()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth.user, auth.accessToken])

	if (!auth.user) {
		return <AuthScreen onLogin={auth.handleLogin} onRegister={auth.handleRegister} />
	}

	return (
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

			<div className="flex-1 flex flex-col bg-dark-950">
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
	)
}
