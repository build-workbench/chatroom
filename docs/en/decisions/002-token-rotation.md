# ADR-002: Token Rotation Strategy

- **Status**: ✅ Adopted
- **Date**: 2025-01-20
- **Decision Makers**: @LessUp

## Background

User authentication requires tokens to verify identity. Traditional single-token approaches have the following issues:

1. **Long-term Token Risk**: If a token is leaked, an attacker can impersonate the user for the token's validity period
2. **Short-term Token UX**: Frequent re-login affects user experience
3. **Security vs Convenience Balance**: Need to find a balance between security and user experience

## Decision

Adopt a **Dual Token + Token Rotation Strategy**:

```mermaid
flowchart TB
    subgraph Login["Login"]
        L1["User Login"] --> L2["Generate Access Token<br/>(15 minutes)"]
        L2 --> L3["Generate Refresh Token<br/>(7 days)"]
        L3 --> L4["Store Refresh Token<br/>in Database"]
    end
    
    subgraph API["API Request"]
        A1["Carry Access Token"] --> A2{"Token Valid?"}
        A2 -->|Yes| A3["Process Request"]
        A2 -->|Expired| A4["Return 401"]
    end
    
    subgraph Refresh["Token Refresh"]
        R1["Carry Refresh Token"] --> R2{"Refresh Token<br/>Valid?"}
        R2 -->|Yes| R3["Revoke Old Refresh Token"]
        R3 --> R4["Generate New Access Token"]
        R4 --> R5["Generate New Refresh Token"]
        R5 --> R6["Store New Refresh Token"]
        R6 --> R7["Return New Token Pair"]
        R2 -->|No| R8["Require Re-login"]
    end
    
    Login --> API
    API --> Refresh
```

### Token Design

| Token Type | Validity | Storage Location | Purpose |
|------------|----------|------------------|---------|
| Access Token | 15 minutes | Frontend memory / localStorage | API request authentication |
| Refresh Token | 7 days | Database + Frontend localStorage | Refresh Access Token |

### Token Rotation Process

Each refresh will:
1. Validate the Refresh Token's validity
2. **Revoke** the old Refresh Token
3. Issue a **new** Access Token + Refresh Token pair

## Consequences

### ✅ Positive

- **Minimized Leak Window**: Access Token is short-lived, even if leaked, only 15 minutes of risk window
- **Seamless Refresh**: Users don't need to login frequently, Refresh Token automatically gets new Access Token
- **Traceability**: Refresh Token stored in database, can be audited and revoked
- **Auto Cleanup**: Expired Refresh Tokens are cleaned up by scheduled tasks

### ⚠️ Negative

- **Increased Complexity**: Need to manage lifecycles of two types of tokens
- **Database Dependency**: Refresh Token requires database storage, increases database load
- **Concurrent Refresh**: Multiple concurrent refreshes may cause token invalidation, requires client retry mechanism

## Alternatives

### ❌ Single Long-term Token

```
Token validity: 7 days
```

**Rejection Reason**:
- After token leak, attacker has 7 days to impersonate user
- Cannot actively revoke (unless introducing blacklist)
- Does not comply with OAuth 2.0 security best practices

### ❌ Single Short-term Token

```
Token validity: 15 minutes
No Refresh Token
```

**Rejection Reason**:
- Users need to re-login every 15 minutes
- Severely affects user experience
- Frequent login increases server load

### ❌ Session-based Authentication

```
Server-side Session + Cookie
```

**Rejection Reason**:
- Requires server-side storage of Session state
- Distributed scenarios require Session sharing (Redis, etc.)
- Not suitable for SPA and mobile architecture
- Cross-domain Cookie handling is complex

## Configuration Parameters

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `ACCESS_TOKEN_TTL_MINUTES` | 15 | Access Token validity period (minutes) |
| `REFRESH_TOKEN_TTL_DAYS` | 7 | Refresh Token validity period (days) |

---

🌐 **Languages**: English | [简体中文](/en/decisions/002-token-rotation)
