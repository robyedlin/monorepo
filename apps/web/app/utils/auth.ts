import axios from 'axios'

import ENV from '../env'

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true
})

export const setInterceptors = (signOut: () => void) => {
  const responseInterceptors = http.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const response = error.response
      if (response?.status === 401) {
        try {
          // use a new axios instance to avoid infinite recursion
          await axios.post(`${ENV.API_BASE_URL}/auth/sign-in/refresh`, null, {
            withCredentials: true
          })
          try {
            const retriedResponse = await axios.request(response.config)
            if (retriedResponse.status === 401) {
              signOut()
            }
            return retriedResponse
          } catch {
            signOut()
          }
        } catch {
          signOut()
        }
      }
      return Promise.reject(error)
    }
  )

  return responseInterceptors
}
