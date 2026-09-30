import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, ErrorBox, Input } from '../components/ui'
import { useAuth } from '../hooks/useAuth'

// HU-002
export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return setError('Completa correo y contraseña')
    setError('')
    setLoading(true)
    try {
      await signIn(email, password) // al iniciar sesión, PublicOnlyRoute redirige al feed
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (

  )
}
