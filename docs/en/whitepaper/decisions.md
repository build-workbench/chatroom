# Key Decisions

This document indexes all Architecture Decision Records (ADRs) with brief summaries.

## Decision Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](/en/decisions/001-ws-auth) | WebSocket Authentication | ✅ Adopted | 2025-01 |
| [ADR-002](/en/decisions/002-token-rotation) | Token Rotation Strategy | ✅ Adopted | 2025-01 |
| [ADR-003](/en/decisions/003-distributed-sync) | Distributed Message Sync | ✅ Adopted | 2025-02 |

## Decision Summaries

### ADR-001: WebSocket Authentication

**Problem**: WebSocket protocol doesn't support HTTP Authorization header, how to authenticate securely?

**Decision**: One-time Ticket approach

```
1. Client gets Ticket via REST API
2. Ticket passed via WebSocket Subprotocol
3. Server validates and immediately consumes Ticket
4. Establish long connection
```

**Rationale**:
- Avoid exposing Token in URL
- Ticket is one-time use, prevents replay
- Bound to room, prevents cross-room abuse

---

### ADR-002: Token Rotation Strategy

**Problem**: How to balance Token security and user experience?

**Decision**: Dual Token + Auto Rotation

```
Access Token: 15 minute TTL
Refresh Token: 7 day TTL, rotates on each use
```

**Rationale**:
- Access Token leak impact is limited
- Refresh Token rotation detects theft
- Transparent to users

---

### ADR-003: Distributed Message Sync

**Problem**: How to sync WebSocket messages across multiple instances?

**Decision**: PostgreSQL LISTEN/NOTIFY

```sql
-- Publish message
NOTIFY 'room:123', '{"type":"message",...}'

-- Subscribe to messages
LISTEN 'room:123'
```

**Rationale**:
- No Redis needed
- Atomic with database transactions
- Auto-cleanup (auto UNLISTEN on disconnect)

**Limitations**:
- Max 8000 bytes per message
- No ordering guarantee (handled at app layer)

---

## Decision Template

New decisions should follow this template:

```markdown
# ADR-NNN: Decision Title

## Status
[Proposed | Adopted | Deprecated | Superseded]

## Context
Describe the problem background and constraints

## Decision
Describe the decision made

## Rationale
Explain why this decision was made

## Consequences
Describe the impacts (positive and negative)
```

---

🌐 **Languages**: English | [简体中文](/zh/whitepaper/decisions)
