# Project Specifications

This directory contains all project specifications, serving as the **Single Source of Truth** for product requirements, technical designs, API definitions, database schemas, and test specifications.

---

## Directory Structure

```
specs/
├── product/            # Product requirements and feature definitions (PRDs)
├── rfc/                # Technical design documents and architecture RFCs
├── api/                # API specifications (OpenAPI, GraphQL schemas)
├── db/                 # Database schema definitions and migration specs
└── testing/            # BDD test specifications and acceptance criteria
```

---

## Specification Modules

### Open Source Excellence (v0.2.0)

Migrated from `.kiro/specs/open-source-excellence/`. This spec defined the requirements for elevating ChatRoom from a teaching demo to a production-ready open-source project.

**Core Domains**:

| Domain | Status | Spec Location |
|--------|--------|---------------|
| Open Source Standards | ✅ Complete | [product/open-source-standards.md](./product/open-source-standards.md) |
| Project Documentation | ✅ Complete | [product/open-source-standards.md](./product/open-source-standards.md) |
| Code Quality | ✅ Complete | [rfc/code-quality-standards.md](./rfc/code-quality-standards.md) |
| Test Coverage | ✅ Complete | [testing/README.md](./testing/README.md) |
| CI/CD Pipeline | ✅ Complete | [rfc/cicd-architecture.md](./rfc/cicd-architecture.md) |
| Containerization | ✅ Complete | [rfc/containerization-spec.md](./rfc/containerization-spec.md) |
| Version Management | ✅ Complete | [rfc/versioning-strategy.md](./rfc/versioning-strategy.md) |
| Frontend Engineering | ✅ Complete | [rfc/frontend-engineering.md](./rfc/frontend-engineering.md) |
| Security Practices | ✅ Complete | [rfc/security-standards.md](./rfc/security-standards.md) |
| Observability | ✅ Complete | [rfc/observability-spec.md](./rfc/observability-spec.md) |

---

## Specification Types

### Product Specs (`product/`)

Define **what** the product should do:
- User stories and acceptance criteria
- Feature requirements
- Business logic specifications
- Priority and scope definition

### RFCs (`rfc/`)

Define **how** the product will be built:
- Architecture decisions
- Technical design proposals
- Implementation strategies
- Trade-off analysis

### API Specs (`api/`)

Define **interfaces** for external consumption:
- OpenAPI/Swagger definitions
- API versioning strategy
- Endpoint documentation
- Request/response schemas

### DB Specs (`db/`)

Define **data models** and schemas:
- Database schema definitions
- Migration specifications
- Data dictionary
- Indexing strategy

### Testing Specs (`testing/`)

Define **quality gates** and validation:
- BDD feature files
- Acceptance criteria
- Test coverage requirements
- Integration test specifications

---

## Spec Lifecycle

### Creating a New Spec

1. Determine the spec type (product, rfc, api, db, testing)
2. Create a new markdown file in the appropriate subdirectory
3. Use the spec template (see below)
4. Reference the spec in this README
5. Link related specs using cross-references

### Spec Template

```markdown
# Spec Title: Short Description

> **Status**: draft | approved | implemented | deprecated
> **Author**: @username
> **Created**: YYYY-MM-DD
> **Updated**: YYYY-MM-DD

## Overview

Brief description of the spec and its purpose.

## Requirements

### Requirement 1: Title

**User Story**: As a [role], I want [feature], so that [benefit].

**Acceptance Criteria**:

| ID | Criteria |
|----|----------|
| 1.1 | The system **must** [specific behavior] |

**Status**: draft | approved | implemented

## Technical Design

(For RFCs) Architecture, components, data models, etc.

## Implementation Notes

Tasks, dependencies, and verification steps.

## Change History

| Date | Change |
|------|--------|
| YYYY-MM-DD | Initial spec creation |
```

### Updating a Spec

- **Requirements changes**: Update the relevant requirement section
- **Design adjustments**: Modify the RFC technical design
- **Status progression**: Move from `draft` → `approved` → `implemented`

### Deprecating a Spec

1. Mark status as `deprecated`
2. Add deprecation reason
3. Reference the replacement spec (if applicable)
4. Keep the file for historical reference

---

## Relationship to Other Documentation

| Location | Purpose |
|----------|---------|
| `/specs/` | **Technical specs** (design, requirements, API, DB, tests) |
| `/docs/` | **User documentation** (guides, tutorials, architecture overview) |
| `AGENTS.md` | AI assistant workflow and development conventions |
| `CLAUDE.md` | Claude Code-specific guidance and build commands |
| `CHANGELOG.md` | Version-level change history |

---

## Usage Guidelines

### For Contributors

1. **Before implementing**: Read relevant specs to understand requirements
2. **Before modifying**: Propose spec changes first, then implement
3. **After implementing**: Update spec status to `implemented`
4. **When in doubt**: Check specs before making design decisions

### For AI Assistants

Follow the **Spec-Driven Development** workflow defined in `AGENTS.md`:
1. **Review** existing specs before writing code
2. **Update** specs first when requirements change
3. **Implement** code according to specs (no gold-plating)
4. **Verify** tests against spec acceptance criteria

### Verifying Spec Compliance

```bash
# Check all requirements have implementations
grep -r "must\|should\|required" specs/product/

# Check spec completion status
grep -r "\*\*Status\*\*:" specs/

# Verify API endpoints match OpenAPI spec
diff <(grep "router\." cmd/server/main.go | sort) <(grep "path:" specs/api/openapi.yaml | sort)
```

---
