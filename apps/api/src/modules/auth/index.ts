import express, { Request, Response } from 'express'
import JWT from 'jsonwebtoken'
import {
  ACCESS_TOKEN_COOKIE_NAME,
  AuthOtpCreateSchema,
  AuthSignInCreateInputSchema,
  REFRESH_TOKEN_COOKIE_NAME,
  convertLineBreaksToHtml,
  makeOtp,
  type AuthOtpCreateInput,
  type AuthSignInCreateInput
} from '@packages/shared'

import {
  APP_NAME,
  WWW_ADMIN_URL,
  WWW_PUBLIC_URL,
  JWT_PRIVATE_KEY
} from '../../env'

import { setCookie } from '../../utils/cookies'
import { sendTransactionalEmail } from '../../utils/sendgrid'

import { asyncHandler } from '../../middleware/routes'

import { db } from '../../db'
import { updateUser } from '../users/db'
import {
  createOtp,
  deactivateOtpByCode,
  findValidOtpByCode,
  signInUser
} from './db'
import { findUser, findActiveUserByEmail } from '../users/db'
import { createTokens } from './utils'

const router = express.Router()

// TODO - add otp request limit within time range
router.post(
  '/otp',
  asyncHandler(
    async (req: Request<unknown, unknown, AuthOtpCreateInput>, res) => {
      const input = req.body
      const validInput = AuthOtpCreateSchema.parse(input)

      const { email, isAdmin } = validInput
      // send email with token
      try {
        // verify user exists
        const user = await findActiveUserByEmail(email)
        const WWW_URL = isAdmin ? WWW_ADMIN_URL : WWW_PUBLIC_URL

        if (user) {
          const { otpCode, expiresAt, expiresInMinutes } = makeOtp()
          // store code in DB
          const otp = await createOtp(user.id, expiresAt, otpCode)
          let text: string
          if (validInput.isAdmin) {
            text = `Copy the code below and paste into the website:\n\n${otp.code}\n\nThis code will expire in ${expiresInMinutes} minutes.\n\n- The ${APP_NAME} Team`
          } else {
            text = `You have requested a sign-in code for ${APP_NAME}.\n\nClick the link to sign in:\n\n${WWW_URL}/sign-in/otp?code=${otp.code}\n\nThis code will expire in ${expiresInMinutes} minutes.\n\nIf you were not expecting this message, we apologize for any inconvenience. Please do not click on the link, and reply to this message and let us know immediately.\n\n- The ${APP_NAME} Team`
          }
          const html = convertLineBreaksToHtml(text)
          // send email with code
          await sendTransactionalEmail({
            to: [user.email],
            subject: 'Sign in Code',
            text,
            html
          })
        } else {
          console.info(`${email} is not a user in the db. Skipping otp email`)
        }
      } catch (e) {
        console.info(e)
      }
      // IMPORTANT
      // never return the code directly in the response,
      // send code through the user's email to verify they own the email address
      res.json({})
    }
  )
)

router.post(
  '/sign-in',
  asyncHandler(
    async (
      req: Request<unknown, unknown, AuthSignInCreateInput>,
      res: Response
    ) => {
      const input = req.body
      const validInput = AuthSignInCreateInputSchema.parse(input)
      const { code } = validInput

      try {
        const now = new Date()
        const otp = await findValidOtpByCode(code, now)
        if (otp) {
          const userId = otp.userId

          /*
          const user = await findUser(userId)
          if (!user?.signedUpAt) {
            res.status(403).json()
            return
          }
          */

          await signInUser(userId)

          const { accessToken, refreshToken } = await createTokens(userId)

          await deactivateOtpByCode(otp.id, now)

          // TODO: improve this later
          // the email COULD be updated between the time the otp is sent
          // and the time the user signs in, however this is unlikely
          await updateUser(userId, {
            emailIsVerified: true
          })

          setCookie(res, ACCESS_TOKEN_COOKIE_NAME, accessToken)
          setCookie(res, REFRESH_TOKEN_COOKIE_NAME, refreshToken)

          res.json({})
        } else {
          res.status(400).json()
        }
      } catch {
        res.status(400).json()
      }
    }
  )
)

router.post(
  '/sign-in/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    // get refresh token
    const cookieRefreshToken = req?.cookies?.[
      REFRESH_TOKEN_COOKIE_NAME
    ] as string
    const headerRefreshToken = req?.headers?.authorization?.split(
      ' '
    )[1] as string
    // web requests should come with a cookie, api requests can come with a header
    const refreshToken: string = cookieRefreshToken || headerRefreshToken

    try {
      // verify refresh token
      const verifiedRefreshToken = JWT.verify(
        refreshToken,
        JWT_PRIVATE_KEY
      ) as JWT.JwtPayload

      if (verifiedRefreshToken.tokenType !== 'REFRESH_TOKEN') {
        throw new Error('Invalid token type')
      }
      // find refresh token in DB
      const jwt = await db.query.jwt.findFirst({
        where: (table, { eq, and, isNull }) =>
          and(
            eq(table.userId, verifiedRefreshToken.userId),
            isNull(table.revokedAt)
          )
      })
      if (!jwt) throw new Error('JWT_REFRESH_TOKEN_INVALID')
      // get userId from refresh token
      const user = await findUser(verifiedRefreshToken.userId)
      if (!user) throw new Error('USER_NOT_FOUND')
      // issue new access token and refresh token
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await createTokens(user.id)

      setCookie(res, ACCESS_TOKEN_COOKIE_NAME, newAccessToken)
      setCookie(res, REFRESH_TOKEN_COOKIE_NAME, newRefreshToken)

      res.json({})
    } catch (e) {
      console.info(e)
      res.status(401).json()
    }
  })
)

router.post(
  '/sign-out',
  asyncHandler(async (_: Request, res: Response) => {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)

    res.json({})
  })
)

export default router
