# Typescript Monorepo

A TypeScript monorepo using npm workspaces.

## Structure

- `apps/api` - API application
- `apps/web` - Web application
- `packages/shared` - Shared code

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

- `@apps/shared` - Shared package
- `@packages/api` - API application
- `@packages/web` - Web application
