import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import TecnicoPanel from './pages/TecnicoPanel'
import ClienteArea from './pages/ClienteArea'
import Layout from './components/Layout'

function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={user ? <DashboardRoutes user={user} /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
  )
}

function DashboardRoutes({ user }) {
  return (
    <Routes>
      <Route path="/dashboard" element={<Navigate to={`/${user.rol.toLowerCase()}`} replace />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/tecnico" element={<TecnicoPanel />} />
      <Route path="/cliente" element={<ClienteArea />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App

