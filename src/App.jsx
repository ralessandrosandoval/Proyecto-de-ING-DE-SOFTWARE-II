import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { ProtectedRoute, PublicOnlyRoute } from './components/RouteGuards'
import { AuthProvider } from './context/AuthContext'
import EditProfile from './pages/EditProfile'
import Feed from './pages/Feed'
import Login from './pages/Login'
import NewSession from './pages/NewSession'
import Profile from './pages/Profile'
import Register from './pages/Register'
import SessionDetail from './pages/SessionDetail'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Feed />} />
              <Route path="/new" element={<NewSession />} />
              <Route path="/session/:id" element={<SessionDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
