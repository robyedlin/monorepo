import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react'
import { useNavigate } from 'react-router'

import { authSignOut, http, setInterceptors } from '@packages/shared'

import { useAuthLocalStorage } from '../hooks/localStorage'

const AuthContext = createContext<{
  signIn: () => void
  signOut: () => void
  isSignedIn: boolean | undefined
}>({
  signIn: async () => null,
  signOut: async () => null,
  isSignedIn: undefined
})

export function useSessionContext() {
  const context = useContext(AuthContext)
  if (process.env.NODE_ENV !== 'production' && !context) {
    throw new Error(
      'useSessionContext must be wrapped in a <SessionProvider />'
    )
  }

  return context
}

export function SessionContextProvider({ children }: PropsWithChildren) {
  const [isSignedIn, setIsSignedIn] = useAuthLocalStorage('isSignedIn')
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  const signOut = async () => {
    setIsSignedIn(null)
    await authSignOut()
    navigate('/auth/sign-in')
  }

  useEffect(() => {
    const responseInterceptor = setInterceptors(signOut)
    setIsLoaded(true)

    return () => {
      http.interceptors.response.eject(responseInterceptor)
    }
  }, [])

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/auth/sign-in')
    }
  }, [isSignedIn])

  const signIn = async () => {
    setIsSignedIn(true)
    navigate('/dashboard')
  }

  return (
    isLoaded && (
      <AuthContext.Provider
        value={{
          signIn,
          signOut,
          isSignedIn
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  )
}
