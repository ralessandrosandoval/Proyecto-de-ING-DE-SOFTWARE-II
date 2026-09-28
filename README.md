# LiftUp – Frontend (React + Vite)

Frontend del proyecto **Lift Up: Red Social Fitness Inclusiva** (Ingeniería de Software – Universidad de Lima).
El diseño sigue los mockups del Sprint 1 y el layout está pensado "mobile-first" (columna de 480px centrada).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:5173. Por ahora funciona **sin backend**: `src/services/api.js` es un mock que guarda todo en `localStorage`.

## Historias de usuario implementadas (Sprint 1)

| HU | Pantalla | Archivo |
|----|----------|---------|
| HU-001 Registro | `/register` | `src/pages/Register.jsx` |
| HU-002 Iniciar sesión (sesión persistente) | `/login` | `src/pages/Login.jsx` |
| HU-003 Cerrar sesión | `/profile` | `src/pages/Profile.jsx` |
| HU-004 Editar perfil | `/profile/edit` | `src/pages/EditProfile.jsx` |
| HU-005 Publicar / ver / editar / eliminar sesión | `/new`, `/session/:id` | `NewSession.jsx`, `SessionDetail.jsx` |
| HU-006 Feed | `/` | `src/pages/Feed.jsx` |

## Estructura

```
src/
  components/   UI reutilizable (ui.jsx, PostCard, ConfirmModal, BottomNav, guards de rutas)
  context/      AuthContext (sesión)
  hooks/        useAuth
  pages/        una pantalla por archivo
  services/     api.js  <- aquí se conecta el backend
  utils/        helpers (fechas, imágenes)
  constants.js  niveles, formatos permitidos, regex de correo
```

## Conectar con el backend (Node + Express + MySQL)

Cada función de `src/services/api.js` tiene el endpoint equivalente del documento (`POST /auth/register`, `POST /auth/login`, ...).
Reemplaza el cuerpo por `fetch(`${API_URL}/...`)` y define `VITE_API_URL` en un archivo `.env`:

```
VITE_API_URL=http://localhost:3000
```

Cuando exista el JWT, guárdalo en `AuthContext.jsx` (`SESSION_KEY`) y envíalo en el header `Authorization`.
