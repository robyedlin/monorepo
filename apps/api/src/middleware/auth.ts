import type { NextFunction, Request, Response } from 'express'
import JWT, { JwtPayload } from 'jsonwebtoken'
import { JWT_PRIVATE_KEY } from '../env'

import { ACCESS_TOKEN_COOKIE_NAME } from '@packages/shared'

import { db } from '../db'

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookieAccessToken = req?.cookies?.[ACCESS_TOKEN_COOKIE_NAME] as string
    const headerAccessToken = req?.headers?.authorization?.split(
      ' '
    )[1] as string
    // web requests should come with a cookie, api requests can come with a header
    const accessToken: string = cookieAccessToken || headerAccessToken

    if (!accessToken) {
      res.status(401).json({ message: 'JWT_ACCESS_TOKEN_MISSING' })
      return
    }

    const verifiedAccessToken = JWT.verify(
      accessToken,
      JWT_PRIVATE_KEY
    ) as JwtPayload

    if (
      !verifiedAccessToken ||
      verifiedAccessToken.tokenType !== 'ACCESS_TOKEN'
    ) {
      res.status(401).json({ message: 'JWT_ACCESS_TOKEN_UNVERIFIED' })
      return
    }

    const jwtResult = await db.query.jwt.findFirst({
      where: (table, { eq, and, isNull }) =>
        and(
          eq(table.jti, verifiedAccessToken.jti as string),
          isNull(table.revokedAt)
        )
    })
    if (!jwtResult) throw new Error('JWT_ACCESS_TOKEN_INVALID')

    const userResult = await db.query.user.findFirst({
      where: (table, { eq, and, isNull }) =>
        and(
          eq(table.id, verifiedAccessToken.userId as string),
          isNull(table.deactivatedAt)
        )
    })
    if (!userResult) throw new Error('JWT_ACCESS_TOKEN_INVALID')

    res.locals = {
      USER_ID: verifiedAccessToken.userId
    }

    next()
  } catch (e) {
    console.info(e)
    res.status(401).json({ message: 'JWT_ACCESS_TOKEN_INVALID' })
  }
}

export const authorizeAdmin = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.USER_ID

    const userResult = await db.query.admin.findFirst({
      where: (table, { eq, and }) => and(eq(table.userId, userId as string))
    })
    if (!userResult) throw new Error('JWT_ACCESS_TOKEN_INVALID')

    next()
  } catch {
    res.status(401).json({ message: 'JWT_ACCESS_TOKEN_PERMISSION_DENIED' })
  }
}
