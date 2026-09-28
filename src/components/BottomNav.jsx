import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/', label: 'Feed', end: true, icon: <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /> },
  { to: '/new', label: 'Publicar', icon: <path d="M12 5v14M5 12h14" /> },
  { to: '/profile', label: 'Perfil', icon: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6" /> },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ to, label, end, icon }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
