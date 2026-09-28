import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import PostCard from '../components/PostCard'
import { Button, ErrorBox, Spinner } from '../components/ui'
import { getFeed } from '../services/api'

// HU-006: feed ordenado por fecha (desc), actualizar y estado vacío
export default function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    getFeed()
      .then((data) => {
        setPosts(data)
        setError('')
      })
      .catch(() => setError('No se pudo cargar el feed'))
      .finally(() => setLoading(false))
  }, [reloadKey])

  const refresh = () => {
    setLoading(true)
    setReloadKey((k) => k + 1)
  }

  return (
    <>
      <PageHeader title="LiftUp" action={<Button variant="outline" onClick={refresh} disabled={loading}>Actualizar</Button>} />
      <ErrorBox message={error} />
      {loading ? <Spinner /> : posts.length === 0 ? (
        <p className="center-text muted">No hay publicaciones aún en la plataforma</p>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </>
  )
}
