import { getRequestErrorMessage, getRequestErrorStatus, isNetworkRequestError } from './api'

export type ApiErrorContext =
  | 'login'
  | 'register'
  | 'rooms'
  | 'createRoom'
  | 'messages'
  | 'loadMoreMessages'
  | 'wsTicket'

const NETWORK_MESSAGES: Record<ApiErrorContext, string> = {
  login: '登录失败，请检查网络连接',
  register: '注册失败，请检查网络连接',
  rooms: '加载房间列表失败，请检查网络连接',
  createRoom: '创建房间失败，请检查网络连接',
  messages: '加载历史消息失败，请检查网络连接',
  loadMoreMessages: '加载更早消息失败，请检查网络连接',
  wsTicket: '获取连接票据失败，请检查网络连接',
}

const DEFAULT_MESSAGES: Record<ApiErrorContext, string> = {
  login: '登录失败，请稍后重试',
  register: '注册失败，请稍后重试',
  rooms: '加载房间列表失败，请稍后重试',
  createRoom: '创建房间失败，请稍后重试',
  messages: '加载历史消息失败，请稍后重试',
  loadMoreMessages: '加载更早消息失败，请稍后重试',
  wsTicket: '获取连接票据失败，请稍后重试',
}

function isServerErrorStatus(status: number | undefined): boolean {
  return typeof status === 'number' && status >= 500
}

export function mapApiError(error: unknown, context: ApiErrorContext): string {
  if (isNetworkRequestError(error)) {
    return NETWORK_MESSAGES[context]
  }

  const status = getRequestErrorStatus(error)
  const responseMessage = getRequestErrorMessage(error)

  // 通用状态码处理
  if (status === 401) {
    return '登录状态已失效，请重新登录'
  }
  if (status === 429) {
    return '请求过于频繁，请稍后再试'
  }

  // 上下文特定的错误处理
  switch (context) {
    case 'login':
      if (responseMessage === 'invalid credentials') return '登录失败，用户名或密码错误'
      if (status === 400 || responseMessage === 'invalid payload') return '登录失败，请输入有效的用户名和密码'
      if (isServerErrorStatus(status) || responseMessage === 'login failed') return '登录失败，服务暂时不可用'
      break

    case 'register':
      if (status === 409 || responseMessage === 'username taken') return '注册失败，用户名已存在'
      if (status === 400 || responseMessage === 'invalid payload') return '注册失败，请使用 2-64 位用户名和 4-128 位密码'
      if (isServerErrorStatus(status) || responseMessage === 'failed to create user') return '注册失败，服务暂时不可用'
      break

    case 'rooms':
      if (isServerErrorStatus(status) || responseMessage === 'failed to list rooms') return '加载房间列表失败，服务暂时不可用'
      break

    case 'createRoom':
      if (status === 409 || responseMessage === 'room name taken') return '房间名已存在，请换一个试试'
      if (status === 400 || responseMessage === 'invalid payload') return '房间名不合法，请重新输入'
      if (isServerErrorStatus(status) || responseMessage === 'failed to create room') return '创建房间失败，服务暂时不可用'
      break

    case 'messages':
      if (status === 400 || responseMessage === 'invalid room id') return '房间不存在或消息参数无效'
      if (status === 404 || responseMessage === 'room not found') return '房间不存在，可能已被删除'
      if (isServerErrorStatus(status) || responseMessage === 'failed to list messages') return '加载历史消息失败，服务暂时不可用'
      break

    case 'loadMoreMessages':
      if (status === 404 || responseMessage === 'room not found') return '房间不存在，无法继续加载历史消息'
      if (isServerErrorStatus(status) || responseMessage === 'failed to list messages') return '加载更早消息失败，服务暂时不可用'
      break

    case 'wsTicket':
      if (status === 404 || responseMessage === 'room not found') return '房间不存在，无法获取连接票据'
      if (isServerErrorStatus(status) || responseMessage === 'failed to create ws ticket') return '获取连接票据失败，服务暂时不可用'
      break
  }

  return DEFAULT_MESSAGES[context]
}
