# Repository Collaboration Guide

## Project Philosophy: Spec-Driven Development (SDD)

This repository strictly follows the **Spec-Driven Development (SDD)** paradigm. All code implementations must use the `/specs` directory as the **Single Source of Truth** for product requirements, technical designs, API definitions, database schemas, and test specifications.

## Directory Context

| Directory | Purpose |
|-----------|---------|
| `/specs/product/` | Product feature definitions and acceptance criteria (PRDs) |
| `/specs/rfc/` | Technical design documents and architecture RFCs |
| `/specs/api/` | API interface specifications (OpenAPI, WebSocket protocols) |
| `/specs/db/` | Database schema definitions and migration specifications |
| `/specs/testing/` | Test specifications and BDD feature files |
| `/docs/` | User-facing documentation (guides, tutorials, architecture overview) |
| `/specs/README.md` | Complete spec index and workflow guide |

## AI Agent Workflow Instructions

When you (the AI) are asked to develop a new feature, modify existing functionality, or fix a bug, **you MUST strictly follow this workflow without skipping any steps**:

### Step 1: Review Specs (审查与分析)

- First, read the relevant specs in `/specs/` directory (product requirements, RFCs, API definitions)
- If the user's request conflicts with existing specs, **stop immediately** and point out the conflict, asking whether the spec should be updated first
- **Never write code before understanding the spec context**

### Step 2: Spec-First Update (规范优先)

- If this is a new feature, or requires changing existing interfaces/database structures, **you MUST first propose modifying or creating the corresponding spec documents** (e.g., RFC, API spec, DB schema)
- Wait for user confirmation of spec changes before entering the code implementation phase
- Ensure spec documents are clear, complete, and unambiguous

### Step 3: Code Implementation (代码实现)

- When writing code, **100% comply with spec definitions** (including variable naming, API paths, data types, status codes, etc.)
- **Do NOT add features not defined in specs** (No Gold-Plating)
- Follow code style conventions defined in the project (see Code Style section below)

### Step 4: Test Verification (测试验证)

- Write unit tests and integration tests based on the acceptance criteria in `/specs/`
- Ensure test cases cover all boundary conditions described in the specs
- Run `go test ./...` and `npm --prefix frontend run test` to verify

## Code Generation Rules

- Any changes to externally exposed APIs **must** synchronously modify the corresponding spec in `/specs/api/`
- When uncertain about technical details, consult the architecture conventions in `/specs/rfc/` — do not fabricate design patterns
- All implementations must have corresponding spec references

## Project Positioning

This repository is primarily for **personal practice and teaching demonstrations**, not for production deployment priorities. When submitting changes, prioritize:

- Documentation and code behavior consistency
- Clear local execution paths
- Tests and builds passing directly
- Simple, understandable design for teaching purposes

**Avoid introducing complexity beyond current project goals** just to "appear more engineered."

## Build, Test & Development Commands

| Command | Purpose |
|---------|---------|
| `docker compose up -d postgres` | Start PostgreSQL 16 service |
| `go run ./cmd/server` | Run backend API / WebSocket service |
| `go build ./cmd/server` | Build backend binary |
| `go test -race ./...` | Run all Go tests (requires PostgreSQL) |
| `npm --prefix frontend run test` | Run frontend unit tests |
| `npm --prefix frontend run build` | Build React frontend |
| `make lint` | Run Go linter (golangci-lint) |
| `make all` | Run lint + test + build (Go only) |

## Code Style & Naming Conventions

### Go Code

- Format with `gofmt ./...`
- Run `goimports -w -local chatroom .` for import organization
- Use tabs for indentation
- Package names: short, lowercase, matching directory names
- Exports: `CamelCase`, internals: `camelCase`
- JSON tags: `snake_case` to match API payloads
- Shared DTOs in `internal/models`, configuration structs in `internal/config`
- Table-driven tests preferred, test package same as tested package (e.g., `package ws`)

### Frontend Code

- 2-space indent, Prettier configured
- Config: semi, single quotes, trailing comma es5, 100 print width
- Kebab-case filenames, PascalCase component names
- React components in `frontend/src`, static fallback in `web/`
- TypeScript strict mode enabled

### Commit Messages

- Use imperative mood, ~50 character title
- Supplementary body explains context, impact, verification
- Use `Refs #123` for related issues

## Test Conventions

- Prefer table-driven tests with same package name as tested code
- Database tests should be low-dependency and locally runnable
- WebSocket tests should cover broadcasting, online count, and room isolation
- Before submission, confirm: `go test ./...`, `npm --prefix frontend run test`, `npm --prefix frontend run build` pass
- If intentionally leaving test gaps, document reasons in commit message

## Submission & Pull Request Guidelines

- Use imperative commit titles, ~50 chars
- Pull Requests should include: change background, test evidence, manual verification steps, and impact on docs/config/release
- Link related issues with `Refs #123`
- Reference spec documents when applicable

## Security & Configuration

- Runtime configuration read from `internal/config`, overridable via environment variables:
  - `APP_PORT`, `DATABASE_DSN`, `JWT_SECRET`, `APP_ENV`
  - `ACCESS_TOKEN_TTL_MINUTES`, `REFRESH_TOKEN_TTL_DAYS`
  - `LOG_LEVEL`, `LOG_FORMAT`
- **Never commit real secrets**; teaching environments can use defaults, but production should explicitly set `JWT_SECRET`
- Logs controlled via `LOG_LEVEL` (trace/debug/info/warn/error/fatal) and `LOG_FORMAT` (console/json)
- Avoid logging sensitive user input directly in WebSocket or auth logic

## Related Documents

| Document | Purpose |
|----------|---------|
| [CLAUDE.md](CLAUDE.md) | Claude Code-specific guidance |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [specs/README.md](specs/README.md) | Spec index and templates |
