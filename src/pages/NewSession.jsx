import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { Button, ErrorBox, Input } from '../components/ui'
import { MEDIA_TYPES } from '../constants'
import { useAuth } from '../hooks/useAuth'
import { createPost } from '../services/api'
import { fileToDataUrl } from '../utils/image'

// HU-005: publicar sesión con foto/video, ejercicio, peso, series, reps y descripción
export default function NewSession() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [media, setMedia] = useState(null) // { url, type }
  const [form, setForm] = useState({ exercise: '', weight: '', sets: '', reps: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const pickFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (!MEDIA_TYPES.includes(file.type)) return setError('Formato no permitido')
    setError('')
    try {
      if (file.type === 'video/mp4') {
        // Solo dura mientras la pestaña está abierta; con el backend se sube el archivo
        setMedia({ url: URL.createObjectURL(file), type: 'video' })
      } else {
        setMedia({ url: await fileToDataUrl(file), type: 'image' })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const publish = async (e) => {
    e.preventDefault()
    if (!form.exercise.trim()) return setError('Indica el ejercicio')
    setError('')
    setLoading(true)
    try {
      await createPost(user, { ...form, exercise: form.exercise.trim(), media: media?.url ?? null, mediaType: media?.type ?? null })
      navigate('/')
    } catch {
      // permite reintentar (HU-005, escenario 5)
      setError('No se pudo subir. Revisa tu conexión e inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="Nueva sesión" />
      <form className="pad" onSubmit={publish} noValidate>
        <label className="dropzone">
          {media?.type === 'video' ? <video src={media.url} controls /> : media ? <img src={media.url} alt="Vista previa" /> : (
            <div className="center-text"><strong>Agregar foto o video</strong><div className="muted small">JPG, PNG o MP4</div></div>
          )}
          <input type="file" accept="image/jpeg,image/png,video/mp4" onChange={pickFile} hidden />
        </label>
        <Input label="Ejercicio" placeholder="Ej: Press de banca" value={form.exercise} onChange={set('exercise')} />
        <div className="row">
          <Input label="Peso (kg)" type="number" min="0" value={form.weight} onChange={set('weight')} />
          <Input label="Series" type="number" min="0" value={form.sets} onChange={set('sets')} />
          <Input label="Reps" type="number" min="0" value={form.reps} onChange={set('reps')} />
        </div>
        <Input label="Descripción y hashtags" multiline placeholder="¿Cómo fue tu entrenamiento? #liftup" value={form.description} onChange={set('description')} />
        <ErrorBox message={error} />
        <Button type="submit" loading={loading}>Publicar sesión</Button>
      </form>
    </>
  )
}
