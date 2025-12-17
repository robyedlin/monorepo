import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema
} from 'drizzle-zod'
import { user } from '../core'
import z from 'zod/v4'

const EmailSchema = z.email().trim().toLowerCase()

export const UserSelectSchema = createSelectSchema(user).partial()

export const UserCreateSchema = createInsertSchema(user, {
  email: EmailSchema
})

export const UserUpdateSchema = createUpdateSchema(user, {
  email: EmailSchema.optional()
})
export const UserUpdateParamsSchema = UserUpdateSchema.pick({
  id: true
})

export const UserDeleteParamsSchema = createSelectSchema(user).pick({
  id: true
})

export type UserResult = z.infer<typeof UserSelectSchema>

export type UserCreateInput = z.infer<typeof UserCreateSchema>
export type UserCreateResult = z.infer<typeof UserSelectSchema>

export type UserUpdateParams = z.infer<typeof UserUpdateParamsSchema>
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>
export type UserUpdateResult = z.infer<typeof UserSelectSchema>

export type UserDeleteParams = z.infer<typeof UserUpdateParamsSchema>
export type UserDeleteResult = z.infer<typeof UserSelectSchema>
