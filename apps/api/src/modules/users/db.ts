import { normalizeEmail, user } from '@local/shared'
import { and, eq } from 'drizzle-orm'
import { db } from 'src/db'

export const findUser = async (authorizedUserId: string) => {
  const result = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, authorizedUserId)
  })
  return result
}

export const createUser = async (data: typeof user.$inferInsert) => {
  if (data.email) {
    data.email = normalizeEmail(data.email)
  }
  const [result] = await db
    .insert(user)
    .values({
      ...data
    })
    .returning()
  return result
}

export const updateUser = async (
  authorizedUserId: string,
  data: Partial<typeof user.$inferInsert>
) => {
  const existingUser = await findUser(authorizedUserId)
  if (!existingUser) return

  if (data.email) {
    data.email = normalizeEmail(data.email)
  }
  const now = new Date()

  const [result] = await db
    .update(user)
    .set({ ...data, updatedAt: now })
    .where(and(eq(user.id, authorizedUserId)))
    .returning()

  return result
}
