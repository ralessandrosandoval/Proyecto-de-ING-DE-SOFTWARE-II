import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, ErrorBox, Input } from '../components/ui'
import { EMAIL_RE } from '../constants'
import { useAuth } from '../hooks/useAuth'

// HU-001
export default function Register() {
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('El nombre no puede estar vacío')
    if (!EMAIL_RE.test(email.trim())) return setError('Formato de correo inválido')
    if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres')
    setError('')
    setLoading(true)
    try {
      await signUp(name, email, password)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="shell auth">
      <h1>Crea tu cuenta</h1>
      <p className="muted">Un espacio sin juicios para crecer contigo mismo</p>
      <form onSubmit={submit} noValidate>
        <Input label="Nombre" placeholder="Tu nombre" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Correo electrónico" type="email" placeholder="tu@correo.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <ErrorBox message={error} />
        <Button type="submit" loading={loading}>Registrarme</Button>
      </form>
      <p className="center-text muted">¿Ya tienes cuenta? <Link to="/login"><strong>Inicia sesión →</strong></Link></p>
    </div>
  )
}
