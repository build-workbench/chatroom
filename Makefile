.PHONY: all build test lint fmt clean run dev db docker-build docker-run docker-stop help

BINARY_NAME  := chatroom
BUILD_DIR    := bin
DOCKER_IMAGE := chatroom
VERSION      ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo dev)
GIT_COMMIT   ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo unknown)
BUILD_TIME   ?= $(shell date -u '+%Y-%m-%dT%H:%M:%SZ')
LDFLAGS      := -ldflags "-s -w -X main.Version=$(VERSION) -X main.GitCommit=$(GIT_COMMIT) -X main.BuildTime=$(BUILD_TIME)"

all: lint test build

build:
	@mkdir -p $(BUILD_DIR)
	go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/server

test:
	go test -race -cover ./...

lint:
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run ./...; \
	else \
		echo "golangci-lint 未安装：go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest" >&2; \
		exit 1; \
	fi

fmt:
	go fmt ./...
	@if command -v goimports >/dev/null 2>&1; then goimports -w -local chatroom .; fi

clean:
	rm -rf $(BUILD_DIR) coverage.out coverage.html

run: build
	./$(BUILD_DIR)/$(BINARY_NAME)

dev:
	./scripts/dev.sh

db:
	docker compose up -d postgres

docker-build:
	docker build -t $(DOCKER_IMAGE):$(VERSION) -f deploy/docker/Dockerfile .
	docker tag $(DOCKER_IMAGE):$(VERSION) $(DOCKER_IMAGE):latest

docker-run:
	docker compose up -d

docker-stop:
	docker compose down

help:
	@echo "目标："
	@echo "  all          - lint + test + build"
	@echo "  build        - 编译后端二进制"
	@echo "  test         - 运行 Go 测试（-race -cover）"
	@echo "  lint         - 运行 golangci-lint"
	@echo "  fmt          - 格式化 Go 代码"
	@echo "  clean        - 清理构建产物"
	@echo "  run          - 编译并运行"
	@echo "  dev          - 启动开发环境（postgres + 后端）"
	@echo "  db           - 仅启动数据库"
	@echo "  docker-build - 构建 Docker 镜像"
	@echo "  docker-run   - 通过 docker compose 启动服务"
	@echo "  docker-stop  - 停止 docker compose 服务"
