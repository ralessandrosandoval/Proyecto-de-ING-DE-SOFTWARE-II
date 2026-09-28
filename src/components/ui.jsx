import { useId } from 'react'

export function Button({ children, variant = 'primary', loading = false, disabled, type = 'button', ...props }) {
  return (
    <button type={type} className={`btn btn-${variant}`} disabled={loading || disabled} {...props}>
      {loading ? 'Cargando…' : children}
    </button>
  )
}

export function Input({ label, multiline = false, children, ...props }) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id} className="label">{label}</label>
      {multiline ? (
        <textarea id={id} className="input" rows={3} {...props} />
      ) : children ? (
        <select id={id} className="input" {...props}>{children}</select>
      ) : (
        <input id={id} className="input" {...props} />
      )}
    </div>
  )
}

export function ErrorBox({ message }) {
  if (!message) return null
  return <div className="error-box" role="alert">{message}</div>
}

export function Avatar({ name = '', src, size = 40 }) {
  const initials = name.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  const style = { width: size, height: size, fontSize: size * 0.36 }
  if (src) return <img className="avatar" style={style} src={src} alt={name} />
  return <div className="avatar" style={style}>{initials || '?'}</div>
}

export function Spinner() {
  return <p className="center-text muted">Cargando…</p>
}
