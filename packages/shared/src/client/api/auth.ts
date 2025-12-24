import { useMutation } from '@tanstack/react-query'
import type { AuthOtpCreateInput, AuthSignInCreateInput } from '../../schema'

import { http } from '../utils/http'

export const fetchAuthOtp = async (input: AuthOtpCreateInput) => {
  const res = await http.post(`/auth/otp`, input)
  return res.data
}
export const useFetchAuthOtp = () => {
  return useMutation({
    mutationFn: (input: AuthOtpCreateInput) => fetchAuthOtp(input)
  })
}

export const authSignIn = async (input: AuthSignInCreateInput) => {
  const res = await http.post<AuthSignInCreateInput>(`/auth/sign-in`, input)
  return res.data
}
export const useAuthSignIn = () => {
  return useMutation({
    mutationFn: (input: AuthSignInCreateInput) => authSignIn(input)
  })
}

export const authSignOut = async () => {
  const res = await http.post(`/auth/sign-out`)
  return res.data
}
export const useAuthSignOut = () => {
  return useMutation({
    mutationFn: () => authSignOut()
  })
}
