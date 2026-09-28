import { useState } from 'react'
import * as api from '../services/api'
import { AuthContext } from './auth-context'

// Cuando exista el backend, guarda aquí el JWT en lugar del usuario completo.
const SESSION_KEY = 'liftup_session'

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  // Sesión persistente (HU-002, escenario 3): se lee al abrir la app
  const [user, setUser] = useState(readSession)

  const persist = (next) => {
    setUser(next)
    if (next) localStorage.setItem(SESSION_KEY, JSON.stringify(next))
    else localStorage.removeItem(SESSION_KEY)
  }

  const value = {
    user,
    signIn: async (email, password) => persist(await api.login(email, password)),
    signUp: async (name, email, password) => persist(await api.register(name, email, password)),
    signOut: () => persist(null), // HU-003
    updateProfile: async (data) => persist(await api.updateProfile(user.id, data)),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
