import { eq, sql } from 'drizzle-orm'
import { jwt, otp, user, normalizeEmail } from '@packages/shared'

import { db } from '../../db'

export const createOtp = async (
  authorizedUserId: string,
  expiresAt: Date,
  code: string
) => {
  const [result] = await db
    .insert(otp)
    .values({
      userId: authorizedUserId,
      expiresAt,
      code
    })
    .returning()

  return result
}

export const findValidOtpByCode = async (code: string, date: Date) => {
  const result = await db.query.otp.findFirst({
    where: (otp, { eq, and, isNull, gte }) => {
      return and(
        eq(otp.code, code),
        isNull(otp.usedAt),
        gte(otp.expiresAt, date)
      )
    }
  })

  return result
}

export const deactivateOtpByCode = async (otpId: number, date: Date) => {
  const [result] = await db
    .update(otp)
    .set({
      usedAt: date
    })
    .where(eq(otp.id, otpId))
    .returning()

  return result
}

export const findActiveUserByEmail = async (email: string) => {
  const result = await db.query.user.findFirst({
    where: (table, { and, eq, isNull }) => {
      return and(
        eq(table.email, normalizeEmail(email)),
        isNull(table.deactivatedAt)
      )
    }
  })

  return result
}

export const signInUser = async (authorizedUserId: string) => {
  const [result] = await db
    .update(user)
    .set({
      lastSignedInAt: new Date(),
      signInCount: sql`${user.signInCount} + 1`
    })
    .where(eq(user.id, authorizedUserId))
    .returning({
      id: user.id
    })
  return result
}

export const createJwtsByUserId = async (
  authorizedUserId: string,
  jtis: string[]
) => {
  const data = jtis.map((jti) => ({
    jti,
    userId: authorizedUserId
  }))
  const result = await db.insert(jwt).values(data).returning()

  return result
}
