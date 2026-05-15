package service

import "errors"

// 业务层通用错误，handler 可根据错误类型映射到合适的 HTTP 状态码。
var (
	// 用户相关错误
	ErrUsernameTaken      = errors.New("username taken")
	ErrInvalidCredentials = errors.New("invalid credentials")

	// 房间相关错误
	ErrRoomNotFound  = errors.New("room not found")
	ErrRoomNameTaken = errors.New("room name taken")

	// 令牌相关错误
	ErrInvalidToken = errors.New("invalid token")
	ErrTokenExpired = errors.New("token expired")

	// 通用错误
	ErrInternal = errors.New("internal error")
)
