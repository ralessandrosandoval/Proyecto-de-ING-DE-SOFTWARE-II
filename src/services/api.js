// ─────────────────────────────────────────────────────────────────────────────
// Servicio MOCK: funciona sin backend guardando todo en localStorage.
// Cuando el backend (Node + Express + MySQL) esté listo, reemplaza el cuerpo de
// cada función por un fetch(`${API_URL}/...`) manteniendo las mismas firmas y
// los mismos mensajes de error, y las pantallas no necesitan cambios.
// ─────────────────────────────────────────────────────────────────────────────
export const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3000'

const DB_KEY = 'liftup_db'
const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms))

function seed() {
  const now = Date.now()
  return {
    users: [],
    posts: [
      {
        id: 'demo-1', authorId: 'demo-1', authorName: 'Carlos M.', authorLevel: 'Avanzado',
        createdAt: now - 2 * 3600e3, media: null, mediaType: null,
        exercise: 'Press banca', weight: '100', sets: '5', reps: '5',
        description: 'Gran sesión hoy! #powerlifting #liftup', reactions: 24, comments: 8,
      },
      {
        id: 'demo-2', authorId: 'demo-2', authorName: 'María R.', authorLevel: 'Sin experiencia',
        createdAt: now - 4 * 3600e3, media: null, mediaType: null,
        exercise: 'Sentadilla goblet', weight: '12', sets: '3', reps: '12',
        description: 'Semana 3. Sintiéndome cada vez más fuerte!', reactions: 18, comments: 5,
      },
    ],
  }
}

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* datos corruptos: se reinicia */ }
  return seed()
}

function saveDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  } catch {
    throw new Error('No se pudo guardar. Inténtalo de nuevo.')
  }
}

function safeUser(user) {
  const copy = { ...user }
  delete copy.password
  return copy
}
const byDateDesc = (a, b) => b.createdAt - a.createdAt

// ── Auth (HU-001, HU-002) ────────────────────────────────────────────────────
export async function register(name, email, password) {
  await wait()
  const db = loadDb()
  const mail = email.trim().toLowerCase()
  if (db.users.some((u) => u.email === mail)) throw new Error('Este correo ya está registrado')
  const user = {
    id: String(Date.now()), name: name.trim(), email: mail, password,
    bio: '', level: 'Sin experiencia', avatar: null,
  }
  db.users.push(user)
  saveDb(db)
  return safeUser(user)
}

export async function login(email, password) {
  await wait()
  const db = loadDb()
  const mail = email.trim().toLowerCase()
  const user = db.users.find((u) => u.email === mail && u.password === password)
  if (!user) throw new Error('Usuario o contraseña incorrectos')
  return safeUser(user)
}

// ── Perfil (HU-004) ──────────────────────────────────────────────────────────
export async function updateProfile(userId, data) {
  await wait()
  const db = loadDb()
  const user = db.users.find((u) => u.id === userId)
  if (!user) throw new Error('Usuario no encontrado')
  Object.assign(user, data)
  // mantiene sincronizados los datos del autor en sus publicaciones
  db.posts.forEach((p) => {
    if (p.authorId === userId) {
      p.authorName = user.name
      p.authorLevel = user.level
      p.authorAvatar = user.avatar
    }
  })
  saveDb(db)
  return safeUser(user)
}

// ── Publicaciones (HU-005) y feed (HU-006) ───────────────────────────────────
export async function getFeed() {
  await wait(350)
  return loadDb().posts.sort(byDateDesc)
}

export async function getPostsByUser(userId) {
  await wait(250)
  return loadDb().posts.filter((p) => p.authorId === userId).sort(byDateDesc)
}

export async function getPost(id) {
  await wait(250)
  const post = loadDb().posts.find((p) => p.id === id)
  if (!post) throw new Error('La publicación no existe')
  return post
}

export async function createPost(user, data) {
  await wait()
  const db = loadDb()
  const post = {
    id: String(Date.now()), authorId: user.id, authorName: user.name,
    authorLevel: user.level, authorAvatar: user.avatar ?? null,
    createdAt: Date.now(), reactions: 0, comments: 0, ...data,
  }
  db.posts.push(post)
  saveDb(db)
  return post
}

export async function updatePost(userId, id, data) {
  await wait()
  const db = loadDb()
  const post = db.posts.find((p) => p.id === id)
  if (!post) throw new Error('La publicación no existe')
  if (post.authorId !== userId) throw new Error('No puedes editar esta publicación')
  Object.assign(post, data)
  saveDb(db)
  return post
}

export async function deletePost(userId, id) {
  await wait()
  const db = loadDb()
  const post = db.posts.find((p) => p.id === id)
  if (!post) throw new Error('La publicación no existe')
  if (post.authorId !== userId) throw new Error('No puedes eliminar esta publicación')
  db.posts = db.posts.filter((p) => p.id !== id)
  saveDb(db)
}
