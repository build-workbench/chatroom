# Learning Path

ChatRoom is a teaching-oriented project designed with different learning paths for different types of learners. Choose the path that best suits you and start your full-stack development journey.

---

## 👨‍💻 Backend Developer Path {#backend}

**Estimated Time**: 2-3 hours  
**Goal**: Deep understanding of Go backend development, JWT, WebSocket, and database skills

### Overview

| Step | Topic | Time | Goal |
|-----|------|------|------|
| 1 | Project Structure & Dependencies | 20 min | Understand Clean Architecture |
| 2 | Database Design | 30 min | Master GORM modeling & migrations |
| 3 | JWT Dual Token | 40 min | Understand auth flow & security |
| 4 | WebSocket Hub | 45 min | Master broadcasting & session mgmt |
| 5 | Deployment | 30 min | Docker & K8s practices |

### Step-by-Step Guide

#### Step 1: Project Structure

**Read**:
- [Architecture](./architecture) - System overview
- [Design](./design) - Design decisions

**Key Learning**:
- Understand `internal/` directory organization
- Interface-driven design principles
- Simple dependency injection

**Practice**:
```bash
# Analyze project structure
tree internal/ -L 2

# Understand dependencies
cat internal/server/server.go | head -50
```

---

#### Step 2: Database with GORM

**Read**: `internal/models/`

**Key Learning**:
- GORM model definitions
- Database migrations
- PostgreSQL features (JSON, indexes)

---

#### Step 3: JWT Authentication

**Read**:
- `internal/auth/`
- [API - Authentication](./api#authentication)

**Key Learning**:
- Access Token vs Refresh Token
- Token rotation mechanism
- Secure storage & transport

**Practice**:
```bash
# Test auth flow with curl

# 1. Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'

# 2. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

#### Step 4: WebSocket Hub

**Read**:
- `internal/ws/`
- [Architecture - WebSocket Layer](./architecture#websocket-layer)

**Key Learning**:
- Hub pattern design
- Room management & broadcasting
- Heartbeat & reconnection
- Distributed deployment sync

---

#### Step 5: Docker & Kubernetes

**Read**: `deploy/`

**Practice**:
```bash
# Build Docker image
docker build -t chatroom:latest -f deploy/docker/Dockerfile .
```

---

## 👩‍💻 Frontend Developer Path {#frontend}

**Estimated Time**: 1-2 hours  
**Goal**: Master React + TypeScript for real-time interactive UIs

### Overview

| Step | Topic | Time | Goal |
|-----|------|------|------|
| 1 | API Overview | 15 min | REST + WebSocket interfaces |
| 2 | WebSocket Client | 30 min | Connection & reconnection |
| 3 | React Hooks | 25 min | State management |
| 4 | Token Refresh | 20 min | Auto-refresh handling |
| 5 | UI Implementation | 30 min | Components & real-time updates |

---

## 🎯 Full-Stack Developer Path {#fullstack}

**Estimated Time**: 4-5 hours  
**Goal**: Complete mastery of frontend & backend, independent development

### Overview

| Step | Topic | Time | Goal |
|-----|------|------|------|
| 1 | Quick Start | 20 min | Dev environment setup |
| 2 | Code Walkthrough | 60 min | Full-stack understanding |
| 3 | Feature Extension | 90 min | Add new feature |
| 4 | Testing | 45 min | Unit & integration tests |
| 5 | Production Deploy | 30 min | Full deployment flow |

---

## 📚 Recommended Reading Order

If you don't have a specific goal, read in this order:

1. [Getting Started](./getting-started) — 5-min setup
2. [Manual Testing](./manual-testing) — Verify core features
3. [API Documentation](./api) — Interface design
4. [Architecture](./architecture) — System layers
5. [Design](./design) — Design decisions

---

## 💡 Learning Tips

### Learn by Doing

Don't just read—open the project and experiment:
```bash
code .  # Open in VS Code
```

### Take Notes

Keep a notes file for:
- Code you don't understand
- Design improvements you want to make
- Errors you encounter

### Try Modifications

After reading a module, try modifying something:
- Change a color theme
- Add a field
- Modify response format

### Get Help

If stuck:
- Check [FAQ](./faq)
- Open a GitHub Issue
- Read code comments
