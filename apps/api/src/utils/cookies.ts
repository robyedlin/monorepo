import { Response } from 'express'
import { COOKIE_DOMAIN, NODE_ENV } from '../env'

export function setCookie(res: Response, name: string, value: string) {
  const maxAge = 60 * 1000 * 60 * 24 * 365 // 1 year
  res.cookie(name, value, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge,
    domain: NODE_ENV === 'production' ? COOKIE_DOMAIN : 'localhost'
  })
}
