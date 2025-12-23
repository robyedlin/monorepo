import { useState } from 'react'

import { authSignIn } from '../../api/auth'

import { useSessionContext } from '../../context/session'

export default function AuthSignInCode() {
  const [code, setCode] = useState('')
  const { signIn } = useSessionContext()

  return (
    <form
      onSubmit={async () => {
        try {
          await authSignIn({
            code
          })
          signIn()
        } catch {
          window.alert('Something went wrong logging in')
        }
      }}
    >
      <input
        type="text"
        className="border"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="submit" onClick={() => {}}>
        Sign in
      </button>
    </form>
  )
}
