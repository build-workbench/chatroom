# RFC: Code Quality Standards

> **Status**: implemented
> **Created**: 2026-03-08
> **Updated**: 2026-04-17
> **Related**: [Open Source Standards](../product/open-source-standards.md) (R3)

This RFC defines the code quality standards and tooling configuration for the ChatRoom project.

---

## Overview

Consistent code quality ensures maintainability, readability, and professionalism across the codebase.

---

## Go Code Standards

### Linter Configuration

**Tool**: golangci-lint (`.golangci.yml`)

**Enabled Linters**:

| Linter | Purpose |
|--------|---------|
| `errcheck` | Detect unchecked errors |
| `gosimple` | Suggest code simplifications |
| `govet` | Go vet checks |
| `ineffassign` | Detect ineffective assignments |
| `staticcheck` | Advanced static analysis |
| `unused` | Detect unused code |
| `gofmt` | Enforce formatting |
| `goimports` | Import organization |
| `misspell` | Spelling checks |
| `gosec` | Security checks |

### Formatting Standards

- **Formatter**: `gofmt` (mandatory)
- **Import ordering**: `goimports -w -local chatroom .`
- **Indentation**: Tabs (Go standard)
- **Line length**: No hard limit, but keep lines reasonable (<120 chars)

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Packages | lowercase, short | `ws`, `auth`, `db` |
| Exported types | CamelCase | `Hub`, `Client`, `Message` |
| Unexported types | camelCase | `connectionPool` |
| Exported functions | CamelCase | `NewHub()`, `Broadcast()` |
| Unexported functions | camelCase | `sendMessage()` |
| Constants | CamelCase or UPPER_SNAKE_CASE | `MaxMessageSize`, `DEFAULT_TIMEOUT` |
| JSON tags | snake_case | `user_name`, `created_at` |

### Test Standards

- **Package naming**: Same as tested package (`package ws`)
- **Test style**: Table-driven tests
- **Naming pattern**: `Test<Function>_<Scenario>_<Expected>`
- **Integration tests**: `TestIntegration_<Feature>_<Scenario>`

---

## Frontend Code Standards

### Linter Configuration

**Tools**: ESLint + Prettier

**Prettier Configuration** (`.prettierrc`):

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

### Formatting Standards

- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Trailing commas**: ES5 style
- **Line length**: 100 characters

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ChatRoom`, `MessageList` |
| Files (components) | PascalCase | `ChatRoom.tsx` |
| Files (utilities) | kebab-case | `format-date.ts` |
| Functions | camelCase | `formatMessage()`, `useWebSocket()` |
| Constants | UPPER_SNAKE_CASE | `MAX_MESSAGE_LENGTH` |
| Types/Interfaces | PascalCase | `Message`, `UserContext` |

---

## Editor Configuration

**File**: `.editorconfig`

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.go]
indent_style = tab
indent_size = 4

[Makefile]
indent_style = tab
```

---

## Quality Gates

### Pre-commit Checks

| Check | Command | Enforcement |
|-------|---------|-------------|
| Go formatting | `gofmt -l .` | CI blocks merge |
| Go linting | `golangci-lint run` | CI blocks merge |
| Frontend linting | `npm --prefix frontend run lint` | CI blocks merge |
| Go tests | `go test -race ./...` | CI blocks merge |
| Frontend tests | `npm --prefix frontend run test` | CI blocks merge |

### Correctness Properties

1. **Formatting Consistency**: `gofmt -d` produces no output on any `.go` file
2. **Linter Compliance**: `golangci-lint run` produces no errors or warnings
3. **Exported Function Coverage**: Every exported function in `internal/` has at least one test case

---

## Makefile Targets

| Target | Purpose |
|--------|---------|
| `make lint` | Run all linters |
| `make fmt` | Format all code |
| `make test` | Run all tests |
| `make build` | Build backend binary |
| `make all` | Run lint + test + build |

---

## Change History

| Date | Change |
|------|--------|
| 2026-03-08 | Initial code quality standards documented (Chinese) |
| 2026-04-17 | Migrated to SDD structure, translated to English |
