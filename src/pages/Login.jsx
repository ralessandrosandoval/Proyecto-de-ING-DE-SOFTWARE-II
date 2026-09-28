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
    <div className="shell auth">
      <div className="brand"><span className="brand-logo">LU</span><div><strong>LiftUp</strong><div className="muted small">Red social fitness</div></div></div>
      <h1>Bienvenido de vuelta</h1>
      <p className="muted">Inicia sesión para continuar tu progreso</p>
      <form onSubmit={submit} noValidate>
        <Input label="Correo electrónico" type="email" placeholder="tu@correo.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Contraseña" type="password" placeholder="••••••••" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <ErrorBox message={error} />
        <Button type="submit" loading={loading}>Iniciar sesión</Button>
      </form>
      <p className="center-text muted">¿No tienes cuenta? <Link to="/register"><strong>Regístrate →</strong></Link></p>
    </div>
  )
}
