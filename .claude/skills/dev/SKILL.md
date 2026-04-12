---
name: dev
description: Start full-stack local development environment — PostgreSQL, Go backend, and Vite dev server. Use when you need to run the app locally.
disable-model-invocation: true
---

# Dev

Start the full local development stack.

## Prerequisites

- Docker and Docker Compose must be available.

## Steps

1. **Start PostgreSQL**:
   ```
   docker compose up -d postgres
   ```
   Wait for the health check to pass (the container reports healthy).

2. **Start Go backend** (in background):
   ```
   go run ./cmd/server
   ```
   This starts the API/WebSocket server on port 8080.

3. **Start Vite dev server** (in background):
   ```
   npm --prefix frontend run dev
   ```
   This starts the frontend dev server on port 5173, which proxies `/api` and `/ws` to port 8080.

4. **Report** to the user that all services are running and provide the URLs:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - WebSocket: ws://localhost:8080/ws

If any service fails to start, show the error and suggest how to fix it (e.g., port already in use, missing dependencies).
