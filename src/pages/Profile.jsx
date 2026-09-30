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

    </>
  )
}
