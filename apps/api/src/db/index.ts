import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import {
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} from '../env'

import * as schema from '@local/shared/dist/schema/core.js'

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: false
})

export const db = drizzle(pool, {
  schema,
  logger: NODE_ENV !== 'production'
})
