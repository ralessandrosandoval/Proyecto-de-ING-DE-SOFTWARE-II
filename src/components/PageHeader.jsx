import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, back = false, action }) {
  const navigate = useNavigate()
  return (
    <header className="page-header">
      {back && <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Volver">←</button>}
      <h1>{title}</h1>
      <div className="spacer" />
      {action}
    </header>
  )
}
