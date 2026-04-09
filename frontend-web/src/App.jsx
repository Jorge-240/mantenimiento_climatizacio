import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import TecnicoPanel from './pages/TecnicoPanel'
import ClienteArea from './pages/ClienteArea'
import Layout from './components/Layout'

function App() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
       <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin shadow-glow"></div>
       <p className="mt-4 text-slate-400 font-bold tracking-widest animate-pulse">CARGANDO SISTEMA...</p>
    </div>
  )

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={user ? <Navigate to={`/${user.rol.toLowerCase()}`} replace /> : <Login />} />
        
        {/* Rutas Privadas con Layout Cyber-Tech */}
        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to={`/${user.rol.toLowerCase()}`} replace />} />
          
          {/* Rutas por Rol */}
          <Route path="admin" element={user?.rol === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="tecnico" element={user?.rol === 'TECNICO' ? <TecnicoPanel /> : <Navigate to="/login" />} />
          <Route path="cliente" element={user?.rol === 'CLIENTE' ? <ClienteArea /> : <Navigate to="/login" />} />
          
          {/* Fallback */}
          <Route path="dashboard" element={<Navigate to={`/${user.rol?.toLowerCase()}`} replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App

