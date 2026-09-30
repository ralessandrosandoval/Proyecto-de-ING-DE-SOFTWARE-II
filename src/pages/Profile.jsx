import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import PageHeader from '../components/PageHeader'
import PostCard from '../components/PostCard'
import { Avatar, Button } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { getPostsByUser } from '../services/api'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [confirmLogout, setConfirmLogout] = useState(false)

  useEffect(() => {
    getPostsByUser(user.id).then(setPosts).catch(() => setPosts([]))
  }, [user.id])

  return (
    <>
      <PageHeader title="Mi Perfil" />
      <section className="profile">
        <Avatar name={user.name} src={user.avatar} size={96} />
        <h2>{user.name}</h2>
        <div className="muted">Nivel: {user.level}</div>
        {user.bio && <p>{user.bio}</p>}
        <div className="col">
          <Button variant="outline" onClick={() => navigate('/profile/edit')}>Editar perfil</Button>
          <Button variant="outline" onClick={() => setConfirmLogout(true)}>Cerrar sesión</Button>
        </div>
      </section>
      <h3 className="pad">Mis sesiones ({posts.length})</h3>
      {posts.map((p) => <PostCard key={p.id} post={p} />)}
      {confirmLogout && (
        <ConfirmModal
          title="¿Cerrar sesión?"
          message="Tendrás que iniciar sesión nuevamente para acceder a tu perfil."
          onCancel={() => setConfirmLogout(false)}
          onConfirm={signOut} // HU-003: al limpiar la sesión, ProtectedRoute redirige a /login
        />
      )}
    </>
  )
}
