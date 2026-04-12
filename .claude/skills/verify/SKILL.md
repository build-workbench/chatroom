---
name: verify
description: Run full verification — lint, test, and build for both Go backend and React frontend. Use after making changes to confirm everything passes.
---

# Verify

Run the full lint + test + build pipeline for both Go and frontend.

## Steps

1. **Go lint**: `golangci-lint run ./...`
2. **Go test**: `go test -race ./...` (requires running PostgreSQL)
3. **Frontend lint**: `npm --prefix frontend run lint`
4. **Frontend type-check + build**: `npm --prefix frontend run build`
5. **Frontend test**: `npm --prefix frontend run test`

Run steps 1–2 first (Go), then 3–5 (frontend). Report the results clearly: pass/fail per step, any errors or warnings. If any step fails, include the relevant error output so the user can see what needs fixing.

If PostgreSQL is not running and Go tests fail because of it, tell the user to run `docker compose up -d postgres` first.
