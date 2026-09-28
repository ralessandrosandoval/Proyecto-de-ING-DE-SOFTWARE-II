import { Link } from 'react-router-dom'
import { timeAgo } from '../utils/time'
import { Avatar } from './ui'

export default function PostCard({ post }) {
  return (
    <article className="post">
      <div className="post-header">
        <Avatar name={post.authorName} src={post.authorAvatar} />
        <div>
          <strong>{post.authorName}</strong>
          <div className="muted small">{timeAgo(post.createdAt)} · {post.authorLevel}</div>
        </div>
      </div>
      <Link to={`/session/${post.id}`} className="post-link">
        {post.mediaType === 'video' && post.media ? (
          <video className="post-media" src={post.media} controls />
        ) : post.media ? (
          <img className="post-media" src={post.media} alt={post.exercise} />
        ) : (
          <div className="post-media" />
        )}
        <div className="post-title">{post.exercise} · {post.weight || 0} kg · {post.sets || 0}x{post.reps || 0}</div>
      </Link>
      <p className="muted">{post.description}</p>
      {/* HU-007 (Release 2): estos chips todavía no hacen nada */}
      <div className="chips">
        <span className="chip">Fuerza {post.reactions}</span>
        <span className="chip">Comentar {post.comments}</span>
      </div>
    </article>
  )
}
