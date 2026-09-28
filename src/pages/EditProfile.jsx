import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { Avatar, Button, ErrorBox, Input } from '../components/ui'
import { AVATAR_TYPES, LEVELS } from '../constants'
import { useAuth } from '../hooks/useAuth'
import { fileToDataUrl } from '../utils/image'

// HU-004: editar foto, nombre, nivel de experiencia y biografía
export default function EditProfile() {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)
  const [level, setLevel] = useState(user.level)
  const [avatar, setAvatar] = useState(user.avatar)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const pickAvatar = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    if (!AVATAR_TYPES.includes(file.type)) return setError('Formato no permitido, usa JPG o PNG')
    setError('')
    try {
      setAvatar(await fileToDataUrl(file, 256))
    } catch (err) {
      setError(err.message)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('El nombre no puede estar vacío')
    setError('')
    setLoading(true)
    try {
      await updateProfile({ name: name.trim(), bio, level, avatar })
      navigate('/profile')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="Editar perfil" back />
      <form className="pad" onSubmit={save} noValidate>
        <label className="avatar-pick">
          <Avatar name={name} src={avatar} size={96} />
          <span className="muted small">Cambiar foto</span>
          <input type="file" accept="image/jpeg,image/png" onChange={pickAvatar} hidden />
        </label>
        <Input label="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Biografía" multiline placeholder="Apasionado del fitness..." value={bio} onChange={(e) => setBio(e.target.value)} />
        <Input label="Nivel de experiencia" value={level} onChange={(e) => setLevel(e.target.value)}>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </Input>
        <ErrorBox message={error} />
        <Button type="submit" loading={loading}>Guardar cambios</Button>
      </form>
    </>
  )
}
