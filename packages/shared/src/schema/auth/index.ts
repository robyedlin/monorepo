import { createInsertSchema } from 'drizzle-zod'
import { user, otp } from '../core'
import { z } from 'zod/v4'

export const AuthOtpCreateSchema = createInsertSchema(user)
  .pick({
    email: true
  })
  .extend({
    isAdmin: z.boolean().optional()
  })
export const AuthSignInCreateInputSchema = createInsertSchema(otp).pick({
  code: true
})

export type AuthOtpCreateInput = z.infer<typeof AuthOtpCreateSchema>
export type AuthSignInCreateInput = z.infer<typeof AuthSignInCreateInputSchema>
