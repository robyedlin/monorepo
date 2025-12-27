import jwt from 'jsonwebtoken'
import { createJwtsByUserId } from './db'
import { findUser } from '../users/db'
import { JWT_PRIVATE_KEY } from '../../env'
import { nanoid } from 'nanoid'

export const createTokens = async (userId: string) => {
  const user = await findUser(userId)
  if (!user) throw new Error('PERSON_NOT_FOUND')

  const accessToken = jwt.sign(
    {
      tokenType: 'ACCESS_TOKEN',
      userId: user.id,
      jti: nanoid()
    },
    JWT_PRIVATE_KEY,
    {
      expiresIn: '1d'
    }
  )

  const refreshToken = jwt.sign(
    {
      tokenType: 'REFRESH_TOKEN',
      userId: user.id,
      jti: nanoid()
    },
    JWT_PRIVATE_KEY,
    {
      expiresIn: '30d'
    }
  )

  type Token = {
    jti: string
  }
  const decodedAccessToken = jwt.decode(accessToken) as Token
  const decodedRefreshToken = jwt.decode(refreshToken) as Token
  // store jwt in DB
  await createJwtsByUserId(user.id, [
    decodedAccessToken.jti,
    decodedRefreshToken.jti
  ])

  return {
    accessToken,
    refreshToken
  }
}
