# Pathway Monorepo

A TypeScript monorepo using npm workspaces.

## Structure

- `apps/api` - API application
- `packages/types` - Shared types
- `packages/utils` - Shared utilities and common code
- `packages/schema` - Shared schema

## Getting Started

Install dependencies:

```bash
npm install
```

Build all packages:

```bash
npm run build
```

Run in development mode (watch mode):

```bash
npm run dev
```

## Workspaces

- `@pathway/shared` - Shared package
- `@pathway/api` - API application
