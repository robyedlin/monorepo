import { useState } from 'react'
import { useNavigate } from 'react-router'

import { fetchAuthOtp } from '../../api/auth'

export default function AuthSignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  return (
    <form
      onSubmit={async () => {
        try {
          await fetchAuthOtp({
            email,
            isAdmin: true
          })
          navigate('/auth/sign-in-code')
        } catch {
          window.alert('Something went wrong getting a sign in code')
        }
      }}
    >
      <input
        type="text"
        className="border"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" onClick={() => {}}>
        Send me a code
      </button>
    </form>
  )
}
