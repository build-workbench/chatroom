# RFC: Frontend Engineering Standards

> **Status**: implemented
> **Created**: 2026-03-08
> **Updated**: 2026-04-17
> **Related**: [Open Source Standards](../product/open-source-standards.md) (R8)

This RFC defines the frontend engineering standards and toolchain configuration.

---

## Overview

Modern frontend development setup with TypeScript, Vite, and Tailwind CSS.

---

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 7 | Build tool and dev server |
| Tailwind CSS | v4 | Utility-first CSS framework |
| ESLint | 9.x | Code linting |
| Prettier | 3.x | Code formatting |
| Vitest | 2.x | Unit testing |

---

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/             # Page-level components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API client, WebSocket service
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── context/           # React context providers
│   └── App.tsx            # Root component
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Vitest configuration
├── .eslintrc.json         # ESLint configuration
└── .prettierrc            # Prettier configuration
```

---

## Build Configuration

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
      '/ws': {
        target: 'http://localhost:8080',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### Important Notes

- **Tailwind CSS v4**: Uses `@tailwindcss/vite` plugin, NOT PostCSS
- **Do NOT add**: `tailwind.config.js` or PostCSS Tailwind plugins
- **Proxy setup**: Frontend dev server proxies `/api` and `/ws` to Go backend

---

## TypeScript Configuration

### Strict Mode Enabled

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx"
  }
}
```

### Type Definitions

All API responses, WebSocket messages, and application state must have explicit TypeScript types:

```typescript
// types/message.ts
export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}
```

---

## Testing Strategy

### Test Framework: Vitest

**Configuration**: `vitest.config.ts`

### Test Coverage

| Test Type | Target | Location |
|-----------|--------|----------|
| Unit tests | Utility functions | `src/utils/*.test.ts` |
| Component tests | React components | `src/components/*.test.tsx` |
| Integration tests | API client, WebSocket | `src/services/*.test.ts` |

### Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from './format-date';

describe('formatDate', () => {
  it('formats ISO date to locale string', () => {
    expect(formatDate('2026-04-17T10:30:00Z')).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});
```

---

## Code Style

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ChatRoom.tsx`, `MessageList.tsx` |
| Utilities | kebab-case | `format-date.ts`, `api-client.ts` |
| Tests | `.test.ts` suffix | `format-date.test.ts` |
| Types | kebab-case | `message-types.ts` |

### Component Structure

```typescript
import React from 'react';
import { useMessage } from '../hooks/use-message';

interface MessageListProps {
  roomId: string;
}

export function MessageList({ roomId }: MessageListProps) {
  const { messages } = useMessage(roomId);

  return (
    <ul>
      {messages.map((msg) => (
        <li key={msg.id}>{msg.content}</li>
      ))}
    </ul>
  );
}
```

---

## NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start dev server |
| `build` | `tsc && vite build` | Type-check and build |
| `preview` | `vite preview` | Preview production build |
| `test` | `vitest` | Run tests |
| `test:coverage` | `vitest --coverage` | Run tests with coverage |
| `lint` | `eslint src --ext .ts,.tsx` | Lint code |
| `format` | `prettier --write src` | Format code |

---

## CI Integration

Frontend checks run on every commit:

```yaml
- name: Frontend checks
  run: |
    npm --prefix frontend ci
    npm --prefix frontend run lint
    npm --prefix frontend run test
    npm --prefix frontend run build
```

---

## Change History

| Date | Change |
|------|--------|
| 2026-03-08 | Initial frontend engineering standards documented (Chinese) |
| 2026-04-17 | Migrated to SDD structure, translated to English |
