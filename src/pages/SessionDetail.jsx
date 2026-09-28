import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import PageHeader from '../components/PageHeader'
import PostCard from '../components/PostCard'
import { Button, ErrorBox, Input, Spinner } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { deletePost, getPost, updatePost } from '../services/api'

// HU-005: detalle de una sesión + editar / eliminar (solo si es tuya)
export default function SessionDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [form, setForm] = useState(null)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPost(id).then(setPost).catch((err) => setError(err.message))
  }, [id])

  if (!post) return <><PageHeader title="Detalle de sesión" back />{error ? <ErrorBox message={error} /> : <Spinner />}</>

  const mine = post.authorId === user.id
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const startEdit = () => {
    setForm({ exercise: post.exercise, weight: post.weight, sets: post.sets, reps: post.reps, description: post.description })
    setEditing(true)
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.exercise.trim()) return setError('Indica el ejercicio')
    setError('')
    setLoading(true)
    try {
      setPost(await updatePost(user.id, post.id, { ...form, exercise: form.exercise.trim() }))
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const remove = async () => {
    try {
      await deletePost(user.id, post.id)
      navigate('/', { replace: true })
    } catch (err) {
      setConfirmDelete(false)
      setError(err.message)
    }
  }

  return (
    <>
      <PageHeader title={editing ? 'Editar publicación' : 'Detalle de sesión'} back />
      {editing ? (
        <form className="pad" onSubmit={save} noValidate>
          <Input label="Ejercicio" value={form.exercise} onChange={set('exercise')} />
          <div className="row">
            <Input label="Peso (kg)" type="number" min="0" value={form.weight} onChange={set('weight')} />
            <Input label="Series" type="number" min="0" value={form.sets} onChange={set('sets')} />
            <Input label="Reps" type="number" min="0" value={form.reps} onChange={set('reps')} />
          </div>
          <Input label="Descripción y hashtags" multiline value={form.description} onChange={set('description')} />
          <ErrorBox message={error} />
          <div className="row">
            <Button variant="outline" onClick={() => { setEditing(false); setError('') }}>Cancelar</Button>
            <Button type="submit" loading={loading}>Guardar cambios</Button>
          </div>
        </form>
      ) : (
        <>
          <PostCard post={post} />
          <ErrorBox message={error} />
          {mine && (
            <div className="pad col">
              <Button variant="outline" onClick={startEdit}>Editar publicación</Button>
              <Button variant="danger-outline" onClick={() => setConfirmDelete(true)}>Eliminar publicación</Button>
            </div>
          )}
        </>
      )}
      {confirmDelete && (
        <ConfirmModal
          title="¿Eliminar publicación?"
          message="Esta acción no se puede deshacer. La publicación desaparecerá del feed."
          confirmLabel="Eliminar"
          danger
          onCancel={() => setConfirmDelete(false)}
          onConfirm={remove}
        />
      )}
    </>
  )
}
