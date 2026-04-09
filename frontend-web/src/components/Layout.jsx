import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Bars3Icon, BellIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const rolPaths = {
    admin: '/admin',
    tecnico: '/tecnico',
    cliente: '/cliente'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return <Outlet />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 ml-2">Mantenimiento SENA</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <BellIcon className="h-6 w-6 text-gray-400" />
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">{user.nombre}</span>
                <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                  {user.rol.toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 text-gray-400 hover:text-gray-500"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed md:static inset-0 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out md:w-64 bg-white border-r shadow-lg md:shadow-none`}>
          <nav className="h-full">
            <div className="p-6">
              <h3 className="font-medium text-gray-900 mb-4">{user.rol.toUpperCase()}</h3>
              <a href={rolPaths[user.rol]} className="flex items-center px-3 py-2 text-gray-900 rounded-lg bg-gray-100 font-medium">
                <span>Dashboard</span>
              </a>
            </div>
          </nav>
        </div>
        <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

