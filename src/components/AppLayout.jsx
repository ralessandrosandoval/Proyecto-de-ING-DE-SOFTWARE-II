import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="shell">
      <main className="shell-main"><Outlet /></main>
      <BottomNav />
    </div>
  )
}
