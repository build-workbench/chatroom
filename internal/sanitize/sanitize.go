package sanitize

import (
	"regexp"
	"strings"
)

// UsernameRegex 定义允许的用户名字符：字母、数字、下划线、中文
var usernameRegex = regexp.MustCompile(`^[\p{L}\p{N}_]+$`)

// Username 校验用户名是否合法
// 只允许字母、数字、下划线，防止 XSS 攻击
func Username(username string) bool {
	if username == "" {
		return false
	}
	return usernameRegex.MatchString(username)
}

// Content 对用户输入的内容进行 HTML 转义
// 防止 XSS 攻击
func Content(content string) string {
	var b strings.Builder
	b.Grow(len(content) + 16)
	for _, r := range content {
		switch r {
		case '&':
			b.WriteString("&amp;")
		case '<':
			b.WriteString("&lt;")
		case '>':
			b.WriteString("&gt;")
		case '"':
			b.WriteString("&quot;")
		case '\'':
			b.WriteString("&#39;")
		default:
			b.WriteRune(r)
		}
	}
	return b.String()
}
