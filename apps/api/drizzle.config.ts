// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from './src/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './node_modules/@local/shared/dist/schema/core.js',
  out: './src/db',
  dbCredentials: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: false
  }
})
