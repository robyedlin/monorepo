import { customAlphabet } from 'nanoid'

export function makeNanoId(length: number = 16) {
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const nanoid = customAlphabet(alphabet, length)
  return nanoid()
}

export const makeOtp = (expiresInMinutes = 10) => {
  // Exclude characters that could be confused with each other
  // L is reserved for test user code
  const CODE_CHARACTERS = '123456789ABCDEFGHJKMNPQRSTUVWXYZ'
  const includedCodeChars = CODE_CHARACTERS
  const codeCharCount = 6
  const randomId = customAlphabet(includedCodeChars, codeCharCount)
  const otpCode = randomId()

  const now = new Date()
  const expiresAt = new Date(
    now.setMinutes(now.getMinutes() + expiresInMinutes)
  )

  return {
    otpCode,
    expiresAt,
    expiresInMinutes
  }
}
