# Pathway Monorepo

A TypeScript monorepo using npm workspaces.

## Structure

- `apps/api` - API application
- `packages/shared` - Shared utilities and common code

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
