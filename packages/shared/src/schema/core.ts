import { relations } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  text,
  timestamp,
  serial,
  integer,
  boolean
} from 'drizzle-orm/pg-core'

const defaultTimestamp = timestamp({
  precision: 3,
  mode: 'date',
  withTimezone: true
})

export const user = pgTable('users', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  email: text().notNull(),
  createdAt: defaultTimestamp.defaultNow().notNull(),
  updatedAt: defaultTimestamp.defaultNow().notNull(),
  signInCount: integer().notNull().default(0),
  emailIsVerified: boolean().default(false),
  deactivatedAt: defaultTimestamp,
  lastSignedInAt: defaultTimestamp
})

const userReference = uuid()
  .references(() => user.id)
  .notNull()

export const admin = pgTable('admins', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: userReference
})

export const jwt = pgTable('jwts', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  jti: text().notNull(),
  userId: userReference,
  createdAt: defaultTimestamp.defaultNow().notNull(),
  revokedAt: defaultTimestamp
})

export const otp = pgTable('otps', {
  id: serial().primaryKey().notNull(),
  code: text().unique().notNull(),
  usedAt: defaultTimestamp,
  userId: userReference,
  expiresAt: defaultTimestamp.notNull(),
  deletedAt: defaultTimestamp,
  createdAt: defaultTimestamp.defaultNow().notNull(),
  updatedAt: defaultTimestamp.defaultNow().notNull()
})

// Relations

export const userRelations = relations(user, ({ one }) => ({
  admin: one(admin, {
    fields: [user.id],
    references: [admin.userId]
  })
}))

export const adminRelations = relations(admin, ({ one }) => ({
  user: one(user, {
    fields: [admin.userId],
    references: [user.id]
  })
}))

export const jwtRelations = relations(jwt, ({ one }) => ({
  user: one(user, {
    fields: [jwt.userId],
    references: [user.id]
  })
}))

export const otpRelations = relations(otp, ({ one }) => ({
  user: one(user, {
    fields: [otp.userId],
    references: [user.id]
  })
}))
