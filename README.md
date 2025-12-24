# Typescript Monorepo

A TypeScript monorepo using npm workspaces.

## Structure

- `apps/api` - API application
- `apps/native` - Native application
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

- `@packages/shared` - Shared package
- `@apps/api` - API application
- `@apps/native` - Native application
- `@apps/web` - Web application
